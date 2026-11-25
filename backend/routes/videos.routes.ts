import { Router, Request, Response } from "express";
import { prisma } from "../db";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

const uploadDir = path.join(__dirname, "../uploads/videos");
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

const isLocalVideoFile = (srcPath: string | null | undefined): srcPath is string => {
  return Boolean(srcPath && srcPath.startsWith("/api/videos/file/"));
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
  if (!isLocalVideoFile(srcPath)) return;
  const filePath = resolveSafeUploadPath(srcPath);
  if (!filePath) return;

  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(`Error al eliminar archivo de video físico ${path.basename(filePath)}:`, err);
    }
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const rawAlt = req.body.alt ? String(req.body.alt).trim() : "";
    const cleanAlt = rawAlt ? slugify(rawAlt) : "video";
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${cleanAlt}-${dateStr}-${randomSuffix}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp4|webm|ogg|mov|mkv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || file.mimetype.startsWith("video/");
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Solo se permiten archivos de video válidos (mp4, webm, ogg, mov, mkv)"));
  },
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const { soloActivas, soloDestacadas, limit } = req.query;

    const videos = await prisma.video.findMany({
      where: {
        ...(soloActivas === "true" && { isActive: true }),
        ...(soloDestacadas === "true" && { isFeatured: true }),
      },
      orderBy: soloDestacadas === "true" ? { order: "asc" } : { id: "desc" },
      ...(limit ? { take: Number(limit) } : {}),
    });

    res.json(videos);
  } catch (error) {
    console.error("Error al obtener videos:", error);
    res.status(500).json({ error: "Error al obtener los videos" });
  }
});

router.get("/file/:filename", (req: Request, res: Response) => {
  const filename = String(req.params.filename || "");
  const filePath = resolveSafeUploadPath(filename);
  if (filePath && fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: "Archivo de video no encontrado" });
  }
});

// Limpia archivos en uploads/videos que no estén referenciados en la tabla Video
router.post("/cleanup-orphans", async (req: Request, res: Response) => {
  try {
    const registros = await prisma.video.findMany({ select: { src: true } });
    const archivosEnUso = new Set(
      registros
        .map((r) => (isLocalVideoFile(r.src) ? path.basename(r.src) : null))
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
      message: "Limpieza de archivos huérfanos de videos completada",
      eliminadosCount: eliminados.length,
      eliminados,
    });
  } catch (error) {
    console.error("Error al limpiar archivos huérfanos de videos:", error);
    res.status(500).json({ error: "Error al limpiar archivos huérfanos" });
  }
});

router.post("/", upload.single("videoFile"), async (req: Request, res: Response) => {
  const uploadedFileSrc = req.file ? `/api/videos/file/${req.file.filename}` : null;

  try {
    const rawAlt = req.body.alt;
    const rawVideoUrl = req.body.imageUrl || req.body.videoUrl;

    const alt = rawAlt ? String(rawAlt).trim() : "";
    const videoUrl = rawVideoUrl ? String(rawVideoUrl).trim() : "";

    let finalSrc = "";

    if (uploadedFileSrc) {
      finalSrc = uploadedFileSrc;
    } else if (videoUrl) {
      finalSrc = videoUrl;
    } else {
      return res.status(400).json({
        error: "Debe subir un archivo de video o proporcionar una URL válida",
      });
    }

    if (!alt) {
      deletePhysicalFile(uploadedFileSrc);
      return res.status(400).json({
        error: "El título o descripción (alt) del video es obligatorio",
      });
    }

    const newVideo = await prisma.video.create({
      data: {
        src: finalSrc,
        alt,
        isActive: true,
        isFeatured: req.body.isFeatured === "true" || req.body.isFeatured === true,
        order: req.body.order ? Number(req.body.order) : 0,
      },
    });

    res.status(201).json(newVideo);
  } catch (error: any) {
    deletePhysicalFile(uploadedFileSrc);
    console.error("Error al registrar video:", error);
    res.status(500).json({ error: error.message || "Error al registrar el video" });
  }
});

