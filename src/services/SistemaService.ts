/**
 * @file SistemaService.ts
 * @description Servicio para utilidades transversales, catálogos y reportes.
 */

import { ISistemaRepository } from '../types/repositories.js';
import { ISistemaService } from '../types/services.js';
import { AppError } from '../utils/AppError.js';

/**
 * Servicio encargado de proveer catálogos técnicos y métricas de salud del sistema.
 */
export class SistemaService implements ISistemaService {
  constructor(private sistemaRepo: ISistemaRepository) {}

  /**
   * Obtiene todos los modelos técnicos disponibles.
   */
  async listarModelos(): Promise<any[]> {
    return await this.sistemaRepo.findAllModelos();
  }

  /**
   * Genera un resumen estadístico para el dashboard.
   */
  async obtenerResumenProduccion(): Promise<any[]> {
    return await this.sistemaRepo.getProduccionResumen();
  }

  /**
   * Calcula el precio final aplicando un porcentaje de descuento mediante base de datos.
   */
  async calcularDescuento(modeloId: number, porcentaje: number): Promise<unknown> {
    const resultado = await this.sistemaRepo.calcularDescuentoUDF(modeloId, porcentaje);
    if (!resultado) {
      throw new AppError('Modelo no encontrado', 404);
    }
    return resultado;
  }

  /**
   * Lista los proveedores de piezas registrados.
   */
  async listarProveedores(): Promise<any[]> {
    return await this.sistemaRepo.findProveedores();
  }

  /**
   * Registra un nuevo proveedor en la base de datos.
   */
  async crearProveedor(nombre: string, codigo: string): Promise<void> {
    await this.sistemaRepo.createProveedor(nombre, codigo);
  }
}
