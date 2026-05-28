/**
 * @file populate_db.js
 * @description Script robusto y ATÓMICO para poblar la base de datos con stock suficiente para ensamblar (6 piezas).
 */

import bcrypt from 'bcryptjs';
import { 
  Usuario, 
  Modelo, 
  Maniqui, 
  Cliente, 
  Pieza, 
  Venta, 
  DetalleVenta 
} from './src/models/index.js';
import sequelize from './src/db.js';

const populate = async () => {
  const transaction = await sequelize.transaction();
  try {
    console.log('⏳ Iniciando población atómica...');
    
    // 1. Usuarios
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);
    await Usuario.bulkCreate([
      { username: 'vendedor_test', password_hash: passwordHash, nombre_completo: 'Pablo Vendedor', rol: 'vendedor' },
      { username: 'gerente_test', password_hash: passwordHash, nombre_completo: 'Ana Gerente', rol: 'gerente_prod' },
      { username: 'admin_pablo', password_hash: await bcrypt.hash('tecda2026', salt), nombre_completo: 'Pablo Admin', rol: 'gerente_prod' }
    ], { ignoreDuplicates: true, transaction });

    // 2. Modelos
    // Nota: El SP valida que el modelo exista. Usaremos IDs fijos para coincidir con el catálogo si es necesario.
    await Modelo.bulkCreate([
      { id: 1, nombre: 'Modelo Alpha', costo_unitario: 10000, precio_venta: 30000 },
      { id: 2, nombre: 'Modelo Beta', costo_unitario: 12000, precio_venta: 35000 }
    ], { ignoreDuplicates: true, transaction });
    
    const modelosDB = await Modelo.findAll({ transaction });

    // 3. Clientes
    await Cliente.bulkCreate([
      { nombre: 'Cliente Real S.A.', cuit_cuil: '30-11222333-4', email: 'contacto@real.com' }
    ], { ignoreDuplicates: true, transaction });
    const clientesDB = await Cliente.findAll({ transaction });

    // 4. Piezas en Stock (Sueltas)
    // Tipos Requeridos por SP: 1: Cabeza, 2: Torso, 3: Brazo Der, 4: Brazo Izq, 5: Pierna Der, 6: Pierna Izq
    console.log('📦 Generando piezas en stock (6 tipos por modelo)...');
    const piezasSueltas = [];
    for (const mod of modelosDB) {
      for (let tipo = 1; tipo <= 6; tipo++) {
        for (let i = 1; i <= 5; i++) { // 5 de cada tipo para cada modelo
          piezasSueltas.push({
            serial_parte: `P-${mod.id}-${tipo}-${i}-${Math.floor(Math.random() * 10000)}`,
            tipo_parte_id: tipo,
            modelo_id: mod.id,
            origen_id: 1, 
            tono_acabado_id: 1, 
            costo: mod.costo_unitario / 6,
            maniqui_id: null
          });
        }
      }
    }
    await Pieza.bulkCreate(piezasSueltas, { transaction, ignoreDuplicates: true });

    // 5. Maniquíes ya ensamblados (Disponibles)
    console.log('🤖 Creando maniquíes ya disponibles...');
    const maniquiesData = [];
    for (const mod of modelosDB) {
      for (let i = 1; i <= 2; i++) {
        maniquiesData.push({
          numero_serie: `S-${mod.id}-${i}-${Math.floor(Math.random() * 1000)}`,
          modelo_id: mod.id,
          status: 'Disponible',
          fecha_ensamblaje: new Date()
        });
      }
    }
    const maniquiesCreados = await Maniqui.bulkCreate(maniquiesData, { transaction });

    // 6. Simular una venta
    console.log('💰 Registrando una venta de prueba...');
    const facturaNro = `FAC-${Date.now()}`;
    const cliente = clientesDB[0];
    const maniquiAVender = maniquiesCreados[0];
    const modeloManiqui = modelosDB.find(m => m.id === maniquiAVender.modelo_id);

    const nuevaVenta = await Venta.create({
      cliente_id: cliente.id,
      total: modeloManiqui.precio_venta,
      metodo_pago: 'Efectivo',
      nro_factura: facturaNro,
      moneda: 'ARS'
    }, { transaction });

    await DetalleVenta.create({
      venta_id: nuevaVenta.id,
      maniqui_id: maniquiAVender.id,
      precio_final: modeloManiqui.precio_venta
    }, { transaction });

    await maniquiAVender.update({ status: 'Vendido' }, { transaction });

    await transaction.commit();
    console.log('✅ Base de datos poblada con éxito. Listo para ensamblar (6 tipos de piezas).');
    process.exit(0);
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('❌ Error en población:', error.message);
    process.exit(1);
  }
};

populate();
