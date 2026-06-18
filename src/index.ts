/**
 * @file index.ts
 * @description Punto de entrada principal del servidor Tecda Maniquí.
 * Coordina la inicialización de la base de datos, carga de servicios en tiempo real (SSE) y el levantamiento del puerto HTTP.
 */

import app from './app.js';
import { conectarDB } from './db.js';
import { env } from './config/env.js';
import logger from './utils/logger.js';
import { sseManager } from './services/sse/SSEManager.js';

/**
 * Arranca la secuencia de inicialización del servidor backend.
 * 
 * Sigue el siguiente orden crítico de ejecución:
 * 1. Establece y valida la conexión física con la base de datos MySQL mediante Sequelize.
 * 2. Carga en memoria las órdenes de producción pendientes en el `sseManager` para la comunicación en tiempo real.
 * 3. Inicia la escucha de peticiones HTTP en el puerto configurado por entorno.
 * 
 * Si ocurre cualquier error durante esta fase, se registrará el error y el proceso de Node.js finalizará de forma forzada.
 * 
 * @function startServer
 * @returns {Promise<void>} Promesa vacía cuando el servidor se inicializa correctamente.
 */
async function startServer(): Promise<void> {
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

// Ejecución del arranque del servidor
startServer();

