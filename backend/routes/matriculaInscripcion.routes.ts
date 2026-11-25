import { Router, Request, Response } from "express";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { prisma } from "../db";

const router = Router();

// Ajusta esta carpeta si en pagosMatricula.routes.ts usas otro subdirectorio de uploads
const vouchersUploadDir = path.join(__dirname, "../uploads/vouchers");

function eliminarVoucherFisico(voucherUrl: string | null | undefined) {
  if (!voucherUrl) return;
  const safeName = path.basename(voucherUrl);
  if (!safeName || safeName === "." || safeName === "..") return;

  const resolvedBase = path.resolve(vouchersUploadDir);
  const resolvedFile = path.resolve(vouchersUploadDir, safeName);
  if (!resolvedFile.startsWith(resolvedBase + path.sep)) return;

  if (fs.existsSync(resolvedFile)) {
    try {
      fs.unlinkSync(resolvedFile);
    } catch (err) {
      console.error(`Error al eliminar archivo de voucher ${safeName}:`, err);
    }
  }
}

function generarCodigoPago(): string {
  const year = new Date().getFullYear();
  const randomDigits = crypto.randomInt(10000, 100000);
  return `PAG-CAY${year}-${randomDigits}`;
}

function construirPasswordPago(dniEstudiante: string): string {
  return `PGCAYR${dniEstudiante.trim().toUpperCase()}`;
}

