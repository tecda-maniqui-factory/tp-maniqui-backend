/**
 * @file ManiquiRepository.ts
 * @description Repositorio para la gestión de persistencia y ensamblaje de Maniquíes.
 */

import { Maniqui, Modelo, Pieza } from '../models/index.js';
import sequelize from '../db.js';
import { IManiquiRepository } from '../types/repositories.js';
import { IManiqui } from '../types/entities.js';

/**
 * Patrón Repository para gestionar la persistencia y ensamblaje de Maniquíes.
 */
class ManiquiRepository implements IManiquiRepository {
  /**
   * Obtiene todos los maniquíes con filtros opcionales.
   */
  async findAll(filters: Record<string, unknown> = {}): Promise<IManiqui[]> {
    return await Maniqui.findAll({
      where: filters,
      include: [{ model: Modelo, attributes: ['nombre', 'precio_venta'] }]
    });
  }

  /**
   * Busca un maniquí específico por su número de serie único.
   */
  async findBySerie(numero_serie: string): Promise<IManiqui | null> {
    return await Maniqui.findOne({ where: { numero_serie } });
  }

  /**
   * Ejecuta el procedimiento almacenado 'EnsamblarManiqui' en la base de datos.
   */
  async assemble(modelo_id: number, numero_serie: string): Promise<any> {
    const [result] = await sequelize.query(
      'CALL EnsamblarManiqui(?, ?)',
      { replacements: [modelo_id, numero_serie] }
    );
    return result;
  }

  /**
   * Crea un registro de maniquí de forma directa.
   */
  async create(data: Partial<IManiqui>): Promise<IManiqui> {
    return await Maniqui.create(data as any);
  }

  /**
   * Busca piezas con filtros opcionales (útil para stock).
   */
  async findAllPiezas(filters: Record<string, unknown> = {}): Promise<any[]> {
    return await Pieza.findAll({ where: filters });
  }

  /**
   * Crea múltiples piezas en lote.
   */
  async createPiezas(piezas: any[]): Promise<void> {
    await Pieza.bulkCreate(piezas);
  }
}

/** Instancia singleton del repositorio */
const instance = new ManiquiRepository();
export default instance;
export { ManiquiRepository };
