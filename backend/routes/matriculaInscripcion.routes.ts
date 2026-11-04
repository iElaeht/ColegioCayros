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

// Endpoint para listar inscripciones (útil si luego creas una vista en el panel syspanel)
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

export default router;