/**
 * @file ProduccionService.ts
 * @description Servicio para la gestión de la cadena de producción.
 */

import { IManiquiRepository } from '../types/repositories.js';
import { IProduccionService } from '../types/services.js';
import { IManiqui } from '../types/entities.js';
import { AppError } from '../utils/AppError.js';
import { Pieza } from '../models/index.js';
import sequelize from '../db.js';
import { sseManager } from './sse/SSEManager.js';

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
    const [recetas]: any[] = await sequelize.query(`
      SELECT mr.tipo_parte_id as id, tp.nombre
      FROM Modelos_Recetas mr
      JOIN Cat_TiposParte tp ON mr.tipo_parte_id = tp.id
      WHERE mr.modelo_id = ?
    `, { replacements: [modelo_id] });

    const piezasRequeridas = recetas.length > 0 ? recetas : [
      { id: 1, nombre: 'Cabeza' },
      { id: 2, nombre: 'Torso' },
      { id: 3, nombre: 'Brazo Derecho' },
      { id: 4, nombre: 'Brazo Izquierdo' },
      { id: 5, nombre: 'Pierna Derecha' },
      { id: 6, nombre: 'Pierna Izquierda' }
    ];

    const requiredPartIds = piezasRequeridas.map((p: any) => p.id);
    const counts = await Pieza.findAll({
      attributes: [
        'tipo_parte_id',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        modelo_id,
        tipo_parte_id: requiredPartIds,
        maniqui_id: null
      } as any,
      group: ['tipo_parte_id'],
      raw: true
    }) as unknown as Array<{ tipo_parte_id: number; count: string | number }>;

    const stockMap = new Map<number, number>();
    for (const row of counts) {
      stockMap.set(Number(row.tipo_parte_id), Number(row.count));
    }

    for (const piezaReq of piezasRequeridas) {
      const stock = stockMap.get(piezaReq.id) || 0;
      if (stock === 0) {
        throw new AppError(`Stock insuficiente: No hay ${piezaReq.nombre} disponible para este modelo.`, 400);
      }
    }

    try {
      const result = await this.maniquiRepo.assemble(modelo_id, numero_serie);
      // Notificar a todos los clientes que el stock ha cambiado debido a un ensamblaje
      sseManager.notificarStockActualizado();
      return result;
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

  /**
   * Ingresa nuevas piezas al stock desde un proveedor.
   */
  async ingresarPiezas(origen_codigo: string, tipo_parte_codigo: string, modelo_id: number, cantidad: number): Promise<void> {
    if (cantidad <= 0) throw new AppError('La cantidad debe ser mayor a 0', 400);

    // Obtener IDs
    const [origenes]: any[] = await sequelize.query(`SELECT id FROM Origenes_Piezas WHERE codigo = ?`, { replacements: [origen_codigo] });
    if (!origenes.length) throw new AppError('Proveedor/Origen no encontrado', 404);
    const origen_id = origenes[0].id;

    const [tipos]: any[] = await sequelize.query(`SELECT id, nombre FROM Cat_TiposParte WHERE codigo = ?`, { replacements: [tipo_parte_codigo] });
    if (!tipos.length) throw new AppError('Tipo de pieza no encontrado', 404);
    const tipo_parte_id = tipos[0].id;
    const tipo_parte_nombre = tipos[0].nombre;

    const [modelos]: any[] = await sequelize.query(`SELECT id, nombre FROM Modelos WHERE id = ?`, { replacements: [modelo_id] });
    if (!modelos.length) throw new AppError('Modelo no encontrado', 404);
    const modelo_nombre = modelos[0].nombre;

    // Generar piezas con seriales únicos
    const timestamp = Date.now().toString().slice(-6);
    const piezas = [];
    for (let i = 0; i < cantidad; i++) {
      piezas.push({
        serial_parte: `PZ-${tipo_parte_codigo}-${modelo_id}-${timestamp}-${i+1}`,
        tipo_parte_id,
        modelo_id,
        origen_id,
        tono_acabado_id: 1, // Por defecto
        costo: 50.00 // Costo mock
      });
    }

    await this.maniquiRepo.createPiezas(piezas);

    // Notificar a SSE que se ha completado la orden para esta parte y modelo
    await sseManager.completarOrden(tipo_parte_nombre, modelo_nombre);
  }
}
