/**
 * @file ComercialService.ts
 * @description Servicio para la lógica de negocio comercial (Clientes y Ventas).
 */

import { IClienteRepository, IVentaRepository, IManiquiRepository } from '../types/repositories.js';
import { IComercialService } from '../types/services.js';
import { ICliente, IVenta } from '../types/entities.js';
import { AppError } from '../utils/AppError.js';

/**
 * Servicio encargado de gestionar clientes y transacciones de venta.
 */
export class ComercialService implements IComercialService {
  constructor(
    private clienteRepo: IClienteRepository,
    private ventaRepo: IVentaRepository,
    private maniquiRepo: IManiquiRepository
  ) {}

  /**
   * Obtiene la lista de clientes filtrada.
   */
  async listarClientes(filters?: Record<string, unknown>): Promise<ICliente[]> {
    return await this.clienteRepo.findAll(filters);
  }

  /**
   * Registra un nuevo cliente en el sistema.
   */
  async registrarCliente(data: Partial<ICliente>): Promise<ICliente> {
    return await this.clienteRepo.create(data);
  }

  /**
   * Lista las ventas realizadas.
   */
  async listarVentas(filters?: Record<string, unknown>): Promise<IVenta[]> {
    return await this.ventaRepo.findAll(filters);
  }

  /**
   * Procesa y registra una nueva venta calculando el total automáticamente.
   */
  async registrarVenta(data: { cliente_id: number; metodo_pago?: string; maniquies: { maniqui_id: number; precio_final: number }[]; moneda?: string }): Promise<IVenta> {
    const { cliente_id, metodo_pago, maniquies, moneda } = data;

    if (!maniquies || maniquies.length === 0) {
      throw new AppError('Debe incluir al menos un maniquí en la venta', 400);
    }

    // 1. Validar que el cliente existe
    const cliente = await this.clienteRepo.findById(cliente_id);
    if (!cliente) {
      throw new AppError(`El cliente con ID ${cliente_id} no existe`, 404);
    }

    // 2. Validar disponibilidad de los maniquíes
    for (const item of maniquies) {
      const maniquiesEncontrados = await this.maniquiRepo.findAll({ id: item.maniqui_id });
      const m = maniquiesEncontrados[0];

      if (!m) {
        throw new AppError(`El maniquí con ID ${item.maniqui_id} no existe`, 404);
      }

      if (m.status === 'Vendido') {
        throw new AppError(`El maniquí con ID ${item.maniqui_id} ya ha sido vendido`, 400);
      }

      if (m.status !== 'Disponible') {
        throw new AppError(`El maniquí con ID ${item.maniqui_id} no está disponible para la venta (Estado: ${m.status})`, 400);
      }
    }

    const total = maniquies.reduce((sum: number, item) => sum + Number(item.precio_final), 0);

    const ventaData: Partial<IVenta> = {
      cliente_id,
      metodo_pago: (metodo_pago as any) || 'Transferencia',
      total,
      moneda: (moneda as any) || 'ARS'
    };

    return await this.ventaRepo.create(ventaData, maniquies);
  }

  /**
   * Obtiene la información detallada de una venta por su ID.
   */
  async obtenerVenta(id: number): Promise<IVenta> {
    const venta = await this.ventaRepo.findById(id);
    if (!venta) {
      throw new AppError('Venta no encontrada', 404);
    }
    return venta;
  }
}
