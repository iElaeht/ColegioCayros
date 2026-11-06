// backend/src/routes/mensaje.routes.ts
import { Router, Request, Response } from 'express';
import { prisma } from '../db';

const router = Router();

// 1. Obtener la lista completa de mensajes para el Dashboard
router.get('/', async (req: Request, res: Response) => {
  try {
    const mensajes = await prisma.mensajeContacto.findMany({
      orderBy: { fecha: 'desc' },
    });
    return res.status(200).json(mensajes);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    return res.status(500).json({ error: 'No se pudieron obtener los mensajes' });
  }
});

// 2. Obtener un mensaje específico por ID (UUID String)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const mensaje = await prisma.mensajeContacto.findUnique({
      where: { id },
    });

    if (!mensaje) {
      return res.status(404).json({ error: 'Mensaje no encontrado' });
    }

    return res.status(200).json(mensaje);
  } catch (error) {
    console.error('Error al obtener el mensaje:', error);
    return res.status(500).json({ error: 'No se pudo obtener el mensaje' });
  }
});

// 3. Guardar un nuevo mensaje desde el formulario público
router.post('/', async (req: Request, res: Response) => {
  try {
    const { dni, nombre, telefono, asunto } = req.body;

    if (!dni || !nombre || !telefono || !asunto) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const nuevoMensaje = await prisma.mensajeContacto.create({
      data: { dni, nombre, telefono, asunto },
    });

    return res.status(201).json({ success: true, data: nuevoMensaje });
  } catch (error) {
    console.error('Error al guardar mensaje:', error);
    return res.status(500).json({ error: 'No se pudo guardar el mensaje en la base de datos' });
  }
});

// 4. Actualizar un mensaje existente por ID
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { dni, nombre, telefono, asunto } = req.body;

    const mensajeActualizado = await prisma.mensajeContacto.update({
      where: { id },
      data: { dni, nombre, telefono, asunto },
    });

    return res.status(200).json({ success: true, data: mensajeActualizado });
  } catch (error) {
    console.error('Error al actualizar el mensaje:', error);
    return res.status(500).json({ error: 'No se pudo actualizar el mensaje' });
  }
});

// 5. Eliminar un mensaje por ID
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    await prisma.mensajeContacto.delete({
      where: { id },
    });

    return res.status(200).json({ success: true, message: 'Mensaje eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el mensaje:', error);
    return res.status(500).json({ error: 'No se pudo eliminar el mensaje' });
  }
});

export default router;