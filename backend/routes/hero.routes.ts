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

const deletePhysicalFile = (srcPath: string) => {
  if (srcPath && srcPath.startsWith("/api/hero/image/")) {
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
    const rawTitle = req.body.title ? req.body.title.trim() : "";
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
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(
      new Error(
        "Solo se permiten archivos de imagen válidos (png, jpg, jpeg, webp, avif)",
      ),
    );
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
      const rawTitle = req.body.title;
      const rawImageUrl = req.body.imageUrl;

      const title = rawTitle ? rawTitle.trim() : null;
      const imageUrl = rawImageUrl ? rawImageUrl.trim() : "";

      let finalSrc = "";

      if (req.file) {
        finalSrc = `/api/hero/image/${req.file.filename}`;
      } else if (imageUrl) {
        finalSrc = imageUrl;
      } else {
        return res
          .status(400)
          .json({
            error: "Debe subir un archivo de imagen o proporcionar una URL",
          });
      }

      const newSlide = await prisma.hero.create({
        data: {
          imageUrl: finalSrc,
          title,
          isActive: true,
          isFeatured:
            req.body.isFeatured === "true" || req.body.isFeatured === true,
          order: req.body.order ? Number(req.body.order) : 0,
        },
      });

      res.status(201).json(newSlide);
    } catch (error: any) {
      console.error("Error al registrar slide del hero:", error);
      res
        .status(500)
        .json({ error: error.message || "Error al registrar el slide" });
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
    res
      .status(500)
      .json({ error: "Error al actualizar los slots del hero" });
  }
});

router.put(
  "/:id",
  upload.single("imageFile"),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const title = req.body.title !== undefined ? req.body.title.trim() : undefined;
      const imageUrl =
        req.body.imageUrl !== undefined ? req.body.imageUrl.trim() : undefined;
      const { isActive, isFeatured, order } = req.body;

      const existingSlide = await prisma.hero.findUnique({
        where: { id: Number(id) },
      });

      if (!existingSlide) {
        return res.status(404).json({ error: "Slide no encontrado" });
      }

      let newSrc = existingSlide.imageUrl;

      if (req.file) {
        newSrc = `/api/hero/image/${req.file.filename}`;
        deletePhysicalFile(existingSlide.imageUrl);
      } else if (imageUrl && imageUrl !== existingSlide.imageUrl) {
        newSrc = imageUrl;
        deletePhysicalFile(existingSlide.imageUrl);
      } else if (
        title &&
        title !== existingSlide.title &&
        existingSlide.imageUrl.startsWith("/api/hero/image/")
      ) {
        const oldFilename = path.basename(existingSlide.imageUrl);
        const oldPath = path.join(uploadDir, oldFilename);

        if (fs.existsSync(oldPath)) {
          const cleanTitle = slugify(title);
          const ext = path.extname(oldFilename);

          const parts = oldFilename.split("-");
          const dateStr =
            parts[parts.length - 2] ||
            new Date().toISOString().slice(0, 10).replace(/-/g, "");
          const randomSuffix =
            parts[parts.length - 1]?.split(".")[0] ||
            Math.floor(1000 + Math.random() * 9000);

          const newFilename = cleanTitle
            ? `${cleanTitle}-${dateStr}-${randomSuffix}${ext}`
            : `hero-slide-${dateStr}-${randomSuffix}${ext}`;

          const newPath = path.join(uploadDir, newFilename);

          try {
            fs.renameSync(oldPath, newPath);
            newSrc = `/api/hero/image/${newFilename}`;
          } catch (err) {
            console.error("Error al renombrar el archivo físico:", err);
          }
        }
      }

      const updatedSlide = await prisma.hero.update({
        where: { id: Number(id) },
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

      res.json(updatedSlide);
    } catch (error) {
      console.error("Error al actualizar slide:", error);
      res.status(500).json({ error: "Error al actualizar el slide" });
    }
  },
);

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const slideToDelete = await prisma.hero.findUnique({
      where: { id: Number(id) },
    });

    if (slideToDelete) {
      deletePhysicalFile(slideToDelete.imageUrl);
    }

    await prisma.hero.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Slide eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar slide:", error);
    res.status(500).json({ error: "Error al eliminar el slide" });
  }
});

export default router;