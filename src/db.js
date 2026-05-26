import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'tecda_maniqui',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || 'password',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    dialectOptions: {
      multipleStatements: true
    },
    logging: false,
 // Desactivar logs de SQL en consola para mayor limpieza
    define: {
      timestamps: false, // Las tablas originales no usan el estándar de Sequelize
      freezeTableName: true // Evita que Sequelize pluralice los nombres de las tablas
    }
  }
);

export const conectarDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión establecida con Sequelize (MySQL)');
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error.message);
  }
};

export default sequelize;
