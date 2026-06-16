/**
 * @file index.ts
 * @description Punto de entrada principal del servidor Tecda Maniquí.
 */

import app from './app.js';
import { conectarDB } from './db.js';
import { env } from './config/env.js';
import logger from './utils/logger.js';

import { sseManager } from './services/sse/SSEManager.js';

async function startServer() {
  try {
    // Inicializar conexión a base de datos y esperar a que esté lista
    await conectarDB();

    // Cargar órdenes en el SSEManager una vez que la DB esté conectada y sincronizada
    await sseManager.cargarOrdenesDesdeBD();

    /**
     * Arranca el proceso de escucha del servidor HTTP.
     */
    app.listen(env.PORT, () => {
      logger.info(`🚀 Servidor Tecda Maniquí corriendo en http://localhost:${env.PORT}`);
      logger.info(`📡 Modo: ${env.NODE_ENV}`);
    });
  } catch (error: any) {
    logger.error('❌ Error crítico al iniciar el servidor:', error.message);
    process.exit(1);
  }
}

startServer();
