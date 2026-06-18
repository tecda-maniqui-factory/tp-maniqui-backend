/**
 * @file db.ts
 * @description Gestión de la conexión a la base de datos MySQL utilizando el ORM Sequelize.
 * Configura la instancia de conexión, el dialecto del motor de base de datos y la sincronización de modelos.
 */

import { Sequelize } from 'sequelize';
import { env } from './config/env.js';
import logger from './utils/logger.js';

/**
 * Instancia centralizada de Sequelize configurada para la comunicación con MySQL.
 * 
 * Configura el pool de conexiones usando los valores limpios del entorno (`env`) y establece:
 * - El dialecto como MySQL.
 * - Habilitación de múltiples sentencias para consultas complejas.
 * - Registro de consultas SQL redirigidas al logger en nivel de depuración (debug).
 * - Deshabilitación de timestamps globales y congelación del nombre de tablas por defecto.
 */
const sequelize = new Sequelize(
  env.DB_NAME,
  env.DB_USER,
  env.DB_PASS,
  {
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: 'mysql',
    dialectOptions: {
      /** Habilita la ejecución de múltiples sentencias SQL en una sola consulta */
      multipleStatements: true
    },
    /** Redirige los logs de consultas SQL al sistema de logger de la aplicación */
    logging: (msg) => logger.debug(msg),
    define: {
      /** Evita que Sequelize agregue automáticamente columnas createdAt y updatedAt a las tablas */
      timestamps: false,
      /** Previene que Sequelize pluralice automáticamente el nombre de las tablas */
      freezeTableName: true
    }
  }
);

/**
 * Verifica la autenticación con el servidor MySQL y sincroniza los modelos.
 * 
 * Esta función:
 * 1. Intenta conectarse al servidor mediante `.authenticate()`.
 * 2. Sincroniza las definiciones de modelos en memoria con las tablas físicas de la base de datos mediante `.sync()`.
 * 
 * @returns {Promise<void>} Promesa que se resuelve cuando la base de datos se ha autenticado y sincronizado con éxito.
 * @throws {Error} Imprime un registro de error en consola si falla la autenticación o sincronización.
 */
export const conectarDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Conexión establecida con Sequelize (MySQL)');
    await sequelize.sync();
    logger.info('✅ Modelos sincronizados con la Base de Datos');
  } catch (error: any) {
    logger.error('❌ No se pudo conectar a la base de datos: %s', error.message);
  }
};

export default sequelize;

