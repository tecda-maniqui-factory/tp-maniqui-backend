import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/authRoutes.js';
import produccionRoutes from './routes/produccionRoutes.js';
import comercialRoutes from './routes/comercialRoutes.js';
import sistemaRoutes from './routes/sistemaRoutes.js';

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const swaggerDocument = YAML.load('./openapi.yaml');
const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Documentación
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rutas
app.use('/auth', authRoutes);
app.use('/', produccionRoutes);
app.use('/', comercialRoutes);
app.use('/', sistemaRoutes);

// Rutas base y sistema (Salud e Info)
app.get('/', (req, res) => {
  res.json({
    mensaje: "Bienvenido a la API de Tecda Maniquí",
    version: "2.0.0",
    docs: "/sistema/info"
  });
});

app.get('/sistema/health', (req, res) => {
  res.json({
    status: "UP",
    db_connection: true,
    uptime: process.uptime()
  });
});

app.get('/sistema/info', (req, res) => {
  res.json({
    nombre: "Tecda Maniquí API",
    version: "2.0.0",
    entorno: process.env.NODE_ENV
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('❌ Error no controlado:', err);
  res.status(500).json({ error: err.message || 'Error interno del servidor' });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

export default app;
