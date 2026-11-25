import { Router, Request, Response } from "express";
import crypto from "crypto";
import { EstadoPagoMatricula } from "@prisma/client";
import { prisma } from "../db";

const router = Router();

const HORAS_REINTENTO_RECHAZO = 48;

const ESTADOS_VALIDOS: EstadoPagoMatricula[] = [
  "PENDIENTE_SUBIDA",
  "EN_REVISION",
  "OBSERVADO_RECHAZADO",
  "CONFIRMADO",
  "COMPLETADO",
];

function verificarPasswordPago(passwordIngresada: string, hashAlmacenado: string): boolean {
  const partes = hashAlmacenado.split(":");
  if (partes.length !== 2) return false;

  const [salt, hashHex] = partes;
  const hashBuffer = Buffer.from(hashHex, "hex");
  const derivadaBuffer = crypto.scryptSync(passwordIngresada.trim().toUpperCase(), salt, 64);

  if (hashBuffer.length !== derivadaBuffer.length) return false;
  return crypto.timingSafeEqual(hashBuffer, derivadaBuffer);
}

function evaluarDisponibilidadSubida(pago: {
  estado: EstadoPagoMatricula;
  accesoHabilitado: boolean;
  habilitadoHasta: Date | null;
}) {
  const ahora = new Date();

  if (pago.estado === "CONFIRMADO" || pago.estado === "COMPLETADO") {
    return {
      puedeSubir: false,
      plazoVencido: false,
      motivoBloqueo: "El pago ya fue gestionado o cerrado.",
    };
  }

  if (pago.estado === "EN_REVISION") {
    return {
      puedeSubir: false,
      plazoVencido: false,
      motivoBloqueo: "Tu comprobante ya fue enviado y se encuentra en revisión.",
    };
  }

  if (pago.estado === "OBSERVADO_RECHAZADO") {
    if (!pago.habilitadoHasta || ahora > new Date(pago.habilitadoHasta)) {
      return {
        puedeSubir: false,
        plazoVencido: true,
        motivoBloqueo: "El plazo de 48 horas para reenviar el comprobante ha vencido.",
      };
    }
    return { puedeSubir: true, plazoVencido: false, motivoBloqueo: null };
  }

  if (!pago.accesoHabilitado) {
    return {
      puedeSubir: false,
      plazoVencido: false,
      motivoBloqueo: "El acceso para subir comprobante se encuentra cerrado.",
    };
  }

  return { puedeSubir: true, plazoVencido: false, motivoBloqueo: null };
}

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { codigoPago, passwordPago } = req.body;

    if (!codigoPago || !passwordPago) {
      return res.status(400).json({ error: "Debes ingresar tu ID de pago y contraseña." });
    }

    const pago = await prisma.pagoMatricula.findUnique({
      where: { codigoPago: String(codigoPago).trim().toUpperCase() },
      include: {
        matricula: {
          select: {
            id: true,
            sede: true,
            nombresEstudiante: true,
            apellidosEstudiante: true,
            dniEstudiante: true,
            nivel: true,
            grado: true,
            nombresApoderado: true,
          },
        },
      },
    });

    if (!pago || !verificarPasswordPago(String(passwordPago), pago.passwordPago)) {
      return res.status(401).json({
        error: "Credenciales inválidas. Verifica tu ID de pago y contraseña.",
      });
    }

    const disponibilidad = evaluarDisponibilidadSubida(pago);

    if (pago.estado === "OBSERVADO_RECHAZADO" && disponibilidad.plazoVencido && pago.accesoHabilitado) {
      await prisma.pagoMatricula.update({
        where: { id: pago.id },
        data: { accesoHabilitado: false },
      });
    }

    return res.json({
      message: "Acceso concedido",
      pago: {
        id: pago.id,
        codigoPago: pago.codigoPago,
        estado: pago.estado,
        accesoHabilitado: disponibilidad.puedeSubir,
        habilitadoHasta: pago.habilitadoHasta,
        puedeSubir: disponibilidad.puedeSubir,
        plazoVencido: disponibilidad.plazoVencido,
        motivoBloqueo: disponibilidad.motivoBloqueo,
        mensajeAdmin: pago.mensajeAdmin,
        numeroOperacion: pago.numeroOperacion,
        bancoOrigen: pago.bancoOrigen,
        montoPagado: pago.montoPagado,
        voucherUrl: pago.voucherUrl,
        fechaSubidaVoucher: pago.fechaSubidaVoucher,
        fechaRevision: pago.fechaRevision,
      },
      matricula: pago.matricula,
    });
  } catch (error) {
    console.error("Error en login de pagos-institucional:", error);
    return res.status(500).json({ error: "Error interno al validar credenciales de pago." });
  }
});