function hashearPasswordPago(passwordClara: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(passwordClara, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function normalizarMayusculas(texto: string): string {
  return texto.trim().replace(/\s+/g, " ").toUpperCase();
}

function normalizarComparacion(texto: string): string {
  return normalizarMayusculas(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

router.get("/verificar-dni", async (req: Request, res: Response) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    const dni = String(req.query.dni || "").trim();

    if (!/^\d{8}$/.test(dni)) {
      return res.status(400).json({
        existe: false,
        error: "El DNI debe contener exactamente 8 dígitos numéricos.",
      });
    }

    const existente = await prisma.matriculaInscripcion.findFirst({
      where: { dniEstudiante: dni },
      select: { id: true },
    });

    return res.json({ existe: Boolean(existente) });
  } catch (error) {
    console.error("Error al verificar DNI:", error);
    return res.status(500).json({ existe: false, error: "Error al verificar DNI." });
  }
});

router.post("/consultar-credenciales", async (req: Request, res: Response) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    const { nombresEstudiante, apellidosEstudiante, dniEstudiante } = req.body;
    const dniLimpio = String(dniEstudiante || "").trim();

    if (
      !nombresEstudiante ||
      !String(nombresEstudiante).trim() ||
      !apellidosEstudiante ||
      !String(apellidosEstudiante).trim() ||
      !/^\d{8}$/.test(dniLimpio)
    ) {
      return res.status(400).json({
        encontrado: false,
        message: "Ingresa nombres, apellidos y DNI válidos de 8 dígitos.",
      });
    }

    const registrosPorDni = await prisma.matriculaInscripcion.findMany({
      where: { dniEstudiante: dniLimpio },
      include: {
        pagoMatricula: {
          select: {
            codigoPago: true,
            estado: true,
          },
        },
      },
    });

    const coincidencia = registrosPorDni.find(
      (item) =>
        normalizarComparacion(item.nombresEstudiante) ===
          normalizarComparacion(String(nombresEstudiante)) &&
        normalizarComparacion(item.apellidosEstudiante) ===
          normalizarComparacion(String(apellidosEstudiante)),
    );

    if (!coincidencia || !coincidencia.pagoMatricula) {
      return res.status(404).json({
        encontrado: false,
        message: "No estás Matriculado, Matricúlate para ser Parte de esta gran Familia Cayrina.",
      });
    }

    return res.json({
      encontrado: true,
      credencialesPago: {
        codigoPago: coincidencia.pagoMatricula.codigoPago,
        passwordPago: construirPasswordPago(coincidencia.dniEstudiante),
        estado: coincidencia.pagoMatricula.estado,
      },
    });
  } catch (error) {
    console.error("Error al consultar credenciales:", error);
    return res.status(500).json({
      encontrado: false,
      message: "Error interno al consultar las credenciales.",
    });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      sede,
      nombresEstudiante,
      apellidosEstudiante,
      dniEstudiante,
      nivel,
      grado,
      nombresApoderado,
      telefono,
      email,
      mensaje,
      tieneOpcion,
      detalleOpcion,
    } = req.body;

    if (
      !sede ||
      !nombresEstudiante ||
      !apellidosEstudiante ||
      !dniEstudiante ||
      !nivel ||
      !grado ||
      !nombresApoderado ||
      !telefono
    ) {
      return res.status(400).json({ error: "Faltan campos obligatorios para la inscripción." });
    }

    if (tieneOpcion === "Si" && (!detalleOpcion || String(detalleOpcion).trim() === "")) {
      return res.status(400).json({
        error: "El nombre de la institución de procedencia es obligatorio si provienes de otro colegio.",
      });
    }

    const dniLimpio = String(dniEstudiante).trim();
    if (!/^\d{8}$/.test(dniLimpio)) {
      return res.status(400).json({ error: "El DNI debe contener exactamente 8 dígitos numéricos." });
    }

    const passwordClara = construirPasswordPago(dniLimpio);
    const passwordHash = hashearPasswordPago(passwordClara);

    const resultado = await prisma.$transaction(async (tx) => {
      const yaExiste = await tx.matriculaInscripcion.findFirst({
        where: { dniEstudiante: dniLimpio },
        select: { id: true },
      });

      if (yaExiste) {
        return { duplicado: true as const };
      }

      const nuevaInscripcion = await tx.matriculaInscripcion.create({
        data: {
          sede: String(sede).trim(),
          nombresEstudiante: normalizarMayusculas(String(nombresEstudiante)),
          apellidosEstudiante: normalizarMayusculas(String(apellidosEstudiante)),
          dniEstudiante: dniLimpio,
          nivel: String(nivel).trim(),
          grado: String(grado).trim(),
          nombresApoderado: normalizarMayusculas(String(nombresApoderado)),
          telefono: String(telefono).trim(),
          email: email ? String(email).trim().toLowerCase() : null,
          mensaje: mensaje ? normalizarMayusculas(String(mensaje)) : null,
          tieneOpcion: tieneOpcion ? String(tieneOpcion).trim() : null,
          detalleOpcion:
            tieneOpcion === "Si" && detalleOpcion
              ? normalizarMayusculas(String(detalleOpcion))
              : null,
        },
      });

      let codigoPago = generarCodigoPago();
      let existeCodigo = await tx.pagoMatricula.findUnique({ where: { codigoPago } });
      while (existeCodigo) {
        codigoPago = generarCodigoPago();
        existeCodigo = await tx.pagoMatricula.findUnique({ where: { codigoPago } });
      }

      const pagoCreado = await tx.pagoMatricula.create({
        data: {
          codigoPago,
          passwordPago: passwordHash,
          estado: "PENDIENTE_SUBIDA",
          accesoHabilitado: true,
          matriculaId: nuevaInscripcion.id,
        },
      });

      return { duplicado: false as const, nuevaInscripcion, pagoCreado };
    });

    if (resultado.duplicado) {
      return res.status(409).json({
        error:
          "Este DNI ya se encuentra registrado en el sistema. Si olvidaste tus datos, usa Consultar Credenciales.",
      });
    }

    return res.status(201).json({
      message: "Inscripción registrada con éxito",
      data: resultado.nuevaInscripcion,
      credencialesPago: {
        codigoPago: resultado.pagoCreado.codigoPago,
        passwordPago: passwordClara,
        estado: resultado.pagoCreado.estado,
      },
    });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return res.status(409).json({
        error:
          "Este DNI ya se encuentra registrado en el sistema. Si olvidaste tus datos, usa Consultar Credenciales.",
      });
    }
    console.error("Error al registrar la matrícula:", error);
    return res.status(500).json({ error: "Error interno al procesar la inscripción" });
  }
});

