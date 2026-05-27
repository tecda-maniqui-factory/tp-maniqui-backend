/**
 * @file index.ts
 * @description Punto de entrada principal del servidor Tecda Maniquí.
 */

import app from './app.js';
import { conectarDB } from './db.js';
import { env } from './config/env.js';
import logger from './utils/logger.js';

// Inicializar conexión a base de datos
conectarDB();

/**
 * Arranca el proceso de escucha del servidor HTTP.
 */
app.listen(env.PORT, () => {
  logger.info(`🚀 Servidor Tecda Maniquí corriendo en http://localhost:${env.PORT}`);
  logger.info(`📡 Modo: ${env.NODE_ENV}`);
});
