/**
 * @file db.ts
 * @description Gestión de la conexión a la base de datos MySQL utilizando Sequelize ORM.
 */

import { Sequelize } from 'sequelize';
import { env } from './config/env.js';
import logger from './utils/logger.js';

/**
 * Instancia central de Sequelize para la comunicación con la base de datos.
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
      multipleStatements: true
    },
    logging: (msg) => logger.debug(msg),
    define: {
      timestamps: false,
      freezeTableName: true
    }
  }
);

/**
 * Verifica la autenticación con el servidor de base de datos.
 */
export const conectarDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Conexión establecida con Sequelize (MySQL)');
  } catch (error: any) {
    logger.error('❌ No se pudo conectar a la base de datos: %s', error.message);
  }
};

export default sequelize;
