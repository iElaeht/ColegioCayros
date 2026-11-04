// backend/routes/matriculaInscripcion.routes.ts
import { Router, Request, Response } from "express";
import { prisma } from "../db";

const router = Router();

// Endpoint para registrar una nueva pre-inscripción o matrícula
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      nombresEstudiante,
      apellidosEstudiante,
      nivel,
      grado,
      nombresApoderado,
      telefono,
      email,
      mensaje,
    } = req.body;

    if (!nombresEstudiante || !apellidosEstudiante || !nivel || !grado || !nombresApoderado || !telefono) {
      return res.status(400).json({ error: "Faltan campos obligatorios para la inscripción." });
    }

    const nuevaInscripcion = await prisma.matriculaInscripcion.create({
      data: {
        nombresEstudiante: nombresEstudiante.trim(),
        apellidosEstudiante: apellidosEstudiante.trim(),
        nivel,
        grado,
        nombresApoderado: nombresApoderado.trim(),
        telefono: telefono.trim(),
        email: email ? email.trim() : null,
        mensaje: mensaje ? mensaje.trim() : null,
      },
    });

    res.status(201).json({
      message: "Inscripción registrada con éxito",
      data: nuevaInscripcion,
    });
  } catch (error) {
    console.error("Error al registrar la matrícula:", error);
    res.status(500).json({ error: "Error interno al procesar la inscripción" });
  }
});

// Endpoint para listar inscripciones (para el panel syspanel)
router.get("/", async (req: Request, res: Response) => {
  try {
    const inscripciones = await prisma.matriculaInscripcion.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(inscripciones);
  } catch (error) {
    console.error("Error al obtener inscripciones:", error);
    res.status(500).json({ error: "Error al obtener las inscripciones" });
  }
});

// Endpoint para eliminar una solicitud de inscripción por ID (para el panel syspanel)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.matriculaInscripcion.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Solicitud eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar la inscripción:", error);
    res.status(500).json({ error: "Error al eliminar la solicitud" });
  }
});

export default router;