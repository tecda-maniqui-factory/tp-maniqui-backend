/**
 * @file reset_db_users.js
 * @description Script de mantenimiento para limpiar y repoblar la base de datos con datos de prueba (Seed).
 * Útil para entornos de desarrollo y testing.
 */

import bcrypt from 'bcryptjs';
import sequelize, { conectarDB } from './src/db.js';
import { Usuario } from './src/models/index.js';

/**
 * Ejecuta el proceso de truncado de tablas e inserción de datos semilla.
 * @async
 * @returns {Promise<void>}
 */
const resetDB = async () => {
  try {
    await conectarDB();

    console.log('🧹 Reseteando Base de Datos completa...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    const tablas = [
      'Logs_Auditoria', 'Detalle_Ventas', 'Ventas', 'Clientes', 
      'Piezas', 'Maniquies', 'Usuarios', 'sistema_secuencias',
      'Modelos', 'Cat_Sexos', 'Cat_Estilos', 'Cat_TiposCuerpo', 
      'Cat_TiposParte', 'Cat_TonosAcabado', 'Origenes_Piezas'
    ];

    for (const tabla of tablas) {
      await sequelize.query(`TRUNCATE TABLE ${tabla}`);
    }
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('🌱 Insertando Catálogos base...');
    await sequelize.query("INSERT INTO Cat_Sexos (id, nombre) VALUES (1, 'Masculino'), (2, 'Femenino')");
    await sequelize.query("INSERT INTO Cat_Estilos (id, nombre) VALUES (1, 'Realista'), (2, 'Abstracto')");
    await sequelize.query("INSERT INTO Cat_TiposCuerpo (id, nombre) VALUES (1, 'Entero'), (2, 'Busto')");
    await sequelize.query("INSERT INTO Cat_TiposParte (id, nombre, codigo) VALUES (1, 'Cabeza', 'CAB'), (2, 'Torso', 'TOR'), (3, 'Brazo D', 'BRD'), (4, 'Brazo I', 'BRI'), (5, 'Pierna D', 'PID'), (6, 'Pierna I', 'PII')");
    await sequelize.query("INSERT INTO Cat_TonosAcabado (id, nombre, acabado) VALUES (1, 'Blanco', 'Mate')");
    await sequelize.query("INSERT INTO Origenes_Piezas (id, nombre, codigo, tipo) VALUES (1, 'Planta', 'INT', 'Produccion Interna')");
    
    console.log('📐 Creando Modelo semilla...');
    await sequelize.query("INSERT INTO Modelos (id, nombre, sexo_id, estilo_id, cuerpo_id, precio_venta, costo_unitario, activo) VALUES (1, 'Modelo Test Pro', 1, 1, 1, 50000.00, 20000.00, 1)");

    console.log('⚙️ Inicializando secuencias...');
    await sequelize.query("INSERT INTO sistema_secuencias (tipo_parte_id, ultimo_numero) SELECT id, 0 FROM Cat_TiposParte");

    console.log('👤 Creando administrador...');
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash('tecda2026', salt);
    await Usuario.create({
      username: 'admin_pablo',
      password_hash,
      nombre_completo: 'Pablo Administrador',
      email: 'admin@tecda.com',
      rol: 'gerente_prod'
    });

    console.log('📦 Insertando piezas semilla para ensamblaje...');
    for (let i = 1; i <= 10; i++) {
      await sequelize.query(`INSERT INTO Piezas (tipo_parte_id, modelo_id, origen_id, tono_acabado_id, costo) VALUES (${(i % 6) + 1}, 1, 1, 1, 100.00)`);
    }

    console.log('✅ Base de Datos reconstruida y lista.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el reset:', error.message);
    process.exit(1);
  }
};

resetDB();
