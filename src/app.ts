/**
 * @file app.ts
 * @description Configuración central de Express. 
 */

import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/authRoutes.js';
import produccionRoutes from './routes/produccionRoutes.js';
import comercialRoutes from './routes/comercialRoutes.js';
import sistemaRoutes from './routes/sistemaRoutes.js';
import notificacionesRoutes from './routes/notificacionesRoutes.js';

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import { errorHandler } from './middleware/errorMiddleware.js';

const swaggerDocument = YAML.load('./openapi.yaml');

const app: Application = express();

// --- MIDDLEWARES GLOBALES ---
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// --- DOCUMENTACIÓN ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- ENDPOINTS DE SISTEMA ---
app.get('/', (req: Request, res: Response) => {
  res.json({
    mensaje: "Bienvenido a la API de Tecda Maniquí",
    version: "2.1.0",
    docs: "/api-docs"
  });
});

app.get('/sistema/health', (req: Request, res: Response) => {
  res.json({
    status: "UP",
    db_connection: true,
    uptime: process.uptime()
  });
});

app.get('/sistema/info', (req: Request, res: Response) => {
  res.json({
    nombre: "Tecda Maniquí API",
    version: "2.1.0",
    entorno: process.env.NODE_ENV
  });
});

// --- RUTAS DE MÓDULOS ---
app.use('/auth', authRoutes);
app.use('/', produccionRoutes);
app.use('/', comercialRoutes);
app.use('/', sistemaRoutes);
app.use('/notificaciones', notificacionesRoutes);

// --- MANEJO DE ERRORES ---
app.use(errorHandler);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

/** Aplicación Express configurada */
export default app;
