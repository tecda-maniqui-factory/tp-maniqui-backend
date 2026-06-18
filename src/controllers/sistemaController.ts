/**
 * @file sistemaController.ts
 * @description Controladores para utilidades de catálogo, reportes y salud del sistema.
 */

import { Request, Response } from 'express';
import { ISistemaService } from '../types/services.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

/**
 * Controlador encargado de proveer información técnica y operativa del sistema.
 * 
 * Expone endpoints de Express que delegan en {@link ISistemaService}
 * para el catálogo de modelos, cálculo de reportes financieros y de stock crítico,
 * descuentos y gestión de proveedores.
 * 
 * @example
 * ```ts
 * const sistemaController = new SistemaController(sistemaService);
 * router.get('/sistema/modelos', sistemaController.getModelos);
 * router.get('/sistema/reportes/produccion', sistemaController.getProduccionResumen);
 * ```
 */
export class SistemaController {
  constructor(private sistemaService: ISistemaService) {}

  /**
   * Endpoint para obtener el catálogo de modelos técnicos.
   * 
   * @route GET /sistema/modelos
   * @param req - Objeto de petición HTTP de Express.
   * @param res - Objeto de respuesta HTTP de Express.
   * @returns Promesa que envía la lista de modelos.
   */
  getModelos = asyncHandler(async (req: Request, res: Response) => {
    const modelos = await this.sistemaService.listarModelos();
    res.json(modelos);
  });

  /**
   * Endpoint para registrar un nuevo modelo técnico.
   * 
   * @route POST /sistema/modelos
   * @param req - Objeto de petición HTTP de Express. Espera body con nombre, partes, sexo_id, costo_unitario y precio_venta.
   * @param res - Objeto de respuesta HTTP de Express.
   * @returns Promesa que envía el modelo creado con estado HTTP 201.
   * @throws {AppError} Si falla la validación del modelo.
   */
  createModelo = asyncHandler(async (req: Request, res: Response) => {
    const { nombre, partes, sexo_id, costo_unitario, precio_venta } = req.body;
    const nuevo = await this.sistemaService.crearModelo({ nombre, partes, sexo_id, costo_unitario, precio_venta });
    res.status(201).json(nuevo);
  });

  /**
   * Endpoint para obtener métricas y resumenes de producción global.
   * 
   * @route GET /sistema/reportes/produccion
   * @param req - Objeto de petición HTTP de Express.
   * @param res - Objeto de respuesta HTTP de Express.
   * @returns Promesa que envía el reporte de producción.
   */
  getProduccionResumen = asyncHandler(async (req: Request, res: Response) => {
    const resumen = await this.sistemaService.obtenerResumenProduccion();
    res.json(resumen);
  });

  /**
   * Endpoint para obtener el reporte financiero de rentabilidad.
   * 
   * @route GET /reportes/rentabilidad
   * @param req - Objeto de petición HTTP de Express.
   * @param res - Objeto de respuesta HTTP de Express.
   * @returns Promesa que envía el reporte de rentabilidad.
   */
  getRentabilidad = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.sistemaService.obtenerRentabilidad();
    res.json(data);
  });

  /**
   * Endpoint para obtener el reporte de stock crítico.
   * 
   * Identifica partes y maniquíes con niveles de stock por debajo del límite mínimo.
   * 
   * @route GET /reportes/stock-critico
   * @param req - Objeto de petición HTTP de Express.
   * @param res - Objeto de respuesta HTTP de Express.
   * @returns Promesa que envía el reporte de stock crítico.
   */
  getStockCritico = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.sistemaService.obtenerStockCritico();
    res.json(data);
  });

  /**
   * Endpoint para el cálculo dinámico de descuentos mediante UDF (User Defined Functions) de la base de datos.
   * 
   * @route GET /sistema/modelos/:id/descuento
   * @param req - Objeto de petición HTTP de Express con el ID en req.params y porcentaje en req.query.
   * @param res - Objeto de respuesta HTTP de Express.
   * @returns Promesa que envía el resultado del descuento calculado.
   * @throws {Error} Si el parámetro porcentaje es omitido (código 400).
   */
  calcularDescuento = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { porcentaje } = req.query;

    if (!porcentaje) {
      const error: any = new Error('El porcentaje es requerido');
      error.statusCode = 400;
      throw error;
    }

    const resultado = await this.sistemaService.calcularDescuento(
      parseInt(id as string), 
      parseFloat(porcentaje as string)
    );

    res.json(resultado);
  });

  /**
   * Endpoint para listar proveedores externos.
   * 
   * @route GET /sistema/proveedores
   * @param req - Objeto de petición HTTP de Express.
   * @param res - Objeto de respuesta HTTP de Express.
   * @returns Promesa que envía la lista de proveedores.
   */
  getProveedores = asyncHandler(async (req: Request, res: Response) => {
    const proveedores = await this.sistemaService.listarProveedores();
    res.json(proveedores);
  });

  /**
   * Endpoint para dar de alta un nuevo proveedor en el sistema.
   * 
   * @route POST /sistema/proveedores
   * @param req - Objeto de petición HTTP de Express. Espera body con nombre y código único de proveedor.
   * @param res - Objeto de respuesta HTTP de Express.
   * @returns Promesa que envía un mensaje de éxito con estado HTTP 201.
   * @throws {AppError} Si el código de proveedor ya existe.
   */
  createProveedor = asyncHandler(async (req: Request, res: Response) => {
    const { nombre, codigo } = req.body;
    await this.sistemaService.crearProveedor(nombre, codigo);
    res.status(201).json({ message: 'Proveedor creado con éxito' });
  });
}
