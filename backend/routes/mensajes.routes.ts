import { Router, Request, Response } from 'express';
import { prisma } from '../db';

const router = Router();

// Obtener la lista de mensajes para el Dashboard
router.get('/', async (req: Request, res: Response) => {
  try {
    const mensajes = await prisma.mensajeContacto.findMany({
      orderBy: { fecha: 'desc' },
    });
    res.status(200).json(mensajes);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ error: 'No se pudieron obtener los mensajes' });
  }
});

// Guardar un nuevo mensaje desde el formulario público
router.post('/', async (req: Request, res: Response) => {
  try {
    const { dni, nombre, telefono, asunto } = req.body;

    if (!dni || !nombre || !telefono || !asunto) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const nuevoMensaje = await prisma.mensajeContacto.create({
      data: { dni, nombre, telefono, asunto },
    });

    res.status(201).json({ success: true, data: nuevoMensaje });
  } catch (error) {
    console.error('Error al guardar mensaje:', error);
    res.status(500).json({ error: 'No se pudo guardar el mensaje en la base de datos' });
  }
});

export default router;