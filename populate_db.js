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
  let transaction;
  try {
    console.log('⏳ Modificando columna rol para soportar operario...');
    await sequelize.query("ALTER TABLE Usuarios MODIFY COLUMN rol ENUM('vendedor', 'gerente_prod', 'operario') DEFAULT 'vendedor'");

    transaction = await sequelize.transaction();
    console.log('⏳ Iniciando población atómica...');

    // Asegurar Orígenes de Piezas básicos
    await sequelize.query("INSERT IGNORE INTO Origenes_Piezas (id, nombre, codigo, tipo) VALUES (1, 'Planta', 'INT', 'Produccion Interna'), (2, 'Proveedor Externo A', 'EXT-A', 'Proveedor Externo')", { transaction });
    
    // 1. Usuarios
    const salt = await bcrypt.genSalt(10);
    const hashGerente = await bcrypt.hash('gerente', salt);
    const hashVendedor = await bcrypt.hash('vendedor', salt);
    const hashOperario = await bcrypt.hash('operario', salt);

    await Usuario.bulkCreate([
      { username: 'gerente', password_hash: hashGerente, nombre_completo: 'Gerente Simplificado', rol: 'gerente_prod' },
      { username: 'vendedor', password_hash: hashVendedor, nombre_completo: 'Vendedor Simplificado', rol: 'vendedor' },
      { username: 'operario', password_hash: hashOperario, nombre_completo: 'Operario Simplificado', rol: 'operario' }
    ], { ignoreDuplicates: true, transaction });

    // 2. Modelos
    // Nota: El SP valida que el modelo exista. Usaremos IDs fijos para coincidir con el catálogo si es necesario.
    await Modelo.bulkCreate([
      { id: 1, nombre: 'Modelo Alpha', costo_unitario: 10000, precio_venta: 30000, sexo_id: 1, estilo_id: 1, cuerpo_id: 1 },
      { id: 2, nombre: 'Modelo Beta', costo_unitario: 12000, precio_venta: 35000, sexo_id: 1, estilo_id: 1, cuerpo_id: 1 }
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
    console.log('DEBUG models:', modelosDB.map(m => ({ id: m.id, nombre: m.nombre })));
    const maniquiAVender = maniquiesCreados[0];
    console.log('DEBUG maniqui:', maniquiAVender ? { id: maniquiAVender.id, modelo_id: maniquiAVender.modelo_id } : 'null');
    
    if (maniquiAVender) {
      const modeloManiqui = modelosDB.find(m => m.id === maniquiAVender.modelo_id);
      console.log('DEBUG modeloManiqui:', modeloManiqui ? { id: modeloManiqui.id, precio: modeloManiqui.precio_venta } : 'null');
      
      const precio = modeloManiqui ? modeloManiqui.precio_venta : 30000;
      const facturaNro = `FAC-${Date.now()}`;
      const cliente = clientesDB[0];

      const nuevaVenta = await Venta.create({
        cliente_id: cliente.id,
        total: precio,
        metodo_pago: 'Efectivo',
        nro_factura: facturaNro,
        moneda: 'ARS'
      }, { transaction });

      await DetalleVenta.create({
        venta_id: nuevaVenta.id,
        maniqui_id: maniquiAVender.id,
        precio_final: precio
      }, { transaction });

      await maniquiAVender.update({ status: 'Vendido' }, { transaction });
    }

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
