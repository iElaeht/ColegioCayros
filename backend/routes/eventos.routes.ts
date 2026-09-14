// backend/src/routes/eventos.ts
import { Router, Request, Response } from "express";
import { prisma } from "../db";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

const uploadDir = path.join(__dirname, "../uploads/eventos");
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
  if (srcPath && srcPath.startsWith("/api/eventos/image/")) {
    const filename = path.basename(srcPath);
    const filePath = path.join(uploadDir, filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Error al eliminar archivo físico de eventos ${filename}:`, err);
      }
    }
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const rawAlt = req.body.alt || req.body.titulo || "";
    const cleanAlt = rawAlt ? slugify(rawAlt.trim()) : "evento";
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
    const allowedTypes = /jpeg|jpg|png|webp|avif|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(
      new Error(
        "Solo se permiten archivos de imagen válidos para eventos (png, jpg, jpeg, webp, gif)",
      ),
    );
  },
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const { soloActivas, soloDestacadas, limit } = req.query;

    const eventos = await prisma.evento.findMany({
      where: {
        ...(soloActivas === "true" && { isActive: true }),
        ...(soloDestacadas === "true" && { isFeatured: true }),
      },
      orderBy: soloDestacadas === "true" ? { order: "asc" } : { id: "desc" },
      ...(limit ? { take: Number(limit) } : {}),
    });

    res.json(eventos);
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    res.status(500).json({ error: "Error al obtener los eventos" });
  }
});

router.get("/image/:filename", (req: Request, res: Response) => {
  const filename = req.params.filename as string;
  const filePath = path.join(uploadDir, filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: "Imagen de evento no encontrada" });
  }
});

router.post(
  "/",
  upload.single("imageFile"),
  async (req: Request, res: Response) => {
    try {
      const rawAlt = req.body.alt;
      const rawTitulo = req.body.titulo;
      const rawDescripcion = req.body.descripcion;
      const rawImageUrl = req.body.imageUrl;

      const alt = rawAlt ? rawAlt.trim() : (rawTitulo ? rawTitulo.trim() : "");
      const titulo = rawTitulo ? rawTitulo.trim() : alt;
      const descripcion = rawDescripcion ? rawDescripcion.trim() : null;
      const imageUrl = rawImageUrl ? rawImageUrl.trim() : "";

      let finalSrc = "";

      if (req.file) {
        finalSrc = `/api/eventos/image/${req.file.filename}`;
      } else if (imageUrl) {
        finalSrc = imageUrl;
      } else {
        return res.status(400).json({
          error: "Debe subir un archivo de imagen o proporcionar una URL",
        });
      }

      if (!titulo && !alt) {
        return res.status(400).json({ error: "El título del evento es obligatorio" });
      }

      const newEvento = await prisma.evento.create({
        data: {
          src: finalSrc,
          titulo: titulo || alt,
          descripcion: descripcion,
          alt: alt || titulo,
          isActive: true,
          isFeatured:
            req.body.isFeatured === "true" || req.body.isFeatured === true,
          order: req.body.order ? Number(req.body.order) : 0,
        },
      });

      res.status(201).json(newEvento);
    } catch (error: any) {
      console.error("Error al registrar evento:", error);
      res
        .status(500)
        .json({ error: error.message || "Error al registrar el evento" });
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

    await prisma.evento.updateMany({
      data: { isFeatured: false, order: 0 },
    });

    if (featuredIds.length > 0) {
      for (let i = 0; i < featuredIds.length; i++) {
        const id = Number(featuredIds[i]);
        const position = i + 1;

        await prisma.evento.update({
          where: { id },
          data: {
            isFeatured: true,
            order: position,
          },
        });
      }
    }

    res.json({ message: "Eventos destacados y orden actualizados con éxito" });
  } catch (error) {
    console.error("Error al actualizar eventos destacados:", error);
    res
      .status(500)
      .json({ error: "Error al actualizar los eventos destacados" });
  }
});

router.put(
  "/:id",
  upload.single("imageFile"),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const titulo = req.body.titulo !== undefined ? req.body.titulo.trim() : undefined;
      const descripcion = req.body.descripcion !== undefined ? req.body.descripcion.trim() : undefined;
      const alt = req.body.alt !== undefined ? req.body.alt.trim() : undefined;
      const imageUrl =
        req.body.imageUrl !== undefined ? req.body.imageUrl.trim() : undefined;
      const { isActive, isFeatured, order } = req.body;

      const existingEvento = await prisma.evento.findUnique({
        where: { id: Number(id) },
      });

      if (!existingEvento) {
        return res.status(404).json({ error: "Evento no encontrado" });
      }

      let newSrc = existingEvento.src;

      if (req.file) {
        newSrc = `/api/eventos/image/${req.file.filename}`;
        deletePhysicalFile(existingEvento.src);
      } else if (imageUrl && imageUrl !== existingEvento.src) {
        newSrc = imageUrl;
        deletePhysicalFile(existingEvento.src);
      } else if (
        (titulo || alt) &&
        (titulo !== existingEvento.titulo || alt !== existingEvento.alt) &&
        existingEvento.src.startsWith("/api/eventos/image/")
      ) {
        const oldFilename = path.basename(existingEvento.src);
        const oldPath = path.join(uploadDir, oldFilename);

        if (fs.existsSync(oldPath)) {
          const cleanAlt = slugify(titulo || alt || "evento");
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
            : `evento-${dateStr}-${randomSuffix}${ext}`;

          const newPath = path.join(uploadDir, newFilename);

          try {
            fs.renameSync(oldPath, newPath);
            newSrc = `/api/eventos/image/${newFilename}`;
          } catch (err) {
            console.error("Error al renombrar el archivo físico del evento:", err);
          }
        }
      }

      const updatedEvento = await prisma.evento.update({
        where: { id: Number(id) },
        data: {
          src: newSrc,
          ...(titulo !== undefined && { titulo }),
          ...(descripcion !== undefined && { descripcion }),
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

      res.json(updatedEvento);
    } catch (error) {
      console.error("Error al actualizar evento:", error);
      res.status(500).json({ error: "Error al actualizar el evento" });
    }
  },
);

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const eventoToDelete = await prisma.evento.findUnique({
      where: { id: Number(id) },
    });

    if (eventoToDelete) {
      deletePhysicalFile(eventoToDelete.src);
    }

    await prisma.evento.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Evento eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar evento:", error);
    res.status(500).json({ error: "Error al eliminar el evento" });
  }
});

export default router;