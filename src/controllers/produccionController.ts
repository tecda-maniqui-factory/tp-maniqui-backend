/**
 * @file produccionController.ts
 * @description Controladores para la gestión de la cadena de producción y ensamblaje.
 */

import { Request, Response } from 'express';
import { IProduccionService } from '../types/services.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

/**
 * Controlador encargado de la visualización y ensamblaje de productos.
 */
export class ProduccionController {
  constructor(private produccionService: IProduccionService) {}

  /**
   * Endpoint para listar todos los maniquíes en stock o producción.
   * @route GET /maniquies
   */
  getManiquies = asyncHandler(async (req: Request, res: Response) => {
    const maniquies = await this.produccionService.listarManiquies(req.query);
    res.json(maniquies);
  });

  /**
   * Endpoint para buscar un maniquí específico por serie.
   * @route GET /maniquies/:serie
   */
  getManiquiBySerie = asyncHandler(async (req: Request, res: Response) => {
    const { serie } = req.params;
    const maniqui = await this.produccionService.obtenerManiqui(serie as string);
    res.json(maniqui);
  });

  /**
   * Endpoint para disparar el proceso de ensamblaje técnico.
   * @route POST /maniquies/ensamblar
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
   * @route GET /piezas/stock
   */
  getPiezasStock = asyncHandler(async (req: Request, res: Response) => {
    const piezas = await this.produccionService.obtenerStockPiezas();
    res.json(piezas);
  });

  /**
   * Endpoint para ingresar nuevas piezas al almacén.
   * @route POST /piezas/ingreso
   */
  ingresarPiezas = asyncHandler(async (req: Request, res: Response) => {
    const { origen_codigo, tipo_parte_codigo, modelo_id, cantidad, costo } = req.body;
    await this.produccionService.ingresarPiezas(origen_codigo, tipo_parte_codigo, modelo_id, cantidad, costo);
    res.status(201).json({ success: true, message: `${cantidad} piezas ingresadas correctamente.` });
  });
}
