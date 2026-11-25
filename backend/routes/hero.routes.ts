import { Router, Request, Response } from "express";
import { prisma } from "../db";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

const uploadDir = path.join(__dirname, "../uploads/hero");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const slugify = (text: string) => {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 30);
};

const isLocalHeroImage = (srcPath: string | null | undefined): srcPath is string => {
  return Boolean(srcPath && srcPath.startsWith("/api/hero/image/"));
};

const resolveSafeUploadPath = (srcOrFilename: string): string | null => {
  const safeName = path.basename(srcOrFilename);
  if (!safeName || safeName === "." || safeName === "..") return null;
  const resolvedBase = path.resolve(uploadDir);
  const resolvedFile = path.resolve(uploadDir, safeName);
  if (!resolvedFile.startsWith(resolvedBase + path.sep)) return null;
  return resolvedFile;
};

const deletePhysicalFile = (srcPath: string | null | undefined) => {
  if (!isLocalHeroImage(srcPath)) return;
  const filePath = resolveSafeUploadPath(srcPath);
  if (!filePath) return;

  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(`Error al eliminar archivo físico ${path.basename(filePath)}:`, err);
    }
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const rawTitle = req.body.title ? String(req.body.title).trim() : "";
    const cleanTitle = rawTitle ? slugify(rawTitle) : "hero-slide";
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${cleanTitle}-${dateStr}-${randomSuffix}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|avif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Solo se permiten archivos de imagen válidos (png, jpg, jpeg, webp, avif)"));
  },
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const { soloActivas, soloDestacadas, limit } = req.query;

    const slides = await prisma.hero.findMany({
      where: {
        ...(soloActivas === "true" && { isActive: true }),
        ...(soloDestacadas === "true" && { isFeatured: true }),
      },
      orderBy: soloDestacadas === "true" ? { order: "asc" } : { id: "desc" },
      ...(limit ? { take: Number(limit) } : {}),
    });

    res.json(slides);
  } catch (error) {
    console.error("Error al obtener los slides del hero:", error);
    res.status(500).json({ error: "Error al obtener los slides del hero" });
  }
});

router.get("/image/:filename", (req: Request, res: Response) => {
  const filename = String(req.params.filename || "");
  const filePath = resolveSafeUploadPath(filename);
  if (filePath && fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: "Imagen no encontrada" });
  }
});

// Limpia archivos en uploads/hero que no estén referenciados en la tabla Hero
router.post("/cleanup-orphans", async (req: Request, res: Response) => {
  try {
    const registros = await prisma.hero.findMany({ select: { imageUrl: true } });
    const archivosEnUso = new Set(
      registros
        .map((r) => (isLocalHeroImage(r.imageUrl) ? path.basename(r.imageUrl) : null))
        .filter((name): name is string => Boolean(name)),
    );

    const archivosEnDisco = fs.existsSync(uploadDir) ? fs.readdirSync(uploadDir) : [];
    const eliminados: string[] = [];

    for (const file of archivosEnDisco) {
      if (!archivosEnUso.has(file)) {
        const fullPath = resolveSafeUploadPath(file);
        if (fullPath && fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          eliminados.push(file);
        }
      }
    }

    res.json({
      message: "Limpieza de archivos huérfanos del hero completada",
      eliminadosCount: eliminados.length,
      eliminados,
    });
  } catch (error) {
    console.error("Error al limpiar archivos huérfanos del hero:", error);
    res.status(500).json({ error: "Error al limpiar archivos huérfanos" });
  }
});

router.post("/", upload.single("imageFile"), async (req: Request, res: Response) => {
  const uploadedFileSrc = req.file ? `/api/hero/image/${req.file.filename}` : null;

  try {
    const rawTitle = req.body.title;
    const rawImageUrl = req.body.imageUrl;

    const title = rawTitle ? String(rawTitle).trim() : null;
    const imageUrl = rawImageUrl ? String(rawImageUrl).trim() : "";

    let finalSrc = "";

    if (uploadedFileSrc) {
      finalSrc = uploadedFileSrc;
    } else if (imageUrl) {
      finalSrc = imageUrl;
    } else {
      return res.status(400).json({
        error: "Debe subir un archivo de imagen o proporcionar una URL",
      });
    }

    const newSlide = await prisma.hero.create({
      data: {
        imageUrl: finalSrc,
        title,
        isActive: true,
        isFeatured: req.body.isFeatured === "true" || req.body.isFeatured === true,
        order: req.body.order ? Number(req.body.order) : 0,
      },
    });

    res.status(201).json(newSlide);
  } catch (error: any) {
    deletePhysicalFile(uploadedFileSrc);
    console.error("Error al registrar slide del hero:", error);
    res.status(500).json({ error: error.message || "Error al registrar el slide" });
  }
});

