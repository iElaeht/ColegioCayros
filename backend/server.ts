// backend/server.ts
import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { prisma } from './db';

// Importación de rutas modulares
import authRoutes from './routes/auth.routes';
import mensajesRoutes from './routes/mensajes.routes';
import galeriaRoutes from './routes/galeria.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Backend de Colegio Cayros API está activo y modularizado');
});

// ==========================================
// REGISTRO DE RUTAS MODULARES
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/mensajes', mensajesRoutes);
app.use('/api/galeria', galeriaRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Ruta no encontrada en el servidor' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo de forma modular en http://localhost:${PORT}`);
});