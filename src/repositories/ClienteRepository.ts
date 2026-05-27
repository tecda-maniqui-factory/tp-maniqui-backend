/**
 * @file ClienteRepository.ts
 * @description Repositorio para la gestión de persistencia de Clientes.
 */

import { Cliente } from '../models/index.js';
import { Op } from 'sequelize';
import { IClienteRepository } from '../types/repositories.js';
import { ICliente } from '../types/entities.js';

/**
 * Patrón Repository para gestionar la persistencia de Clientes.
 */
class ClienteRepository implements IClienteRepository {
  /**
   * Obtiene todos los clientes aplicando filtros opcionales.
   */
  async findAll(filters: Record<string, unknown> = {}): Promise<ICliente[]> {
    const where: Record<string, unknown> = {};
    if (filters.nombre) where.nombre = { [Op.like]: `%${filters.nombre}%` };
    if (filters.cuit_cuil) where.cuit_cuil = filters.cuit_cuil;
    
    return await Cliente.findAll({ where });
  }

  /**
   * Crea un nuevo cliente en la base de datos.
   */
  async create(data: Partial<ICliente>): Promise<ICliente> {
    return await Cliente.create(data as any);
  }

  /**
   * Busca un cliente específico por su ID primario.
   */
  async findById(id: number): Promise<ICliente | null> {
    return await Cliente.findByPk(id);
  }
}

/**
 * Instancia única del repositorio de clientes (Singleton).
 */
const instance = new ClienteRepository();
export default instance;
export { ClienteRepository };
