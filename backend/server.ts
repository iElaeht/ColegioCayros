import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from 'pg';

const { Pool } = pkg;

// Configuramos la conexión con el Pool de pg usando la variable de entorno
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Inicializamos Prisma pasándole el adaptador requerido por esta versión
const prisma = new PrismaClient({ adapter });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req: Request, res: Response) => {
  res.send('Backend de Colegio Cayros API está activo');
});

// Endpoint para el formulario de contacto
app.post('/api/contacto', async (req: Request, res: Response) => {
  try {
    const { dni, nombre, telefono, asunto } = req.body;

    if (!dni || !nombre || !telefono || !asunto) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const nuevoMensaje = await prisma.mensajeContacto.create({
      data: {
        dni,
        nombre,
        telefono,
        asunto,
      },
    });

    res.status(201).json({ success: true, data: nuevoMensaje });
  } catch (error) {
    console.error('Error al guardar mensaje:', error);
    res.status(500).json({ error: 'No se pudo guardar el mensaje en la base de datos' });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor backend TypeScript corriendo en http://localhost:${PORT}`);
});