router.post("/subir-voucher", async (req: Request, res: Response) => {
  try {
    const { codigoPago, passwordPago, voucherUrl, numeroOperacion, bancoOrigen, montoPagado } =
      req.body;

    if (!codigoPago || !passwordPago || !voucherUrl) {
      return res
        .status(400)
        .json({ error: "Faltan datos obligatorios para registrar el voucher." });
    }

    const codigoNormalizado = String(codigoPago).trim().toUpperCase();

    const pago = await prisma.pagoMatricula.findUnique({
      where: { codigoPago: codigoNormalizado },
    });

    if (!pago || !verificarPasswordPago(String(passwordPago), pago.passwordPago)) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    const disponibilidad = evaluarDisponibilidadSubida(pago);
    if (!disponibilidad.puedeSubir) {
      return res.status(403).json({
        error:
          disponibilidad.motivoBloqueo ||
          "No está habilitada la subida de comprobante para este ID.",
      });
    }

    if (numeroOperacion && String(numeroOperacion).trim() !== "") {
      const opLimpia = String(numeroOperacion).trim();
      const duplicado = await prisma.pagoMatricula.findFirst({
        where: {
          numeroOperacion: opLimpia,
          NOT: { id: pago.id },
        },
      });

      if (duplicado) {
        return res.status(409).json({
          error: "Este número de operación ya fue registrado en otra solicitud.",
        });
      }
    }

    const pagoActualizado = await prisma.pagoMatricula.update({
      where: { id: pago.id },
      data: {
        voucherUrl: String(voucherUrl).trim(),
        numeroOperacion: numeroOperacion ? String(numeroOperacion).trim() : null,
        bancoOrigen: bancoOrigen ? String(bancoOrigen).trim() : null,
        montoPagado:
          montoPagado !== undefined && montoPagado !== null && montoPagado !== ""
            ? Number(montoPagado)
            : null,
        fechaSubidaVoucher: new Date(),
        estado: "EN_REVISION",
        accesoHabilitado: false,
      },
    });

    return res.json({
      message:
        "Comprobante enviado. Tu solicitud quedó en revisión y el ID se cerró temporalmente.",
      pago: {
        id: pagoActualizado.id,
        codigoPago: pagoActualizado.codigoPago,
        estado: pagoActualizado.estado,
        accesoHabilitado: pagoActualizado.accesoHabilitado,
        fechaSubidaVoucher: pagoActualizado.fechaSubidaVoucher,
      },
    });
  } catch (error) {
    console.error("Error al subir voucher:", error);
    return res.status(500).json({ error: "Error interno al guardar el comprobante de pago." });
  }
});

router.get("/", async (_req: Request, res: Response) => {
  try {
    const pagos = await prisma.pagoMatricula.findMany({
      include: {
        matricula: true,
      },
      orderBy: { updatedAt: "desc" },
    });
    return res.json(pagos);
  } catch (error) {
    console.error("Error al listar pagos de matrícula:", error);
    return res.status(500).json({ error: "Error al obtener los registros de pago." });
  }
});

router.patch("/:id/estado", async (req: Request, res: Response) => {
  try {
    const pagoId = Number(req.params.id);
    if (!Number.isInteger(pagoId) || pagoId <= 0) {
      return res.status(400).json({ error: "ID de pago inválido." });
    }

    const { estado, mensajeAdmin, revisadoPor } = req.body;

    if (!ESTADOS_VALIDOS.includes(estado)) {
      return res.status(400).json({ error: "Estado de pago no válido." });
    }

    const ahora = new Date();
    let accesoHabilitado = false;
    let habilitadoHasta: Date | null = null;

    if (estado === "OBSERVADO_RECHAZADO") {
      accesoHabilitado = true;
      habilitadoHasta = new Date(ahora.getTime() + HORAS_REINTENTO_RECHAZO * 60 * 60 * 1000);
    } else if (estado === "PENDIENTE_SUBIDA") {
      accesoHabilitado = true;
      habilitadoHasta = null;
    } else {
      accesoHabilitado = false;
      habilitadoHasta = null;
    }

    const pagoActualizado = await prisma.pagoMatricula.update({
      where: { id: pagoId },
      data: {
        estado,
        accesoHabilitado,
        habilitadoHasta,
        mensajeAdmin:
          mensajeAdmin !== undefined && String(mensajeAdmin).trim() !== ""
            ? String(mensajeAdmin).trim()
            : null,
        revisadoPor: revisadoPor ? String(revisadoPor).trim() : null,
        fechaRevision: ahora,
      },
      include: {
        matricula: true,
      },
    });

    return res.json({
      message: "Estado de pago actualizado correctamente",
      data: pagoActualizado,
    });
  } catch (error) {
    console.error("Error al actualizar estado de pago:", error);
    return res.status(500).json({ error: "Error al actualizar el estado del pago." });
  }
});

