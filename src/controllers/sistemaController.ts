/**
 * @file sistemaController.ts
 * @description Controladores para utilidades de catálogo, reportes y salud del sistema.
 */

import { Request, Response } from 'express';
import { ISistemaService } from '../types/services.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

/**
 * Controlador encargado de proveer información técnica y operativa del sistema.
 */
export class SistemaController {
  constructor(private sistemaService: ISistemaService) {}

  /**
   * Endpoint para obtener el catálogo de modelos técnicos.
   * @route GET /sistema/modelos
   */
  getModelos = asyncHandler(async (req: Request, res: Response) => {
    const modelos = await this.sistemaService.listarModelos();
    res.json(modelos);
  });

  /**
   * Endpoint para registrar un nuevo modelo técnico.
   * @route POST /sistema/modelos
   */
  createModelo = asyncHandler(async (req: Request, res: Response) => {
    const { nombre, partes, sexo_id } = req.body;
    const nuevo = await this.sistemaService.crearModelo({ nombre, partes, sexo_id });
    res.status(201).json(nuevo);
  });

  /**
   * Endpoint para obtener métricas y resumenes de producción.
   * @route GET /sistema/reportes/produccion
   */
  getProduccionResumen = asyncHandler(async (req: Request, res: Response) => {
    const resumen = await this.sistemaService.obtenerResumenProduccion();
    res.json(resumen);
  });

  /**
   * Endpoint para obtener el reporte de rentabilidad.
   * @route GET /reportes/rentabilidad
   */
  getRentabilidad = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.sistemaService.obtenerRentabilidad();
    res.json(data);
  });

  /**
   * Endpoint para obtener el reporte de stock crítico.
   * @route GET /reportes/stock-critico
   */
  getStockCritico = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.sistemaService.obtenerStockCritico();
    res.json(data);
  });

  /**
   * Endpoint para el cálculo dinámico de descuentos mediante UDF de la base de datos.
   * @route GET /sistema/modelos/:id/descuento
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
   * @route GET /sistema/proveedores
   */
  getProveedores = asyncHandler(async (req: Request, res: Response) => {
    const proveedores = await this.sistemaService.listarProveedores();
    res.json(proveedores);
  });

  /**
   * Endpoint para dar de alta un nuevo proveedor.
   * @route POST /sistema/proveedores
   */
  createProveedor = asyncHandler(async (req: Request, res: Response) => {
    const { nombre, codigo } = req.body;
    await this.sistemaService.crearProveedor(nombre, codigo);
    res.status(201).json({ message: 'Proveedor creado con éxito' });
  });
}
