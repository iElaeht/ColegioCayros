// backend/routes/matriculaConfig.routes.ts
import { Router, Request, Response } from 'express';
import { prisma } from '../db';

const router = Router();

// GET: Obtener la configuración de admisión/matrícula (o crear una por defecto si está vacía)
router.get('/', async (req: Request, res: Response) => {
  try {
    let config = await prisma.admisionConfig.findFirst();

    if (!config) {
      config = await prisma.admisionConfig.create({
        data: {
          year: new Date().getFullYear().toString(),
          badgeText: "MATRICULAS",
          title: "MATRICULAS ABIERTAS",
          description: "Quiero empezar la matricula y conocer los requisitos del proceso.",
          buttonText: "Ver pasos y requisitos",
          linkUrl: "/matricula",
          isActive: true,
        },
      });
    }

    res.json(config);
  } catch (error) {
    console.error("Error al obtener la configuración de matrícula:", error);
    res.status(500).json({ error: "Error interno al obtener la configuración" });
  }
});

// PUT: Actualizar la configuración de admisión/matrícula desde el Syspanel
router.put('/', async (req: Request, res: Response) => {
  try {
    const { year, badgeText, title, description, buttonText, linkUrl, isActive } = req.body;

    let config = await prisma.admisionConfig.findFirst();

    if (!config) {
      config = await prisma.admisionConfig.create({
        data: { year, badgeText, title, description, buttonText, linkUrl, isActive }
      });
    } else {
      config = await prisma.admisionConfig.update({
        where: { id: config.id },
        data: { year, badgeText, title, description, buttonText, linkUrl, isActive }
      });
    }

    res.json({ message: "Configuración actualizada correctamente", config });
  } catch (error) {
    console.error("Error al actualizar la configuración de matrícula:", error);
    res.status(500).json({ error: "Error interno al actualizar" });
  }
});

export default router;