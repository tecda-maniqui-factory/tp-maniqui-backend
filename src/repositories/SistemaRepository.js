import { Modelo, Maniqui } from '../models/index.js';
import sequelize from '../db.js';

/**
 * Patrón Repository para consultas de Sistema, Catálogos y Reportes.
 */
class SistemaRepository {
  // Catálogos
  async findAllModelos() {
    return await Modelo.findAll();
  }

  async rawQuery(query, replacements = []) {
    const [rows] = await sequelize.query(query, { replacements });
    return rows;
  }

  // Reportes y Analítica
  async getProduccionResumen() {
    return await Maniqui.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad']
      ],
      group: ['status']
    });
  }

  async calcularDescuentoUDF(modeloId, porcentaje) {
    const [result] = await sequelize.query(
      'SELECT precio_venta, CalcularDescuento(precio_venta, ?) as precio_final FROM Modelos WHERE id = ?',
      { replacements: [porcentaje, modeloId] }
    );
    return result[0];
  }

  // Proveedores
  async findProveedores() {
    return await this.rawQuery("SELECT * FROM Origenes_Piezas WHERE tipo = 'Proveedor Externo'");
  }

  async createProveedor(nombre, codigo) {
    return await sequelize.query(
      "INSERT INTO Origenes_Piezas (nombre, codigo, tipo) VALUES (?, ?, 'Proveedor Externo')",
      { replacements: [nombre, codigo] }
    );
  }
}

export default new SistemaRepository();
