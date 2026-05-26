import { Cliente } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * Patrón Repository para Clientes.
 */
class ClienteRepository {
  async findAll(filters = {}) {
    const where = {};
    if (filters.nombre) where.nombre = { [Op.like]: `%${filters.nombre}%` };
    if (filters.cuit_cuil) where.cuit_cuil = filters.cuit_cuil;
    
    return await Cliente.findAll({ where });
  }

  async create(data) {
    return await Cliente.create(data);
  }

  async findById(id) {
    return await Cliente.findByPk(id);
  }
}

export default new ClienteRepository();
