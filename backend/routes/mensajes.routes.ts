import { Router, Request, Response } from "express";
import { prisma } from "../db";

const router = Router();

function parseFechaSegura(valorFecha: unknown): Date | undefined {
  if (!valorFecha) return undefined;
  const fecha = new Date(String(valorFecha));
  return Number.isNaN(fecha.getTime()) ? undefined : fecha;
}

// 1. Obtener la lista completa de mensajes para el Dashboard
router.get("/", async (req: Request, res: Response) => {
  try {
    const mensajes = await prisma.mensajeContacto.findMany({
      orderBy: { fecha: "desc" },
    });
    return res.status(200).json(mensajes);
  } catch (error) {
    console.error("Error al obtener mensajes:", error);
    return res.status(500).json({ error: "No se pudieron obtener los mensajes" });
  }
});

// 2. Obtener un mensaje específico por ID (UUID String)
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id || "").trim();
    if (!id) {
      return res.status(400).json({ error: "ID de mensaje inválido" });
    }

    const mensaje = await prisma.mensajeContacto.findUnique({
      where: { id },
    });

    if (!mensaje) {
      return res.status(404).json({ error: "Mensaje no encontrado" });
    }

    return res.status(200).json(mensaje);
  } catch (error) {
    console.error("Error al obtener el mensaje:", error);
    return res.status(500).json({ error: "No se pudo obtener el mensaje" });
  }
});

// 3. Guardar un nuevo mensaje individual desde el formulario público
router.post("/", async (req: Request, res: Response) => {
  try {
    const dni = String(req.body?.dni || "").trim();
    const nombre = String(req.body?.nombre || "").trim();
    const telefono = String(req.body?.telefono || "").trim();
    const asunto = String(req.body?.asunto || "").trim();

    if (!dni || !nombre || !telefono || !asunto) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const nuevoMensaje = await prisma.mensajeContacto.create({
      data: { dni, nombre, telefono, asunto },
    });

    return res.status(201).json({ success: true, data: nuevoMensaje });
  } catch (error) {
    console.error("Error al guardar mensaje:", error);
    return res.status(500).json({ error: "No se pudo guardar el mensaje en la base de datos" });
  }
});

// 3.1. Importación masiva de mensajes (Desde Excel / CSV)
router.post("/importar", async (req: Request, res: Response) => {
  try {
    const { mensajes } = req.body;

    if (!Array.isArray(mensajes) || mensajes.length === 0) {
      return res.status(400).json({ error: "No se proporcionaron datos válidos para importar" });
    }

    const datosAInsertar = mensajes
      .map((msg: any) => {
        const fechaParseada = parseFechaSegura(msg?.fecha ?? msg?.FECHA);
        return {
          dni: String(msg?.dni ?? msg?.DNI ?? "").trim(),
          nombre: String(msg?.nombre ?? msg?.NOMBRE ?? "").trim(),
          telefono: String(msg?.telefono ?? msg?.TELEFONO ?? "").trim(),
          asunto: String(msg?.asunto ?? msg?.ASUNTO ?? "").trim(),
          ...(fechaParseada ? { fecha: fechaParseada } : {}),
        };
      })
      .filter((item) => item.dni || item.nombre || item.telefono || item.asunto);

    if (datosAInsertar.length === 0) {
      return res.status(400).json({ error: "No hay filas con datos válidos para importar" });
    }

    const resultado = await prisma.mensajeContacto.createMany({
      data: datosAInsertar,
      skipDuplicates: true,
    });

    return res.status(201).json({
      success: true,
      message: `${resultado.count} registros importados correctamente`,
      count: resultado.count,
    });
  } catch (error) {
    console.error("Error en la importación masiva de mensajes:", error);
    return res
      .status(500)
      .json({ error: "No se pudieron importar los registros en la base de datos" });
  }
});

// 3.2. Eliminación masiva de mensajes seleccionados
router.post("/eliminar-masivo", async (req: Request, res: Response) => {
  try {
    const rawIds: unknown[] = Array.isArray(req.body?.ids) ? req.body.ids : [];
    const ids: string[] = Array.from<string>(
      new Set<string>(
        rawIds
          .map((id: unknown): string => String(id ?? "").trim())
          .filter((id: string): id is string => id.length > 0),
      ),
    );

    if (ids.length === 0) {
      return res.status(400).json({ error: "Debes enviar al menos un ID válido para eliminar" });
    }

    const resultado = await prisma.mensajeContacto.deleteMany({
      where: { id: { in: ids } },
    });

    return res.status(200).json({
      success: true,
      message: `${resultado.count} mensaje(s) eliminado(s) correctamente`,
      count: resultado.count,
    });
  } catch (error) {
    console.error("Error al eliminar mensajes en masa:", error);
    return res.status(500).json({ error: "No se pudieron eliminar los mensajes seleccionados" });
  }
});

// 4. Actualizar un mensaje existente por ID
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id || "").trim();
    if (!id) {
      return res.status(400).json({ error: "ID de mensaje inválido" });
    }

    const dni = req.body?.dni !== undefined ? String(req.body.dni).trim() : undefined;
    const nombre = req.body?.nombre !== undefined ? String(req.body.nombre).trim() : undefined;
    const telefono =
      req.body?.telefono !== undefined ? String(req.body.telefono).trim() : undefined;
    const asunto = req.body?.asunto !== undefined ? String(req.body.asunto).trim() : undefined;

    const mensajeActualizado = await prisma.mensajeContacto.update({
      where: { id },
      data: {
        ...(dni !== undefined && { dni }),
        ...(nombre !== undefined && { nombre }),
        ...(telefono !== undefined && { telefono }),
        ...(asunto !== undefined && { asunto }),
      },
    });

    return res.status(200).json({ success: true, data: mensajeActualizado });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return res.status(404).json({ error: "Mensaje no encontrado" });
    }
    console.error("Error al actualizar el mensaje:", error);
    return res.status(500).json({ error: "No se pudo actualizar el mensaje" });
  }
});

// 5. Eliminar un mensaje por ID
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id || "").trim();
    if (!id) {
      return res.status(400).json({ error: "ID de mensaje inválido" });
    }

    await prisma.mensajeContacto.delete({
      where: { id },
    });

    return res.status(200).json({ success: true, message: "Mensaje eliminado correctamente" });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return res.status(404).json({ error: "Mensaje no encontrado" });
    }
    console.error("Error al eliminar el mensaje:", error);
    return res.status(500).json({ error: "No se pudo eliminar el mensaje" });
  }
});

export default router;