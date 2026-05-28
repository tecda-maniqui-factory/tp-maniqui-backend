/**
 * @file fix_inconsistencies.js
 * @description Script para corregir maniquíes con estado 'Vendido' sin venta asociada.
 */

import { Maniqui, DetalleVenta } from './src/models/index.js';
import sequelize from './src/db.js';

async function fix() {
  const t = await sequelize.transaction();
  try {
    const maniquies = await Maniqui.findAll({ 
      where: { status: 'Vendido' },
      transaction: t 
    });

    console.log(`🔍 Revisando ${maniquies.length} maniquíes marcados como vendidos...`);

    let corregidos = 0;
    for (const m of maniquies) {
      const detalle = await DetalleVenta.findOne({ 
        where: { maniqui_id: m.id },
        transaction: t 
      });

      if (!detalle) {
        console.log(`⚠️ Maniquí ID ${m.id} (Serie: ${m.numero_serie}) está marcado como vendido pero no tiene registro de venta. Reseteando a 'Disponible'...`);
        await m.update({ status: 'Disponible' }, { transaction: t });
        corregidos++;
      }
    }

    await t.commit();
    console.log(`✅ Sincronización completada. Se corrigieron ${corregidos} maniquíes.`);
    process.exit(0);
  } catch (error) {
    if (t) await t.rollback();
    console.error('❌ Error durante la sincronización:', error);
    process.exit(1);
  }
}

fix();
