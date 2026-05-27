/**
 * @file ProduccionService.ts
 * @description Servicio para la gestión de la cadena de producción.
 */

import { IManiquiRepository } from '../types/repositories.js';
import { IProduccionService } from '../types/services.js';
import { IManiqui } from '../types/entities.js';
import { AppError } from '../utils/AppError.js';

/**
 * Servicio encargado de la lógica de ensamblaje y control de stock de maniquíes.
 */
export class ProduccionService implements IProduccionService {
  constructor(private maniquiRepo: IManiquiRepository) {}

  /**
   * Obtiene la lista de maniquíes existentes.
   */
  async listarManiquies(filters?: Record<string, unknown>): Promise<IManiqui[]> {
    return await this.maniquiRepo.findAll(filters);
  }

  /**
   * Busca un maniquí por su código de serie.
   */
  async obtenerManiqui(serie: string): Promise<IManiqui> {
    const maniqui = await this.maniquiRepo.findBySerie(serie);
    if (!maniqui) {
      throw new AppError('Maniquí no encontrado', 404);
    }
    return maniqui;
  }

  /**
   * Inicia el proceso de ensamblaje de un nuevo producto.
   */
  async ensamblarManiqui(modelo_id: number, numero_serie: string): Promise<unknown> {
    const existe = await this.maniquiRepo.findBySerie(numero_serie);
    if (existe) {
      throw new AppError('El número de serie ya existe', 400);
    }

    return await this.maniquiRepo.assemble(modelo_id, numero_serie);
  }
}
