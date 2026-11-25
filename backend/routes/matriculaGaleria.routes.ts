import { Router, Request, Response } from "express";
import { prisma } from "../db";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

const uploadDir = path.join(__dirname, "../uploads/matricula");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const isLocalMatriculaImage = (srcPath: string | null | undefined): srcPath is string => {
  return Boolean(srcPath && srcPath.startsWith("/api/matricula-galeria/image/"));
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
  if (!isLocalMatriculaImage(srcPath)) return;
  const filePath = resolveSafeUploadPath(srcPath);
  if (!filePath) return;

  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(
        `Error al eliminar archivo físico de matrícula ${path.basename(filePath)}:`,
        err,
      );
    }
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `matricula-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|avif|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Solo se permiten archivos de imagen válidos (png, jpg, jpeg, webp, avif, gif)"));
  },
});

// 1. Obtener imágenes activas para la página pública (máximo 6 slots)
router.get("/", async (req: Request, res: Response) => {
  try {
    const images = await prisma.matriculaGaleria.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      take: 6,
    });
    res.json(images);
  } catch (error) {
    console.error("Error al obtener galería:", error);
    res.status(500).json({ error: "Error al obtener la galería de matrículas" });
  }
});

// 2. Obtener TODAS las imágenes (para el syspanel / administración)
router.get("/admin", async (req: Request, res: Response) => {
  try {
    const images = await prisma.matriculaGaleria.findMany({
      orderBy: { order: "asc" },
    });
    res.json(images);
  } catch (error) {
    console.error("Error al obtener galería admin:", error);
    res.status(500).json({ error: "Error al obtener las imágenes de administración" });
  }
});

// Limpia archivos en uploads/matricula que no estén referenciados en la tabla MatriculaGaleria
router.post("/cleanup-orphans", async (req: Request, res: Response) => {
  try {
    const registros = await prisma.matriculaGaleria.findMany({ select: { imageUrl: true } });
    const archivosEnUso = new Set(
      registros
        .map((r) => (isLocalMatriculaImage(r.imageUrl) ? path.basename(r.imageUrl) : null))
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
      message: "Limpieza de archivos huérfanos de galería de matrícula completada",
      eliminadosCount: eliminados.length,
      eliminados,
    });
  } catch (error) {
    console.error("Error al limpiar archivos huérfanos de galería de matrícula:", error);
    res.status(500).json({ error: "Error al limpiar archivos huérfanos" });
  }
});

// 3. Subir una nueva imagen (límite de hasta 8 imágenes en el carrusel)
router.post("/", upload.single("imageFile"), async (req: Request, res: Response) => {
  const uploadedFileSrc = req.file ? `/api/matricula-galeria/image/${req.file.filename}` : null;

  try {
    if (!uploadedFileSrc) {
      return res.status(400).json({ error: "Se requiere un archivo de imagen" });
    }

    const count = await prisma.matriculaGaleria.count();
    if (count >= 8) {
      deletePhysicalFile(uploadedFileSrc);
      return res.status(400).json({
        error: "Límite alcanzado: solo se permiten hasta 8 imágenes en el carrusel.",
      });
    }

    const rawTitle = req.body.title !== undefined ? String(req.body.title).trim() : null;

    const newImage = await prisma.matriculaGaleria.create({
      data: {
        imageUrl: uploadedFileSrc,
        title: rawTitle || null,
        order: req.body.order !== undefined ? Number(req.body.order) : count,
        isActive:
          req.body.isActive !== undefined
            ? req.body.isActive === "true" || req.body.isActive === true
            : true,
      },
    });

    res.status(201).json(newImage);
  } catch (error) {
    deletePhysicalFile(uploadedFileSrc);
    console.error("Error al subir imagen:", error);
    res.status(500).json({ error: "Error al subir la imagen" });
  }
});

// 4. Actualizar / Editar una imagen existente (Título, orden, estado activo o imagen)
router.put("/:id", upload.single("imageFile"), async (req: Request, res: Response) => {
  const uploadedFileSrc = req.file ? `/api/matricula-galeria/image/${req.file.filename}` : null;

  try {
    const idNum = Number(req.params.id);
    if (!Number.isInteger(idNum) || idNum <= 0) {
      deletePhysicalFile(uploadedFileSrc);
      return res.status(400).json({ error: "ID de imagen inválido" });
    }

    const { title, isActive, order } = req.body;

    const existing = await prisma.matriculaGaleria.findUnique({
      where: { id: idNum },
    });

    if (!existing) {
      deletePhysicalFile(uploadedFileSrc);
      return res.status(404).json({ error: "Imagen no encontrada" });
    }

    const oldImageUrl = existing.imageUrl;
    let imageUrl = oldImageUrl;
    let shouldDeleteOldFile = false;

    if (uploadedFileSrc) {
      imageUrl = uploadedFileSrc;
      shouldDeleteOldFile = isLocalMatriculaImage(oldImageUrl) && oldImageUrl !== uploadedFileSrc;
    }

    const updated = await prisma.matriculaGaleria.update({
      where: { id: idNum },
      data: {
        imageUrl,
        title: title !== undefined ? String(title).trim() || null : existing.title,
        isActive:
          isActive !== undefined
            ? isActive === "true" || isActive === true
            : existing.isActive,
        order: order !== undefined ? Number(order) : existing.order,
      },
    });

    if (shouldDeleteOldFile) {
      deletePhysicalFile(oldImageUrl);
    }

    res.json(updated);
  } catch (error) {
    deletePhysicalFile(uploadedFileSrc);
    console.error("Error al actualizar imagen:", error);
    res.status(500).json({ error: "Error al actualizar la imagen" });
  }
});

// 5. Eliminar una imagen de la galería
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const idNum = Number(req.params.id);
    if (!Number.isInteger(idNum) || idNum <= 0) {
      return res.status(400).json({ error: "ID de imagen inválido" });
    }

    const image = await prisma.matriculaGaleria.findUnique({
      where: { id: idNum },
    });

    if (!image) {
      return res.status(404).json({ error: "Imagen no encontrada" });
    }

    await prisma.matriculaGaleria.delete({
      where: { id: idNum },
    });

    deletePhysicalFile(image.imageUrl);

    res.json({ message: "Imagen eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar imagen:", error);
    res.status(500).json({ error: "Error al eliminar la imagen" });
  }
});

// 6. Servir el archivo de imagen estático
router.get("/image/:filename", (req: Request, res: Response) => {
  const filename = String(req.params.filename || "");
  const filePath = resolveSafeUploadPath(filename);

  if (filePath && fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: "No encontrado" });
  }
});

export default router;