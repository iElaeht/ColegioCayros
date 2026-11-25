import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../db";

const router = Router();

// Endpoint de login para administradores
router.post("/login", async (req: Request, res: Response) => {
  try {
    const rawUsuario = req.body.usuario ?? req.body.dni;
    const { password } = req.body;

    if (!rawUsuario || !password) {
      return res.status(400).json({ error: "El usuario y la contraseña son obligatorios" });
    }

    const cleanUsuario = String(rawUsuario).trim();
    const cleanPassword = String(password);

    const usuarioEncontrado = await prisma.usuario.findUnique({
      where: { usuario: cleanUsuario },
    });

    if (!usuarioEncontrado) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const passwordValida = await bcrypt.compare(cleanPassword, usuarioEncontrado.password);

    if (!passwordValida) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    return res.status(200).json({
      success: true,
      message: "¡Bienvenido al sistema!",
      usuario: {
        id: usuarioEncontrado.id,
        usuario: usuarioEncontrado.usuario,
      },
    });
  } catch (error) {
    console.error("Error crítico en el login:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;