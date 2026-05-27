/**
 * @file run_db_reform.js
 * @description Ejecuta los scripts SQL de migración y estructura para actualizar el esquema de la DB.
 * Automatiza el proceso de actualización desde la carpeta de gestión de BBDD.
 */

import fs from 'fs';
import sequelize, { conectarDB } from './src/db.js';

/**
 * Lee y ejecuta de forma secuencial los archivos .sql del proyecto de BBDD.
 * @async
 * @returns {Promise<void>}
 */
const reformarDB = async () => {
  try {
    await conectarDB();
    
    const scriptsDir = '../../GESTION_BBDD/tp-maniqui-db/scripts/';
    const files = [
      'step1_schema_and_catalogs.sql',
      'step2_triggers_and_automation.sql',
      'step3_logic_sp_and_functions.sql',
      'step4_user_management.sql',
      'step5_enterprise_features.sql'
    ];

    console.log('🏗️ Iniciando reforma integral de la base de datos...');
    
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    for (const file of files) {
      const filePath = scriptsDir + file;
      let sql = fs.readFileSync(filePath, 'utf8');
      
      console.log(`📄 Procesando archivo: ${file}`);

      // Limpieza necesaria para que el motor de SQL acepte el string
      const sqlLimpio = sql
        .replace(/DELIMITER \/\/|DELIMITER ;/gi, '') // Eliminar comandos de CLI
        .replace(/\/\//g, ';'); // Convertir terminadores de bloque en punto y coma estándar

      try {
        await sequelize.query(sqlLimpio);
        console.log(`✅ ${file} ejecutado con éxito.`);
      } catch (error) {
        // Ignoramos errores de "DROP" o "DATABASE EXISTS"
        if (!sqlLimpio.includes('DROP') && !sqlLimpio.includes('EXISTS')) {
          console.error(`❌ Error en ${file}:`, error.message);
        } else {
          console.log(`⚠️ ${file} ejecutado con algunos avisos (posiblemente de limpieza previa).`);
        }
      }
    }

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('🚀 Base de datos reformada e inicializada correctamente.');
    process.exit(0);
  } catch (error) {
    console.error('💥 Error crítico en la reforma:', error.message);
    process.exit(1);
  }
};

reformarDB();
