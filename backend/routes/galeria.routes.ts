import { Router, Request, Response } from "express";
import { prisma } from "../db";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

const uploadDir = path.join(__dirname, "../uploads/galeria");
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

const isLocalGalleryImage = (srcPath: string | null | undefined): srcPath is string => {
  return Boolean(srcPath && srcPath.startsWith("/api/galeria/image/"));
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
  if (!isLocalGalleryImage(srcPath)) return;
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
    const rawAlt = req.body.alt ? String(req.body.alt).trim() : "";
    const cleanAlt = rawAlt ? slugify(rawAlt) : "sin-titulo";
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${cleanAlt}-${dateStr}-${randomSuffix}${ext}`;
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
    cb(new Error("Solo se permiten archivos de imagen válidos (png, jpg, jpeg, webp)"));
  },
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const { soloActivas, soloDestacadas, limit } = req.query;

    const images = await prisma.galeria.findMany({
      where: {
        ...(soloActivas === "true" && { isActive: true }),
        ...(soloDestacadas === "true" && { isFeatured: true }),
      },
      orderBy: soloDestacadas === "true" ? { order: "asc" } : { id: "desc" },
      ...(limit ? { take: Number(limit) } : {}),
    });

    res.json(images);
  } catch (error) {
    console.error("Error al obtener galería:", error);
    res.status(500).json({ error: "Error al obtener la galería" });
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

// Limpia archivos en uploads/galeria que no estén referenciados en la tabla Galeria
router.post("/cleanup-orphans", async (req: Request, res: Response) => {
  try {
    const registros = await prisma.galeria.findMany({ select: { src: true } });
    const archivosEnUso = new Set(
      registros
        .map((r) => (isLocalGalleryImage(r.src) ? path.basename(r.src) : null))
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
      message: "Limpieza de archivos huérfanos de galería completada",
      eliminadosCount: eliminados.length,
      eliminados,
    });
  } catch (error) {
    console.error("Error al limpiar archivos huérfanos de galería:", error);
    res.status(500).json({ error: "Error al limpiar archivos huérfanos" });
  }
});

router.post("/", upload.single("imageFile"), async (req: Request, res: Response) => {
  const uploadedFileSrc = req.file ? `/api/galeria/image/${req.file.filename}` : null;

  try {
    const rawAlt = req.body.alt;
    const rawImageUrl = req.body.imageUrl;

    const alt = rawAlt ? String(rawAlt).trim() : "";
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

    if (!alt) {
      deletePhysicalFile(uploadedFileSrc);
      return res.status(400).json({ error: "El título o descripción (alt) es obligatorio" });
    }

    const newImage = await prisma.galeria.create({
      data: {
        src: finalSrc,
        alt,
        isActive: true,
        isFeatured: req.body.isFeatured === "true" || req.body.isFeatured === true,
        order: req.body.order ? Number(req.body.order) : 0,
      },
    });

    res.status(201).json(newImage);
  } catch (error: any) {
    deletePhysicalFile(uploadedFileSrc);
    console.error("Error al registrar imagen:", error);
    res.status(500).json({ error: error.message || "Error al registrar la imagen" });
  }
});

router.put("/featured", async (req: Request, res: Response) => {
  try {
    const { featuredIds } = req.body;

    if (!Array.isArray(featuredIds)) {
      return res.status(400).json({ error: "El formato de featuredIds debe ser un arreglo" });
    }

    await prisma.galeria.updateMany({
      data: { isFeatured: false, order: 0 },
    });

    if (featuredIds.length > 0) {
      for (let i = 0; i < featuredIds.length; i++) {
        const id = Number(featuredIds[i]);
        const position = i + 1;

        await prisma.galeria.update({
          where: { id },
          data: {
            isFeatured: true,
            order: position,
          },
        });
      }
    }

    res.json({ message: "Imágenes destacadas y orden actualizados con éxito" });
  } catch (error) {
    console.error("Error al actualizar imágenes destacadas:", error);
    res.status(500).json({ error: "Error al actualizar las imágenes destacadas" });
  }
});

router.put("/:id", upload.single("imageFile"), async (req: Request, res: Response) => {
  const uploadedFileSrc = req.file ? `/api/galeria/image/${req.file.filename}` : null;

  try {
    const idNum = Number(req.params.id);
    if (!Number.isInteger(idNum) || idNum <= 0) {
      deletePhysicalFile(uploadedFileSrc);
      return res.status(400).json({ error: "ID de imagen inválido" });
    }

    const alt = req.body.alt !== undefined ? String(req.body.alt).trim() : undefined;
    const imageUrl =
      req.body.imageUrl !== undefined ? String(req.body.imageUrl).trim() : undefined;
    const { isActive, isFeatured, order } = req.body;

    const existingImage = await prisma.galeria.findUnique({
      where: { id: idNum },
    });

    if (!existingImage) {
      deletePhysicalFile(uploadedFileSrc);
      return res.status(404).json({ error: "Imagen no encontrada" });
    }

    const oldSrc = existingImage.src;
    let newSrc = oldSrc;
    let shouldDeleteOldFile = false;

    if (uploadedFileSrc) {
      newSrc = uploadedFileSrc;
      shouldDeleteOldFile = isLocalGalleryImage(oldSrc) && oldSrc !== uploadedFileSrc;
    } else if (imageUrl && imageUrl !== oldSrc) {
      newSrc = imageUrl;
      shouldDeleteOldFile = isLocalGalleryImage(oldSrc);
    }

    const updatedImage = await prisma.galeria.update({
      where: { id: idNum },
      data: {
        src: newSrc,
        ...(alt !== undefined && { alt }),
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

    res.json(updatedImage);
  } catch (error) {
    deletePhysicalFile(uploadedFileSrc);
    console.error("Error al actualizar imagen:", error);
    res.status(500).json({ error: "Error al actualizar la imagen" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const idNum = Number(req.params.id);
    if (!Number.isInteger(idNum) || idNum <= 0) {
      return res.status(400).json({ error: "ID de imagen inválido" });
    }

    const imageToDelete = await prisma.galeria.findUnique({
      where: { id: idNum },
    });

    if (!imageToDelete) {
      return res.status(404).json({ error: "Imagen no encontrada" });
    }

    await prisma.galeria.delete({
      where: { id: idNum },
    });

    deletePhysicalFile(imageToDelete.src);

    res.json({ message: "Imagen eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar imagen:", error);
    res.status(500).json({ error: "Error al eliminar la imagen" });
  }
});

export default router;