router.put("/featured", async (req: Request, res: Response) => {
  try {
    const { featuredIds } = req.body;

    if (!Array.isArray(featuredIds)) {
      return res.status(400).json({ error: "El formato de featuredIds debe ser un arreglo" });
    }

    await prisma.hero.updateMany({
      data: { isFeatured: false, order: 0 },
    });

    if (featuredIds.length > 0) {
      for (let i = 0; i < featuredIds.length; i++) {
        const id = Number(featuredIds[i]);
        const position = i + 1;

        await prisma.hero.update({
          where: { id },
          data: {
            isFeatured: true,
            order: position,
          },
        });
      }
    }

    res.json({ message: "Slots del Hero actualizados con éxito" });
  } catch (error) {
    console.error("Error al actualizar los slots del hero:", error);
    res.status(500).json({ error: "Error al actualizar los slots del hero" });
  }
});

router.put("/:id", upload.single("imageFile"), async (req: Request, res: Response) => {
  const uploadedFileSrc = req.file ? `/api/hero/image/${req.file.filename}` : null;

  try {
    const idNum = Number(req.params.id);
    if (!Number.isInteger(idNum) || idNum <= 0) {
      deletePhysicalFile(uploadedFileSrc);
      return res.status(400).json({ error: "ID de slide inválido" });
    }

    const title = req.body.title !== undefined ? String(req.body.title).trim() : undefined;
    const imageUrl =
      req.body.imageUrl !== undefined ? String(req.body.imageUrl).trim() : undefined;
    const { isActive, isFeatured, order } = req.body;

    const existingSlide = await prisma.hero.findUnique({
      where: { id: idNum },
    });

    if (!existingSlide) {
      deletePhysicalFile(uploadedFileSrc);
      return res.status(404).json({ error: "Slide no encontrado" });
    }

    const oldSrc = existingSlide.imageUrl;
    let newSrc = oldSrc;
    let shouldDeleteOldFile = false;

    if (uploadedFileSrc) {
      newSrc = uploadedFileSrc;
      shouldDeleteOldFile = isLocalHeroImage(oldSrc) && oldSrc !== uploadedFileSrc;
    } else if (imageUrl && imageUrl !== oldSrc) {
      newSrc = imageUrl;
      shouldDeleteOldFile = isLocalHeroImage(oldSrc);
    }

    const updatedSlide = await prisma.hero.update({
      where: { id: idNum },
      data: {
        imageUrl: newSrc,
        ...(title !== undefined && { title: title || null }),
        ...(isActive !== undefined && {
          isActive: isActive === "true" || isActive === true,
        }),
        ...(isFeatured !== undefined && {
          isFeatured: isFeatured === "true" || isFeatured === true,
        }),
        ...(order !== undefined && { order: Number(order) }),
      },
    });

    if (shouldDeleteOldFile) {
      deletePhysicalFile(oldSrc);
    }

    res.json(updatedSlide);
  } catch (error) {
    deletePhysicalFile(uploadedFileSrc);
    console.error("Error al actualizar slide:", error);
    res.status(500).json({ error: "Error al actualizar el slide" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const idNum = Number(req.params.id);
    if (!Number.isInteger(idNum) || idNum <= 0) {
      return res.status(400).json({ error: "ID de slide inválido" });
    }

    const slideToDelete = await prisma.hero.findUnique({
      where: { id: idNum },
    });

    if (!slideToDelete) {
      return res.status(404).json({ error: "Slide no encontrado" });
    }

    await prisma.hero.delete({
      where: { id: idNum },
    });

    deletePhysicalFile(slideToDelete.imageUrl);

    res.json({ message: "Slide eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar slide:", error);
    res.status(500).json({ error: "Error al eliminar el slide" });
  }
});

export default router;