router.post("/importar", async (req: Request, res: Response) => {
  try {
    const registros = Array.isArray(req.body?.pagos)
      ? req.body.pagos
      : Array.isArray(req.body)
      ? req.body
      : [];

    if (registros.length === 0) {
      return res.status(400).json({ error: "No se enviaron registros válidos para importar." });
    }

    let actualizados = 0;

    for (const raw of registros) {
      const codigoRaw = raw.codigopago ?? raw.codigoPago;
      if (!codigoRaw || String(codigoRaw).trim() === "") continue;

      const codigoPago = String(codigoRaw).trim().toUpperCase();
      const existente = await prisma.pagoMatricula.findUnique({
        where: { codigoPago },
      });

      if (!existente) continue;

      const estadoRaw = String(raw.estado ?? existente.estado)
        .trim()
        .toUpperCase() as EstadoPagoMatricula;
      const estadoFinal = ESTADOS_VALIDOS.includes(estadoRaw) ? estadoRaw : existente.estado;

      const mensajeRaw = raw.mensajeadmin ?? raw.mensajeAdmin;
      const revisadoRaw = raw.revisadopor ?? raw.revisadoPor;

      await prisma.pagoMatricula.update({
        where: { id: existente.id },
        data: {
          estado: estadoFinal,
          mensajeAdmin:
            mensajeRaw !== undefined && String(mensajeRaw).trim() !== ""
              ? String(mensajeRaw).trim()
              : existente.mensajeAdmin,
          revisadoPor:
            revisadoRaw !== undefined && String(revisadoRaw).trim() !== ""
              ? String(revisadoRaw).trim()
              : existente.revisadoPor,
          fechaRevision: new Date(),
        },
      });

      actualizados++;
    }

    return res.json({
      message: `Importación completada. Registros actualizados: ${actualizados}.`,
      actualizados,
    });
  } catch (error) {
    console.error("Error al importar pagos de matrícula:", error);
    return res.status(500).json({ error: "Error interno al importar registros de pago." });
  }
});

// Eliminación por lote (seleccionados o tabla)
router.post("/eliminar-lote", async (req: Request, res: Response) => {
  try {
    const rawIds = Array.isArray(req.body?.ids) ? req.body.ids : [];
    const ids = rawIds
      .map((n: unknown) => Number(n))
      .filter((n: number) => Number.isInteger(n) && n > 0);

    if (ids.length === 0) {
      return res.status(400).json({ error: "Debes enviar al menos un ID válido para eliminar." });
    }

    const resultado = await prisma.pagoMatricula.deleteMany({
      where: { id: { in: ids } },
    });

    return res.json({
      message: "Registros eliminados correctamente",
      eliminados: resultado.count,
    });
  } catch (error) {
    console.error("Error al eliminar pagos en lote:", error);
    return res.status(500).json({ error: "Error interno al eliminar los registros." });
  }
});

// Eliminación individual por ID
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const pagoId = Number(req.params.id);
    if (!Number.isInteger(pagoId) || pagoId <= 0) {
      return res.status(400).json({ error: "ID de pago inválido." });
    }

    await prisma.pagoMatricula.delete({
      where: { id: pagoId },
    });

    return res.json({
      message: "Registro de pago eliminado correctamente",
      id: pagoId,
    });
  } catch (error: unknown) {
    const prismaError = error as { code?: string };
    if (prismaError?.code === "P2025") {
      return res.status(404).json({ error: "El registro de pago no existe." });
    }
    console.error("Error al eliminar pago de matrícula:", error);
    return res.status(500).json({ error: "Error interno al eliminar el registro de pago." });
  }
});

export default router;