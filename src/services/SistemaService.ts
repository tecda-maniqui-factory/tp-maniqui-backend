/**
 * @file SistemaService.ts
 * @description Servicio para utilidades transversales, catálogos y reportes.
 */

import { ISistemaRepository } from '../types/repositories.js';
import { ISistemaService } from '../types/services.js';
import { AppError } from '../utils/AppError.js';
import sequelize from '../db.js';
import { Modelo, ModeloReceta } from '../models/index.js';

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
   * Obtiene datos analíticos de rentabilidad.
   */
  async obtenerRentabilidad(): Promise<any[]> {
    return await this.sistemaRepo.findRentabilidad();
  }

  /**
   * Obtiene datos de piezas con stock crítico.
   */
  async obtenerStockCritico(): Promise<any[]> {
    return await this.sistemaRepo.findStockCritico();
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

  /**
   * Registra un nuevo modelo técnico y sus piezas requeridas (receta) de manera atómica.
   */
  async crearModelo(data: { nombre: string; partes: string[]; sexo_id: number; costo_unitario: number; precio_venta: number }): Promise<any> {
    const { nombre, partes, sexo_id, costo_unitario, precio_venta } = data;

    if (!costo_unitario || costo_unitario <= 0) throw new AppError('El costo unitario es obligatorio', 400);
    if (!precio_venta || precio_venta <= 0) throw new AppError('El precio de venta es obligatorio', 400);

    const t = await sequelize.transaction();
    try {
      const nuevoModelo = await Modelo.create({
        nombre,
        sexo_id,
        estilo_id: 1, // Por defecto
        cuerpo_id: 1, // Por defecto
        costo_unitario,
        precio_venta
      }, { transaction: t });

      const uniquePartCodes = [...new Set(partes)];
      if (uniquePartCodes.length > 0) {
        const [tipos]: any[] = await sequelize.query(
          `SELECT id, codigo FROM Cat_TiposParte WHERE codigo IN (?)`,
          { replacements: [uniquePartCodes], transaction: t }
        );

        const codeToIdMap = new Map<string, number>();
        for (const row of tipos) {
          codeToIdMap.set(row.codigo, row.id);
        }

        const recipeToCreate = [];
        for (const codigo of partes) {
          const typeId = codeToIdMap.get(codigo);
          if (typeId !== undefined) {
            recipeToCreate.push({
              modelo_id: nuevoModelo.id,
              tipo_parte_id: typeId
            });
          }
        }

        if (recipeToCreate.length > 0) {
          await ModeloReceta.bulkCreate(recipeToCreate, { transaction: t });
        }
      }

      await t.commit();
      return nuevoModelo;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}