router.put("/featured", async (req: Request, res: Response) => {
  try {
    const { featuredIds } = req.body;

    if (!Array.isArray(featuredIds)) {
      return res.status(400).json({ error: "El formato de featuredIds debe ser un arreglo" });
    }

    await prisma.$transaction(async (tx) => {
      await tx.video.updateMany({
        data: { isFeatured: false, order: 0 },
      });

      if (featuredIds.length > 0) {
        for (let i = 0; i < featuredIds.length; i++) {
          const id = Number(featuredIds[i]);
          const position = i + 1;

          await tx.video.update({
            where: { id },
            data: {
              isFeatured: true,
              order: position,
            },
          });
        }
      }
    });

    res.json({ message: "Videos destacados y orden actualizados con éxito" });
  } catch (error) {
    console.error("Error al actualizar videos destacados:", error);
    res.status(500).json({ error: "Error al actualizar los videos destacados" });
  }
});

router.put("/:id", upload.single("videoFile"), async (req: Request, res: Response) => {
  const uploadedFileSrc = req.file ? `/api/videos/file/${req.file.filename}` : null;

  try {
    const idNum = Number(req.params.id);
    if (!Number.isInteger(idNum) || idNum <= 0) {
      deletePhysicalFile(uploadedFileSrc);
      return res.status(400).json({ error: "ID de video inválido" });
    }

    const alt = req.body.alt !== undefined ? String(req.body.alt).trim() : undefined;
    const rawUrl = req.body.imageUrl !== undefined ? req.body.imageUrl : req.body.videoUrl;
    const videoUrl = rawUrl !== undefined ? String(rawUrl).trim() : undefined;
    const { isActive, isFeatured, order } = req.body;

    const existingVideo = await prisma.video.findUnique({
      where: { id: idNum },
    });

    if (!existingVideo) {
      deletePhysicalFile(uploadedFileSrc);
      return res.status(404).json({ error: "Video no encontrado" });
    }

    const oldSrc = existingVideo.src;
    let newSrc = oldSrc;
    let shouldDeleteOldFile = false;

    if (uploadedFileSrc) {
      newSrc = uploadedFileSrc;
      shouldDeleteOldFile = isLocalVideoFile(oldSrc) && oldSrc !== uploadedFileSrc;
    } else if (videoUrl && videoUrl !== oldSrc) {
      newSrc = videoUrl;
      shouldDeleteOldFile = isLocalVideoFile(oldSrc);
    }

    let updatedVideo = await prisma.video.update({
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

    if (!uploadedFileSrc && !videoUrl && alt && alt !== existingVideo.alt && isLocalVideoFile(oldSrc)) {
      const oldPath = resolveSafeUploadPath(oldSrc);
      if (oldPath && fs.existsSync(oldPath)) {
        const cleanAlt = slugify(alt);
        const ext = path.extname(oldPath);
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const newFilename = `${cleanAlt || "video"}-${dateStr}-${randomSuffix}${ext}`;
        const newPath = resolveSafeUploadPath(newFilename);

        if (newPath) {
          try {
            fs.renameSync(oldPath, newPath);
            updatedVideo = await prisma.video.update({
              where: { id: idNum },
              data: { src: `/api/videos/file/${newFilename}` },
            });
          } catch (err) {
            console.error("Error al renombrar el archivo físico del video:", err);
          }
        }
      }
    }

    if (shouldDeleteOldFile) {
      deletePhysicalFile(oldSrc);
    }

    res.json(updatedVideo);
  } catch (error) {
    deletePhysicalFile(uploadedFileSrc);
    console.error("Error al actualizar video:", error);
    res.status(500).json({ error: "Error al actualizar el video" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const idNum = Number(req.params.id);
    if (!Number.isInteger(idNum) || idNum <= 0) {
      return res.status(400).json({ error: "ID de video inválido" });
    }

    const videoToDelete = await prisma.video.findUnique({
      where: { id: idNum },
    });

    if (!videoToDelete) {
      return res.status(404).json({ error: "Video no encontrado" });
    }

    await prisma.video.delete({
      where: { id: idNum },
    });

    deletePhysicalFile(videoToDelete.src);

    res.json({ message: "Video eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar video:", error);
    res.status(500).json({ error: "Error al eliminar el video" });
  }
});

export default router;