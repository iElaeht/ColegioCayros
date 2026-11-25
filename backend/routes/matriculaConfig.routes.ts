import { Router, Request, Response } from "express";
import { prisma } from "../db";

const router = Router();

const DEFAULT_CONFIG = {
  year: new Date().getFullYear().toString(),
  badgeText: "MATRICULAS",
  title: "MATRICULAS ABIERTAS",
  description: "Quiero empezar la matricula y conocer los requisitos del proceso.",
  buttonText: "Ver pasos y requisitos",
  linkUrl: "/matricula",
  isActive: true,
};

// GET: Obtener la configuración de admisión/matrícula (o crear una por defecto si está vacía)
router.get("/", async (req: Request, res: Response) => {
  try {
    let config = await prisma.admisionConfig.findFirst();

    if (!config) {
      config = await prisma.admisionConfig.create({
        data: DEFAULT_CONFIG,
      });
    }

    res.json(config);
  } catch (error) {
    console.error("Error al obtener la configuración de matrícula:", error);
    res.status(500).json({ error: "Error interno al obtener la configuración" });
  }
});

// PUT: Actualizar la configuración de admisión/matrícula desde el Syspanel
router.put("/", async (req: Request, res: Response) => {
  try {
    const { year, badgeText, title, description, buttonText, linkUrl, isActive } = req.body;

    const existingConfig = await prisma.admisionConfig.findFirst();

    const parsedIsActive =
      isActive !== undefined
        ? isActive === "true" || isActive === true
        : (existingConfig?.isActive ?? DEFAULT_CONFIG.isActive);

    const dataToSave = {
      year:
        year !== undefined
          ? String(year).trim() || DEFAULT_CONFIG.year
          : (existingConfig?.year ?? DEFAULT_CONFIG.year),
      badgeText:
        badgeText !== undefined
          ? String(badgeText).trim()
          : (existingConfig?.badgeText ?? DEFAULT_CONFIG.badgeText),
      title:
        title !== undefined
          ? String(title).trim()
          : (existingConfig?.title ?? DEFAULT_CONFIG.title),
      description:
        description !== undefined
          ? String(description).trim()
          : (existingConfig?.description ?? DEFAULT_CONFIG.description),
      buttonText:
        buttonText !== undefined
          ? String(buttonText).trim()
          : (existingConfig?.buttonText ?? DEFAULT_CONFIG.buttonText),
      linkUrl:
        linkUrl !== undefined
          ? String(linkUrl).trim() || DEFAULT_CONFIG.linkUrl
          : (existingConfig?.linkUrl ?? DEFAULT_CONFIG.linkUrl),
      isActive: parsedIsActive,
    };

    const config = !existingConfig
      ? await prisma.admisionConfig.create({ data: dataToSave })
      : await prisma.admisionConfig.update({
          where: { id: existingConfig.id },
          data: dataToSave,
        });

    res.json({ message: "Configuración actualizada correctamente", config });
  } catch (error) {
    console.error("Error al actualizar la configuración de matrícula:", error);
    res.status(500).json({ error: "Error interno al actualizar" });
  }
});

export default router;