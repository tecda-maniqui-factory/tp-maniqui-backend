/**
 * @file comercialController.ts
 * @description Controladores para la gestión comercial (Ventas y Clientes).
 */

import { Request, Response } from 'express';
import { IComercialService } from '../types/services.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

/**
 * Controlador para la gestión de clientes y transacciones de ventas.
 * 
 * Expone los endpoints de Express que delegan en {@link IComercialService}
 * para listados de clientes, ventas, creación de clientes y registro de ventas.
 * 
 * @example
 * ```ts
 * const comercialController = new ComercialController(comercialService);
 * router.get('/clientes', comercialController.getClientes);
 * router.post('/clientes', comercialController.createCliente);
 * ```
 */
export class ComercialController {
  constructor(private comercialService: IComercialService) {}

  /**
   * Endpoint para listar clientes aplicando filtros opcionales.
   * 
   * @route GET /clientes
   * @param req - Objeto de petición HTTP de Express. Espera filtros en req.query.
   * @param res - Objeto de respuesta HTTP de Express.
   * @returns Promesa que envía la lista de clientes como JSON.
   */
  getClientes = asyncHandler(async (req: Request, res: Response) => {
    const clientes = await this.comercialService.listarClientes(req.query);
    res.json(clientes);
  });

  /**
   * Endpoint para registrar un nuevo cliente en el sistema.
   * 
   * @route POST /clientes
   * @param req - Objeto de petición HTTP de Express. Espera los datos del cliente en req.body.
   * @param res - Objeto de respuesta HTTP de Express.
   * @returns Promesa que envía el cliente creado con estado HTTP 201.
   * @throws {AppError} Si falla la validación del cliente o si ya existe.
   */
  createCliente = asyncHandler(async (req: Request, res: Response) => {
    const nuevoCliente = await this.comercialService.registrarCliente(req.body);
    res.status(201).json(nuevoCliente);
  });

  /**
   * Endpoint para listar todas las ventas con filtros opcionales de búsqueda.
   * 
   * @route GET /ventas
   * @param req - Objeto de petición HTTP de Express. Espera filtros en req.query.
   * @param res - Objeto de respuesta HTTP de Express.
   * @returns Promesa que envía la lista de ventas como JSON.
   */
  getVentas = asyncHandler(async (req: Request, res: Response) => {
    const ventas = await this.comercialService.listarVentas(req.query);
    res.json(ventas);
  });

  /**
   * Endpoint para registrar una nueva venta de maniquíes.
   * 
   * @route POST /ventas
   * @param req - Objeto de petición HTTP de Express. Espera los detalles de la venta en req.body.
   * @param res - Objeto de respuesta HTTP de Express.
   * @returns Promesa que envía la venta registrada con estado HTTP 201.
   * @throws {AppError} Si el cliente no existe o los maniquíes seleccionados no están disponibles/ensamblados.
   */
  registrarVenta = asyncHandler(async (req: Request, res: Response) => {
    const nuevaVenta = await this.comercialService.registrarVenta(req.body);
    res.status(201).json(nuevaVenta);
  });

  /**
   * Endpoint para obtener el detalle completo de una venta específica mediante su ID.
   * 
   * @route GET /ventas/:id
   * @param req - Objeto de petición HTTP de Express con el ID en req.params.
   * @param res - Objeto de respuesta HTTP de Express.
   * @returns Promesa que envía el detalle de la venta solicitada.
   * @throws {AppError} Si la venta especificada no existe (código 404).
   */
  getVentaById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const venta = await this.comercialService.obtenerVenta(parseInt(id as string));
    res.json(venta);
  });
}
