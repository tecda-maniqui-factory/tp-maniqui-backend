/**
 * @file VentaRepository.ts
 * @description Repositorio para la gestión de transacciones de venta.
 */

import { Venta, DetalleVenta, Maniqui } from '../models/index.js';
import sequelize from '../db.js';
import { IVentaRepository } from '../types/repositories.js';
import { IVenta } from '../types/entities.js';

/**
 * Patrón Repository para gestionar transacciones de Ventas.
 */
class VentaRepository implements IVentaRepository {
  /**
   * Obtiene todas las ventas con filtros opcionales.
   */
  async findAll(filters: Record<string, unknown> = {}): Promise<IVenta[]> {
    return await Venta.findAll({ where: filters as any });
  }

  /**
   * Registra una venta completa con sus detalles dentro de una transacción atómica.
   */
  async create(ventaData: Partial<IVenta>, detalles: { maniqui_id: number; precio_final: number }[]): Promise<IVenta> {
    const t = await sequelize.transaction();

    try {
      const nuevaVenta = await Venta.create(ventaData as any, { transaction: t });

      for (const item of detalles) {
        await DetalleVenta.create({
          venta_id: nuevaVenta.id,
          maniqui_id: item.maniqui_id,
          precio_final: item.precio_final
        }, { transaction: t });

        await Maniqui.update(
          { status: 'Vendido' },
          { where: { id: item.maniqui_id }, transaction: t }
        );
      }

      await t.commit();
      return nuevaVenta;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Busca una venta por su ID.
   */
  async findById(id: number): Promise<IVenta | null> {
    return await Venta.findByPk(id, {
      include: [DetalleVenta]
    });
  }
}

/**
 * Instancia única del repositorio de ventas (Singleton).
 */
const instance = new VentaRepository();
export default instance;
export { VentaRepository };
