/**
 * @file logger.ts
 * @description Configuración del motor de registro de logs de la aplicación utilizando Pino.
 * Define la severidad de log y el formato legible en consola según el entorno.
 */

import pino from 'pino';
import { env } from '../config/env.js';

/**
 * Instancia central de registro de logs de la aplicación.
 * 
 * Configura el comportamiento de registros según el entorno actual (`env.NODE_ENV`):
 * - En **desarrollo (`development`)**: Nivel establecido en `'debug'` y utiliza `pino-pretty` para dar formato de colores a la terminal.
 * - En **producción (`production`)**: Nivel establecido en `'info'`, sin formato extra para optimizar la velocidad y permitir un almacenamiento de logs estructurado en JSON.
 */
const logger = pino({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  ...(env.NODE_ENV === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        ignore: 'pid,hostname',
        translateTime: 'HH:MM:ss Z',
      },
    },
  }),
});

export default logger;

