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

const deletePhysicalFile = (srcPath: string) => {
  if (srcPath && srcPath.startsWith("/api/galeria/image/")) {
    const filename = path.basename(srcPath);
    const filePath = path.join(uploadDir, filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Error al eliminar archivo físico ${filename}:`, err);
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
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(
      new Error(
        "Solo se permiten archivos de imagen válidos (png, jpg, jpeg, webp)",
      ),
    );
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
  const filename = req.params.filename as string;
  const filePath = path.join(uploadDir, filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: "Imagen no encontrada" });
  }
});

router.post(
  "/",
  upload.single("imageFile"),
  async (req: Request, res: Response) => {
    try {
      const rawAlt = req.body.alt;
      const rawImageUrl = req.body.imageUrl;

      const alt = rawAlt ? rawAlt.trim() : "";
      const imageUrl = rawImageUrl ? rawImageUrl.trim() : "";

      let finalSrc = "";

      if (req.file) {
        finalSrc = `/api/galeria/image/${req.file.filename}`;
      } else if (imageUrl) {
        finalSrc = imageUrl;
      } else {
        return res
          .status(400)
          .json({
            error: "Debe subir un archivo de imagen o proporcionar una URL",
          });
      }

      if (!alt) {
        return res
          .status(400)
          .json({ error: "El título o descripción (alt) es obligatorio" });
      }

      const newImage = await prisma.galeria.create({
        data: {
          src: finalSrc,
          alt,
          isActive: true,
          isFeatured:
            req.body.isFeatured === "true" || req.body.isFeatured === true,
          order: req.body.order ? Number(req.body.order) : 0,
        },
      });

      res.status(201).json(newImage);
    } catch (error: any) {
      console.error("Error al registrar imagen:", error);
      res
        .status(500)
        .json({ error: error.message || "Error al registrar la imagen" });
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
    res
      .status(500)
      .json({ error: "Error al actualizar las imágenes destacadas" });
  }
});

router.put(
  "/:id",
  upload.single("imageFile"),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const alt = req.body.alt !== undefined ? req.body.alt.trim() : undefined;
      const imageUrl =
        req.body.imageUrl !== undefined ? req.body.imageUrl.trim() : undefined;
      const { isActive, isFeatured, order } = req.body;

      const existingImage = await prisma.galeria.findUnique({
        where: { id: Number(id) },
      });

      if (!existingImage) {
        return res.status(404).json({ error: "Imagen no encontrada" });
      }

      let newSrc = existingImage.src;

      if (req.file) {
        newSrc = `/api/galeria/image/${req.file.filename}`;
        deletePhysicalFile(existingImage.src);
      } else if (imageUrl && imageUrl !== existingImage.src) {
        newSrc = imageUrl;
        deletePhysicalFile(existingImage.src);
      } else if (
        alt &&
        alt !== existingImage.alt &&
        existingImage.src.startsWith("/api/galeria/image/")
      ) {
        const oldFilename = path.basename(existingImage.src);
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
            : `sin-titulo-${dateStr}-${randomSuffix}${ext}`;

          const newPath = path.join(uploadDir, newFilename);

          try {
            fs.renameSync(oldPath, newPath);
            newSrc = `/api/galeria/image/${newFilename}`;
          } catch (err) {
            console.error("Error al renombrar el archivo físico:", err);
          }
        }
      }

      const updatedImage = await prisma.galeria.update({
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

      res.json(updatedImage);
    } catch (error) {
      console.error("Error al actualizar imagen:", error);
      res.status(500).json({ error: "Error al actualizar la imagen" });
    }
  },
);

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const imageToDelete = await prisma.galeria.findUnique({
      where: { id: Number(id) },
    });

    if (imageToDelete) {
      deletePhysicalFile(imageToDelete.src);
    }

    await prisma.galeria.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Imagen eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar imagen:", error);
    res.status(500).json({ error: "Error al eliminar la imagen" });
  }
});

export default router;