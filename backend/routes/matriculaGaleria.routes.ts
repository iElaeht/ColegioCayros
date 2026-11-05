// backend/routes/matriculaGaleria.routes.ts
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `matricula-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

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

// 3. Subir una nueva imagen (con límite de hasta 6 slots verificado opcionalmente)
router.post("/", upload.single("imageFile"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Se requiere un archivo de imagen" });
    }

    const count = await prisma.matriculaGaleria.count();
    if (count >= 8) {
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "Límite alcanzado: solo se permiten hasta 8 imágenes en el carrusel." });
    }

    // Ajusta esta ruta base según cómo registres tu router en server.ts
    const imageUrl = `/api/matricula-galeria/image/${req.file.filename}`;
    
    const newImage = await prisma.matriculaGaleria.create({
      data: {
        imageUrl,
        title: req.body.title || null,
        order: req.body.order ? Number(req.body.order) : count,
        isActive: req.body.isActive !== undefined ? req.body.isActive === "true" || req.body.isActive === true : true,
      },
    });

    res.status(201).json(newImage);
  } catch (error) {
    console.error("Error al subir imagen:", error);
    res.status(500).json({ error: "Error al subir la imagen" });
  }
});

// 4. Actualizar / Editar una imagen existente (Título, orden o estado activo)
router.put("/:id", upload.single("imageFile"), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, isActive, order } = req.body;

    const existing = await prisma.matriculaGaleria.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return res.status(404).json({ error: "Imagen no encontrada" });
    }

    let imageUrl = existing.imageUrl;

    // Si suben una nueva imagen al editar, reemplazamos el archivo físico anterior
    if (req.file) {
      const oldFilename = existing.imageUrl.split("/").pop();
      if (oldFilename) {
        const oldPath = path.join(uploadDir, oldFilename);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      imageUrl = `/api/matricula-galeria/image/${req.file.filename}`;
    }

    const updated = await prisma.matriculaGaleria.update({
      where: { id: Number(id) },
      data: {
        imageUrl,
        title: title !== undefined ? title : existing.title,
        isActive: isActive !== undefined ? isActive === "true" || isActive === true : existing.isActive,
        order: order !== undefined ? Number(order) : existing.order,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("Error al actualizar imagen:", error);
    res.status(500).json({ error: "Error al actualizar la imagen" });
  }
});

// 5. Eliminar una imagen de la galería
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const image = await prisma.matriculaGaleria.findUnique({
      where: { id: Number(id) },
    });

    if (!image) {
      return res.status(404).json({ error: "Imagen no encontrada" });
    }

    // Eliminar archivo físico de la carpeta uploads
    const filename = image.imageUrl.split("/").pop();
    if (filename) {
      const filePath = path.join(uploadDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await prisma.matriculaGaleria.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Imagen eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar imagen:", error);
    res.status(500).json({ error: "Error al eliminar la imagen" });
  }
});

// 6. Servir el archivo de imagen estático
router.get("/image/:filename", (req: Request, res: Response) => {
  // Forzamos a que sea tratado como string
  const filename = req.params.filename as string;
  const filePath = path.join(uploadDir, filename);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: "No encontrado" });
  }
});

export default router;