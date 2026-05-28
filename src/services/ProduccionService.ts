/**
 * @file ProduccionService.ts
 * @description Servicio para la gestión de la cadena de producción.
 */

import { IManiquiRepository } from '../types/repositories.js';
import { IProduccionService } from '../types/services.js';
import { IManiqui } from '../types/entities.js';
import { AppError } from '../utils/AppError.js';
import { Pieza } from '../models/index.js';

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

    // VALIDACIÓN DE PIEZAS ANTES DE ENSAMBLAR
    // Basado en Cat_TiposParte:
    // 1: Cabeza, 2: Torso, 3: Brazo Derecho, 4: Brazo Izquierdo, 5: Pierna Derecha, 6: Pierna Izquierda
    const piezasRequeridas = [
      { id: 1, nombre: 'Cabeza' },
      { id: 2, nombre: 'Torso' },
      { id: 3, nombre: 'Brazo Derecho' },
      { id: 4, nombre: 'Brazo Izquierdo' },
      { id: 5, nombre: 'Pierna Derecha' },
      { id: 6, nombre: 'Pierna Izquierda' }
    ];

    for (const piezaReq of piezasRequeridas) {
      // Usamos cast to any para evitar errores de tipado estrictos de Sequelize en el conteo simple
      const stock = await (Pieza as any).count({
        where: {
          modelo_id,
          tipo_parte_id: piezaReq.id,
          maniqui_id: null
        }
      });

      if (stock === 0) {
        throw new AppError(`Stock insuficiente: No hay ${piezaReq.nombre} disponible para este modelo.`, 400);
      }
    }

    try {
      return await this.maniquiRepo.assemble(modelo_id, numero_serie);
    } catch (error: any) {
      console.error('❌ Error ejecutando EnsamblarManiqui SP:', error.message);
      // Extraer mensaje del SIGNAL si existe
      const msg = error.message.includes('ERROR:') 
        ? error.message.split('ERROR:')[1].trim()
        : error.message;
      throw new AppError(`Error en el motor de ensamblaje: ${msg}`, 400);
    }
  }

  /**
   * Obtiene el listado de piezas individuales en stock (no ensambladas).
   */
  async obtenerStockPiezas(): Promise<any[]> {
    // Piezas que no pertenecen a ningún maniquí (maniqui_id es null)
    return await this.maniquiRepo.findAllPiezas({
      maniqui_id: null
    });
  }
}
