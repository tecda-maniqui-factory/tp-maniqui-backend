/**
 * @file app.ts
 * @description Configuración central y middlewares de la aplicación Express.
 * Define el pipeline de procesamiento de peticiones, endpoints de utilidad y el enrutamiento de los módulos.
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

/** Carga el esquema de documentación OpenAPI desde el archivo de especificaciones */
const swaggerDocument = YAML.load('./openapi.yaml');

/** Instancia principal de la aplicación Express */
const app: Application = express();

// --- MIDDLEWARES GLOBALES ---

/** Agrega cabeceras de seguridad HTTP para resguardar la aplicación */
app.use(helmet());

/** Habilita CORS (Cross-Origin Resource Sharing) para peticiones entre orígenes */
app.use(cors());

/** Registra peticiones HTTP en formato legible por consola en entorno de desarrollo */
app.use(morgan('dev'));

/** Parsea los cuerpos de las peticiones entrantes con formato JSON */
app.use(express.json());

// --- DOCUMENTACIÓN ---

/** Endpoint para renderizar la interfaz de usuario interactiva de la documentación de la API */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- ENDPOINTS DE SISTEMA ---

/**
 * Endpoint raíz.
 * Ofrece información básica de bienvenida, versión de la API y el enlace a la documentación interactiva.
 */
app.get('/', (req: Request, res: Response) => {
  res.json({
    mensaje: "Bienvenido a la API de Tecda Maniquí",
    version: "2.1.0",
    docs: "/api-docs"
  });
});

/**
 * Endpoint de estado de salud (Health Check).
 * Verifica la disponibilidad operativa de la API del servidor.
 */
app.get('/sistema/health', (req: Request, res: Response) => {
  res.json({
    status: "UP",
    db_connection: true,
    uptime: process.uptime()
  });
});

/**
 * Endpoint de información general.
 * Retorna metadatos operativos como el nombre de la app, versión y entorno en ejecución.
 */
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

/** Middleware centralizado para interceptar errores no controlados y enviar respuestas consistentes */
app.use(errorHandler);

/** Manejador fallback para capturar peticiones a rutas inexistentes (404) */
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

/** Aplicación Express configurada y lista para escuchar peticiones HTTP */
export default app;

