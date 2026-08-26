import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../db';

const router = Router();

// Endpoint de login para administradores
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { dni, password } = req.body;

    if (!dni || !password) {
      return res.status(400).json({ error: 'El DNI y la contraseña son obligatorios' });
    }

    const usuarioEncontrado = await prisma.usuario.findUnique({
      where: { dni },
    });

    if (!usuarioEncontrado) {
      return res.status(401).json({ error: 'Credenciales inválidas (DNI no registrado)' });
    }

    const passwordValida = await bcrypt.compare(password, usuarioEncontrado.password);

    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales inválidas (Contraseña incorrecta)' });
    }

    res.status(200).json({
      success: true,
      message: '¡Bienvenido al sistema!',
      usuario: {
        id: usuarioEncontrado.id,
        nombre: usuarioEncontrado.usuario,
        dni: usuarioEncontrado.dni,
      },
    });

  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;