import { Maniqui, Modelo } from '../models/index.js';
import sequelize from '../db.js';

/**
 * Patrón Repository para Maniquíes.
 * Centraliza el acceso a datos y desacopla la lógica de persistencia de los controladores.
 */
class ManiquiRepository {
  /**
   * Obtiene todos los maniquíes con filtros opcionales.
   * @param {Object} filters - Filtros como modelo_id o status.
   */
  async findAll(filters = {}) {
    return await Maniqui.findAll({
      where: filters,
      include: [{ model: Modelo, attributes: ['nombre'] }]
    });
  }

  /**
   * Busca un maniquí por su número de serie.
   * @param {string} numero_serie 
   */
  async findBySerie(numero_serie) {
    return await Maniqui.findOne({ where: { numero_serie } });
  }

  /**
   * Ejecuta el procedimiento almacenado para ensamblar un maniquí.
   * Este es un ejemplo de cómo el repositorio maneja la complejidad de la DB.
   * @param {number} modelo_id 
   * @param {string} numero_serie 
   */
  async assemble(modelo_id, numero_serie) {
    const [result] = await sequelize.query(
      'CALL EnsamblarManiqui(?, ?)',
      { replacements: [modelo_id, numero_serie] }
    );
    return result;
  }

  /**
   * Crea un registro de maniquí (si no se usa el SP).
   * @param {Object} data 
   */
  async create(data) {
    return await Maniqui.create(data);
  }
}

// Exportamos una instancia única (Singleton del Repositorio)
export default new ManiquiRepository();
