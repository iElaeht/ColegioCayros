import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../db';

const router = Router();

// Endpoint de login para administradores
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { dni, password } = req.body;

    console.log("Intento de login recibido - DNI:", `"${dni}"`, "Password:", password ? "******" : "VACÍO");

    if (!dni || !password) {
      return res.status(400).json({ error: 'El DNI y la contraseña son obligatorios' });
    }

    // Limpiamos espacios en blanco por seguridad
    const cleanDni = String(dni).trim();
    const cleanPassword = String(password);

    const usuarioEncontrado = await prisma.usuario.findUnique({
      where: { dni: cleanDni },
    });

    if (!usuarioEncontrado) {
      console.warn(`DNI no encontrado en la base de datos: "${cleanDni}"`);
      return res.status(401).json({ error: 'Credenciales inválidas (DNI no registrado)' });
    }

    const passwordValida = await bcrypt.compare(cleanPassword, usuarioEncontrado.password);

    if (!passwordValida) {
      console.warn(`Contraseña incorrecta para el DNI: "${cleanDni}"`);
      return res.status(401).json({ error: 'Credenciales inválidas (Contraseña incorrecta)' });
    }

    console.log(`¡Login exitoso para el usuario: ${usuarioEncontrado.usuario}!`);

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
    console.error('Error crítico en el login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;