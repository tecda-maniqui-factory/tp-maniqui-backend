/**
 * @file produccionController.ts
 * @description Controladores para la gestión de la cadena de producción y ensamblaje.
 */

import { Request, Response } from 'express';
import { IProduccionService } from '../types/services.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

/**
 * Controlador encargado de la visualización y ensamblaje de productos.
 * 
 * Interactúa con {@link IProduccionService} para gestionar el stock de maniquíes y
 * piezas, y para procesar las órdenes de ensamblaje.
 * 
 * @example
 * ```ts
 * const produccionController = new ProduccionController(produccionService);
 * router.get('/maniquies', produccionController.getManiquies);
 * router.post('/maniquies/ensamblar', produccionController.ensamblarManiqui);
 * ```
 */
export class ProduccionController {
  constructor(private produccionService: IProduccionService) {}

  /**
   * Endpoint para listar todos los maniquíes en stock o producción aplicando filtros.
   * 
   * @route GET /maniquies
   * @param req - Objeto de petición HTTP de Express. Filtros en req.query.
   * @param res - Objeto de respuesta HTTP de Express.
   * @returns Promesa que envía la lista de maniquíes como JSON.
   */
  getManiquies = asyncHandler(async (req: Request, res: Response) => {
    const maniquies = await this.produccionService.listarManiquies(req.query);
    res.json(maniquies);
  });

  /**
   * Endpoint para buscar un maniquí específico por su número de serie.
   * 
   * @route GET /maniquies/:serie
   * @param req - Objeto de petición HTTP de Express. Espera 'serie' en req.params.
   * @param res - Objeto de respuesta HTTP de Express.
   * @returns Promesa que envía el detalle del maniquí.
   * @throws {AppError} Si el maniquí con la serie especificada no existe (código 404).
   */
  getManiquiBySerie = asyncHandler(async (req: Request, res: Response) => {
    const { serie } = req.params;
    const maniqui = await this.produccionService.obtenerManiqui(serie as string);
    res.json(maniqui);
  });

  /**
   * Endpoint para disparar el proceso de ensamblaje técnico de un maniquí.
   * 
   * Consume las partes requeridas del inventario y crea el maniquí ensamblado.
   * 
   * @route POST /maniquies/ensamblar
   * @param req - Objeto de petición HTTP de Express. Espera body con modelo_id y numero_serie.
   * @param res - Objeto de respuesta HTTP de Express.
   * @returns Promesa que envía el resultado del ensamblaje con estado HTTP 201.
   * @throws {AppError} Si no hay suficientes piezas en stock para completar el ensamblaje.
   */
  ensamblarManiqui = asyncHandler(async (req: Request, res: Response) => {
    const { modelo_id, numero_serie } = req.body;
    const resultado = await this.produccionService.ensamblarManiqui(modelo_id, numero_serie);
    res.status(201).json({
      message: 'Maniquí ensamblado con éxito',
      resultado
    });
  });

  /**
   * Endpoint para listar piezas en stock (no ensambladas).
   * 
   * @route GET /piezas/stock
   * @param req - Objeto de petición HTTP de Express.
   * @param res - Objeto de respuesta HTTP de Express.
   * @returns Promesa que envía el desglose de piezas en stock.
   */
  getPiezasStock = asyncHandler(async (req: Request, res: Response) => {
    const piezas = await this.produccionService.obtenerStockPiezas();
    res.json(piezas);
  });

  /**
   * Endpoint para ingresar nuevas piezas al almacén desde un proveedor.
   * 
   * @route POST /piezas/ingreso
   * @param req - Objeto de petición HTTP de Express. Espera datos de origen, tipo de parte, modelo, cantidad y costo.
   * @param res - Objeto de respuesta HTTP de Express.
   * @returns Promesa que envía una respuesta de éxito con estado HTTP 201.
   * @throws {AppError} Si los códigos de proveedor, tipo de parte o modelo no son válidos.
   */
  ingresarPiezas = asyncHandler(async (req: Request, res: Response) => {
    const { origen_codigo, tipo_parte_codigo, modelo_id, cantidad, costo } = req.body;
    await this.produccionService.ingresarPiezas(origen_codigo, tipo_parte_codigo, modelo_id, cantidad, costo);
    res.status(201).json({ success: true, message: `${cantidad} piezas ingresadas correctamente.` });
  });
}
