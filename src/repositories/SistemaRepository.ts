/**
 * @file SistemaRepository.ts
 * @description Repositorio para consultas de catálogo, reportes y utilidades del sistema.
 */

import { Modelo, Maniqui } from '../models/index.js';
import sequelize from '../db.js';
import { ISistemaRepository } from '../types/repositories.js';
import { IModelo } from '../types/entities.js';

/**
 * Patrón Repository para consultas transversales de Sistema, Catálogos y Reportes Analíticos.
 */
class SistemaRepository implements ISistemaRepository {
  /**
   * Obtiene la lista completa de modelos técnicos activos.
   */
  async findAllModelos(): Promise<IModelo[]> {
    return await Modelo.findAll();
  }

  /**
   * Ejecuta una consulta SQL pura y devuelve los resultados.
   */
  async rawQuery(query: string, replacements: unknown[] = []): Promise<unknown[]> {
    const [rows] = await sequelize.query(query, { replacements });
    return rows as unknown[];
  }

  /**
   * Genera un resumen estadístico de la producción actual agrupado por estado.
   */
  async getProduccionResumen(): Promise<unknown[]> {
    return await Maniqui.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad']
      ],
      group: ['status']
    }) as any;
  }

  /**
   * Obtiene el reporte de rentabilidad desde la vista SQL.
   */
  async findRentabilidad(): Promise<unknown[]> {
    return await this.rawQuery('SELECT * FROM Vista_Rentabilidad');
  }

  /**
   * Obtiene el reporte de stock crítico desde la vista SQL.
   */
  async findStockCritico(): Promise<unknown[]> {
    return await this.rawQuery('SELECT * FROM Vista_Stock_Critico');
  }

  /**
   * Invoca la función almacenada 'CalcularDescuento' en la DB.
   */
  async calcularDescuentoUDF(modeloId: number, porcentaje: number): Promise<unknown | null> {
    const [result] = await sequelize.query(
      'SELECT precio_venta, CalcularDescuento(precio_venta, ?) as precio_final FROM Modelos WHERE id = ?',
      { replacements: [porcentaje, modeloId] }
    );
    return (result as any[])[0] || null;
  }

  /**
   * Obtiene los proveedores externos registrados en la tabla Origenes_Piezas.
   */
  async findProveedores(): Promise<unknown[]> {
    return await this.rawQuery("SELECT * FROM Origenes_Piezas WHERE tipo = 'Proveedor Externo'");
  }

  /**
   * Registra manualmente un nuevo proveedor externo.
   */
  async createProveedor(nombre: string, codigo: string): Promise<void> {
    await sequelize.query(
      "INSERT INTO Origenes_Piezas (nombre, codigo, tipo) VALUES (?, ?, 'Proveedor Externo')",
      { replacements: [nombre, codigo] }
    );
  }
}

/** Instancia singleton del repositorio */
const instance = new SistemaRepository();
export default instance;
export { SistemaRepository };
