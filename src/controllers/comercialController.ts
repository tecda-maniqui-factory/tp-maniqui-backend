/**
 * @file comercialController.ts
 * @description Controladores para la gestión comercial (Ventas y Clientes).
 */

import { Request, Response } from 'express';
import { IComercialService } from '../types/services.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

/**
 * Controlador para la gestión de clientes y transacciones de ventas.
 */
export class ComercialController {
  constructor(private comercialService: IComercialService) {}

  /**
   * Endpoint para listar clientes.
   * @route GET /clientes
   */
  getClientes = asyncHandler(async (req: Request, res: Response) => {
    const clientes = await this.comercialService.listarClientes(req.query);
    res.json(clientes);
  });

  /**
   * Endpoint para crear un cliente.
   * @route POST /clientes
   */
  createCliente = asyncHandler(async (req: Request, res: Response) => {
    const nuevoCliente = await this.comercialService.registrarCliente(req.body);
    res.status(201).json(nuevoCliente);
  });

  /**
   * Endpoint para listar todas las ventas.
   * @route GET /ventas
   */
  getVentas = asyncHandler(async (req: Request, res: Response) => {
    const ventas = await this.comercialService.listarVentas(req.query);
    res.json(ventas);
  });

  /**
   * Endpoint para registrar una nueva venta.
   * @route POST /ventas
   */
  registrarVenta = asyncHandler(async (req: Request, res: Response) => {
    const nuevaVenta = await this.comercialService.registrarVenta(req.body);
    res.status(201).json(nuevaVenta);
  });

  /**
   * Endpoint para obtener el detalle de una venta por ID.
   * @route GET /ventas/:id
   */
  getVentaById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const venta = await this.comercialService.obtenerVenta(parseInt(id as string));
    res.json(venta);
  });
}