router.post("/importar", async (req: Request, res: Response) => {
  try {
    const { matriculas } = req.body;

    if (!Array.isArray(matriculas) || matriculas.length === 0) {
      return res.status(400).json({ error: "No se proporcionaron datos válidos para importar" });
    }

    const datosAInsertar = matriculas
      .map((item: any) => ({
        sede: String(item.sede || item.SEDE || "Colegio Cayros").trim(),
        nombresEstudiante: normalizarMayusculas(
          String(item.nombresestudiante || item.NOMBRES_ESTUDIANTE || item.nombres || ""),
        ),
        apellidosEstudiante: normalizarMayusculas(
          String(item.apellidosestudiante || item.APELLIDOS_ESTUDIANTE || item.apellidos || ""),
        ),
        dniEstudiante: String(item.dniestudiante || item.DNI_ESTUDIANTE || item.dni || "").trim(),
        nivel: String(item.nivel || item.NIVEL || "Primaria").trim(),
        grado: String(item.grado || item.GRADO || "1ro").trim(),
        nombresApoderado: normalizarMayusculas(
          String(item.nombresapoderado || item.NOMBRES_APODERADO || item.apoderado || ""),
        ),
        telefono: String(item.telefono || item.TELEFONO || "").trim(),
        email:
          item.email || item.EMAIL ? String(item.email || item.EMAIL).trim().toLowerCase() : null,
        mensaje:
          item.mensaje || item.MENSAJE
            ? normalizarMayusculas(String(item.mensaje || item.MENSAJE))
            : null,
        tieneOpcion:
          item.tieneOpcion || item.TIENE_OPCION
            ? String(item.tieneOpcion || item.TIENE_OPCION).trim()
            : null,
        detalleOpcion:
          item.detalleOpcion || item.DETALLE_OPCION
            ? normalizarMayusculas(String(item.detalleOpcion || item.DETALLE_OPCION))
            : null,
      }))
      .filter(
        (item) =>
          /^\d{8}$/.test(item.dniEstudiante) &&
          item.nombresEstudiante.length > 0 &&
          item.apellidosEstudiante.length > 0,
      );

    if (datosAInsertar.length === 0) {
      return res.status(400).json({
        error: "Ningún registro cumple con DNI de 8 dígitos, nombres y apellidos válidos.",
      });
    }

    const resultado = await prisma.matriculaInscripcion.createMany({
      data: datosAInsertar,
      skipDuplicates: true,
    });

    return res.status(201).json({
      success: true,
      message: `${resultado.count} matrículas importadas correctamente`,
      count: resultado.count,
    });
  } catch (error) {
    console.error("Error en la importación masiva de matrículas:", error);
    return res
      .status(500)
      .json({ error: "No se pudieron importar las matrículas en la base de datos" });
  }
});

router.post("/eliminar-masivo", async (req: Request, res: Response) => {
  try {
    const rawIds: unknown[] = Array.isArray(req.body?.ids) ? req.body.ids : [];
    const ids: number[] = Array.from<number>(
      new Set<number>(
        rawIds
          .map((id: unknown): number => Number(id))
          .filter((id: number): id is number => Number.isInteger(id) && id > 0),
      ),
    );

    if (ids.length === 0) {
      return res.status(400).json({ error: "Debes enviar al menos un ID válido para eliminar." });
    }

    const pagosConVoucher = await prisma.pagoMatricula.findMany({
      where: { matriculaId: { in: ids }, voucherUrl: { not: null } },
      select: { voucherUrl: true },
    });

    const eliminado = await prisma.$transaction(async (tx) => {
      await tx.pagoMatricula.deleteMany({
        where: { matriculaId: { in: ids } },
      });

      return tx.matriculaInscripcion.deleteMany({
        where: { id: { in: ids } },
      });
    });

    for (const pago of pagosConVoucher) {
      eliminarVoucherFisico(pago.voucherUrl);
    }

    return res.json({
      message: `${eliminado.count} solicitud(es) eliminada(s) con éxito.`,
      count: eliminado.count,
    });
  } catch (error) {
    console.error("Error al eliminar solicitudes en masa:", error);
    return res
      .status(500)
      .json({ error: "Error interno al eliminar las solicitudes seleccionadas." });
  }
});

