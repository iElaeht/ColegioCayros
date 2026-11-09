// backend/routes/matriculaInscripcion.routes.ts
import { Router, Request, Response } from "express";
import { prisma } from "../db";

const router = Router();

// Endpoint para registrar una nueva pre-inscripción o matrícula
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

    const nuevaInscripcion = await prisma.matriculaInscripcion.create({
      data: {
        sede: sede.trim(),
        nombresEstudiante: nombresEstudiante.trim(),
        apellidosEstudiante: apellidosEstudiante.trim(),
        dniEstudiante: dniEstudiante.trim(),
        nivel,
        grado,
        nombresApoderado: nombresApoderado.trim(),
        telefono: telefono.trim(),
        email: email ? email.trim() : null,
        mensaje: mensaje ? mensaje.trim() : null,
      },
    });

    return res.status(201).json({
      message: "Inscripción registrada con éxito",
      data: nuevaInscripcion,
    });
  } catch (error) {
    console.error("Error al registrar la matrícula:", error);
    return res.status(500).json({ error: "Error interno al procesar la inscripción" });
  }
});

// NUEVO: Importación masiva de matrículas (Desde Excel / CSV)
router.post("/importar", async (req: Request, res: Response) => {
  try {
    const { matriculas } = req.body;

    if (!Array.isArray(matriculas) || matriculas.length === 0) {
      return res.status(400).json({ error: "No se proporcionaron datos válidos para importar" });
    }

    // Mapeo y normalización inteligente de los datos leídos del archivo
    const datosAInsertar = matriculas.map((item: any) => ({
      sede: String(item.sede || item.SEDE || "Principal").trim(),
      nombresEstudiante: String(item.nombresestudiante || item.NOMBRES_ESTUDIANTE || item.nombres || "").trim(),
      apellidosEstudiante: String(item.apellidosestudiante || item.APELLIDOS_ESTUDIANTE || item.apellidos || "").trim(),
      dniEstudiante: String(item.dniestudiante || item.DNI_ESTUDIANTE || item.dni || "").trim(),
      nivel: String(item.nivel || item.NIVEL || "Primaria").trim(),
      grado: String(item.grado || item.GRADO || "1ro").trim(),
      nombresApoderado: String(item.nombresapoderado || item.NOMBRES_APODERADO || item.apoderado || "").trim(),
      telefono: String(item.telefono || item.TELEFONO || "").trim(),
      email: item.email || item.EMAIL ? String(item.email || item.EMAIL).trim() : null,
      mensaje: item.mensaje || item.MENSAJE ? String(item.mensaje || item.MENSAJE).trim() : null,
    }));

    const resultado = await prisma.matriculaInscripcion.createMany({
      data: datosAInsertar,
      skipDuplicates: true, // Evita fallos por duplicados exactos
    });

    return res.status(201).json({
      success: true,
      message: `${resultado.count} matrículas importadas correctamente`,
      count: resultado.count,
    });
  } catch (error) {
    console.error("Error en la importación masiva de matrículas:", error);
    return res.status(500).json({ error: "No se pudieron importar las matrículas en la base de datos" });
  }
});

// Endpoint para listar inscripciones (para el panel syspanel)
router.get("/", async (req: Request, res: Response) => {
  try {
    const inscripciones = await prisma.matriculaInscripcion.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.json(inscripciones);
  } catch (error) {
    console.error("Error al obtener inscripciones:", error);
    return res.status(500).json({ error: "Error al obtener las inscripciones" });
  }
});

// NUEVO: Actualizar una solicitud de inscripción (Completar CRUD)
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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
    } = req.body;

    const matriculaActualizada = await prisma.matriculaInscripcion.update({
      where: { id: Number(id) },
      data: {
        sede: sede?.trim(),
        nombresEstudiante: nombresEstudiante?.trim(),
        apellidosEstudiante: apellidosEstudiante?.trim(),
        dniEstudiante: dniEstudiante?.trim(),
        nivel,
        grado,
        nombresApoderado: nombresApoderado?.trim(),
        telefono: telefono?.trim(),
        email: email ? email.trim() : null,
        mensaje: mensaje ? mensaje.trim() : null,
      },
    });

    return res.json({ message: "Solicitud actualizada con éxito", data: matriculaActualizada });
  } catch (error) {
    console.error("Error al actualizar la inscripción:", error);
    return res.status(500).json({ error: "Error al actualizar la solicitud" });
  }
});

// Endpoint para eliminar una solicitud de inscripción por ID (para el panel syspanel)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.matriculaInscripcion.delete({
      where: { id: Number(id) },
    });
    return res.json({ message: "Solicitud eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar la inscripción:", error);
    return res.status(500).json({ error: "Error al eliminar la solicitud" });
  }
});

export default router;