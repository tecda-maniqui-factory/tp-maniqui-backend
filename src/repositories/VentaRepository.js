import { Venta, DetalleVenta, Maniqui, Cliente } from '../models/index.js';
import sequelize from '../db.js';

/**
 * Patrón Repository para Ventas.
 * Maneja transacciones complejas.
 */
class VentaRepository {
  async findAll(filters = {}) {
    const where = {};
    if (filters.cliente_id) where.cliente_id = filters.cliente_id;
    if (filters.metodo_pago) where.metodo_pago = filters.metodo_pago;

    return await Venta.findAll({
      where,
      include: [{ model: Cliente, attributes: ['nombre'] }]
    });
  }

  async findById(id) {
    return await Venta.findByPk(id);
  }

  /**
   * Registra una venta completa con sus detalles y actualización de stock.
   * Usa una transacción para asegurar la integridad atómica.
   */
  async createWithDetails(cliente_id, metodo_pago, maniquies) {
    const t = await sequelize.transaction();

    try {
      const total = maniquies.reduce((sum, m) => sum + m.precio_final, 0);
      
      const nuevaVenta = await Venta.create({
        cliente_id,
        total,
        metodo_pago: metodo_pago || 'Transferencia'
      }, { transaction: t });

      for (const item of maniquies) {
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
      return { id: nuevaVenta.id, total };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

export default new VentaRepository();