router.get("/", async (req: Request, res: Response) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    const inscripciones = await prisma.matriculaInscripcion.findMany({
      include: {
        pagoMatricula: {
          select: {
            id: true,
            codigoPago: true,
            estado: true,
            accesoHabilitado: true,
            habilitadoHasta: true,
            numeroOperacion: true,
            montoPagado: true,
            fechaSubidaVoucher: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return res.json(inscripciones);
  } catch (error) {
    console.error("Error al obtener inscripciones:", error);
    return res.status(500).json({ error: "Error al obtener las inscripciones" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const idNum = Number(req.params.id);
    if (!Number.isInteger(idNum) || idNum <= 0) {
      return res.status(400).json({ error: "ID de solicitud inválido." });
    }

    const {
      sede,
      nombresEstudiante,
      apellidosEstudiante,
      dniEstudiante,
      nivel,
      grado,
      nombresApoderado,
      telefono,
      email,
      mensaje,
      tieneOpcion,
      detalleOpcion,
    } = req.body;

    const matriculaActualizada = await prisma.matriculaInscripcion.update({
      where: { id: idNum },
      data: {
        sede: sede !== undefined ? String(sede).trim() : undefined,
        nombresEstudiante:
          nombresEstudiante !== undefined
            ? normalizarMayusculas(String(nombresEstudiante))
            : undefined,
        apellidosEstudiante:
          apellidosEstudiante !== undefined
            ? normalizarMayusculas(String(apellidosEstudiante))
            : undefined,
        dniEstudiante: dniEstudiante !== undefined ? String(dniEstudiante).trim() : undefined,
        nivel: nivel !== undefined ? String(nivel).trim() : undefined,
        grado: grado !== undefined ? String(grado).trim() : undefined,
        nombresApoderado:
          nombresApoderado !== undefined
            ? normalizarMayusculas(String(nombresApoderado))
            : undefined,
        telefono: telefono !== undefined ? String(telefono).trim() : undefined,
        email: email !== undefined ? (email ? String(email).trim().toLowerCase() : null) : undefined,
        mensaje:
          mensaje !== undefined ? (mensaje ? normalizarMayusculas(String(mensaje)) : null) : undefined,
        tieneOpcion:
          tieneOpcion !== undefined ? (tieneOpcion ? String(tieneOpcion).trim() : null) : undefined,
        detalleOpcion:
          tieneOpcion !== undefined
            ? tieneOpcion === "Si" && detalleOpcion
              ? normalizarMayusculas(String(detalleOpcion))
              : null
            : undefined,
      },
    });

    return res.json({ message: "Solicitud actualizada con éxito", data: matriculaActualizada });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return res.status(404).json({ error: "La solicitud no existe." });
    }
    console.error("Error al actualizar la inscripción:", error);
    return res.status(500).json({ error: "Error al actualizar la solicitud" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const idNum = Number(req.params.id);
    if (!Number.isInteger(idNum) || idNum <= 0) {
      return res.status(400).json({ error: "ID de solicitud inválido." });
    }

    const pagoAsociado = await prisma.pagoMatricula.findUnique({
      where: { matriculaId: idNum },
      select: { voucherUrl: true },
    });

    await prisma.$transaction(async (tx) => {
      await tx.pagoMatricula.deleteMany({
        where: { matriculaId: idNum },
      });

      await tx.matriculaInscripcion.delete({
        where: { id: idNum },
      });
    });

    eliminarVoucherFisico(pagoAsociado?.voucherUrl);

    return res.json({ message: "Solicitud eliminada con éxito" });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return res.status(404).json({ error: "La solicitud no existe." });
    }
    console.error("Error al eliminar la inscripción:", error);
    return res.status(500).json({ error: "Error al eliminar la solicitud" });
  }
});

export default router;