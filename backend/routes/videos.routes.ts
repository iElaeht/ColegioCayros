// backend/src/routes/videos.ts
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

const deletePhysicalFile = (srcPath: string) => {
  if (srcPath && srcPath.startsWith("/api/videos/file/")) {
    const filename = path.basename(srcPath);
    const filePath = path.join(uploadDir, filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Error al eliminar archivo de video físico ${filename}:`, err);
      }
    }
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const rawAlt = req.body.alt ? req.body.alt.trim() : "";
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
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype) || file.mimetype.startsWith("video/");
    if (extname || mimetype) {
      return cb(null, true);
    }
    cb(
      new Error(
        "Solo se permiten archivos de video válidos (mp4, webm, ogg, mov)",
      ),
    );
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
  const filename = req.params.filename as string;
  const filePath = path.join(uploadDir, filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: "Archivo de video no encontrado" });
  }
});

router.post(
  "/",
  upload.single("videoFile"),
  async (req: Request, res: Response) => {
    try {
      const rawAlt = req.body.alt;
      const rawVideoUrl = req.body.imageUrl || req.body.videoUrl;

      const alt = rawAlt ? rawAlt.trim() : "";
      const videoUrl = rawVideoUrl ? rawVideoUrl.trim() : "";

      let finalSrc = "";

      if (req.file) {
        finalSrc = `/api/videos/file/${req.file.filename}`;
      } else if (videoUrl) {
        finalSrc = videoUrl;
      } else {
        return res
          .status(400)
          .json({
            error: "Debe subir un archivo de video o proporcionar una URL válida",
          });
      }

      if (!alt) {
        return res
          .status(400)
          .json({ error: "El título o descripción (alt) del video es obligatorio" });
      }

      const newVideo = await prisma.video.create({
        data: {
          src: finalSrc,
          alt,
          isActive: true,
          isFeatured:
            req.body.isFeatured === "true" || req.body.isFeatured === true,
          order: req.body.order ? Number(req.body.order) : 0,
        },
      });

      res.status(201).json(newVideo);
    } catch (error: any) {
      console.error("Error al registrar video:", error);
      res
        .status(500)
        .json({ error: error.message || "Error al registrar el video" });
    }
  },
);

router.put("/featured", async (req: Request, res: Response) => {
  try {
    const { featuredIds } = req.body;

    if (!Array.isArray(featuredIds)) {
      return res
        .status(400)
        .json({ error: "El formato de featuredIds debe ser un arreglo" });
    }

    // Usamos una transacción para garantizar consistencia
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
    res
      .status(500)
      .json({ error: "Error al actualizar los videos destacados" });
  }
});

router.put(
  "/:id",
  upload.single("videoFile"),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const alt = req.body.alt !== undefined ? req.body.alt.trim() : undefined;
      const videoUrl =
        req.body.imageUrl !== undefined || req.body.videoUrl !== undefined
          ? (req.body.imageUrl || req.body.videoUrl).trim()
          : undefined;
      const { isActive, isFeatured, order } = req.body;

      const existingVideo = await prisma.video.findUnique({
        where: { id: Number(id) },
      });

      if (!existingVideo) {
        return res.status(404).json({ error: "Video no encontrado" });
      }

      let newSrc = existingVideo.src;

      if (req.file) {
        newSrc = `/api/videos/file/${req.file.filename}`;
        deletePhysicalFile(existingVideo.src);
      } else if (videoUrl && videoUrl !== existingVideo.src) {
        newSrc = videoUrl;
        deletePhysicalFile(existingVideo.src);
      } else if (
        alt &&
        alt !== existingVideo.alt &&
        existingVideo.src.startsWith("/api/videos/file/")
      ) {
        const oldFilename = path.basename(existingVideo.src);
        const oldPath = path.join(uploadDir, oldFilename);

        if (fs.existsSync(oldPath)) {
          const cleanAlt = slugify(alt);
          const ext = path.extname(oldFilename);

          const parts = oldFilename.split("-");
          const dateStr =
            parts[parts.length - 2] ||
            new Date().toISOString().slice(0, 10).replace(/-/g, "");
          const randomSuffix =
            parts[parts.length - 1]?.split(".")[0] ||
            Math.floor(1000 + Math.random() * 9000);

          const newFilename = cleanAlt
            ? `${cleanAlt}-${dateStr}-${randomSuffix}${ext}`
            : `video-${dateStr}-${randomSuffix}${ext}`;

          const newPath = path.join(uploadDir, newFilename);

          try {
            fs.renameSync(oldPath, newPath);
            newSrc = `/api/videos/file/${newFilename}`;
          } catch (err) {
            console.error("Error al renombrar el archivo físico del video:", err);
          }
        }
      }

      const updatedVideo = await prisma.video.update({
        where: { id: Number(id) },
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

      res.json(updatedVideo);
    } catch (error) {
      console.error("Error al actualizar video:", error);
      res.status(500).json({ error: "Error al actualizar el video" });
    }
  },
);

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const videoToDelete = await prisma.video.findUnique({
      where: { id: Number(id) },
    });

    if (videoToDelete) {
      deletePhysicalFile(videoToDelete.src);
    }

    await prisma.video.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Video eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar video:", error);
    res.status(500).json({ error: "Error al eliminar el video" });
  }
});

export default router;