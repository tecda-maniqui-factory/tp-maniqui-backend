/**
 * Definiciones de entidades del dominio.
 */

export interface IUsuario {
  id?: number | undefined;
  username: string;
  password_hash: string;
  nombre_completo?: string | undefined;
  email?: string | undefined;
  rol: 'vendedor' | 'gerente_prod';
  activo: boolean;
  last_login?: Date | undefined;
  created_at?: Date | undefined;
}

export interface IModelo {
  id?: number | undefined;
  nombre: string;
  costo_unitario: number;
  precio_venta: number;
  activo: boolean;
}

export type ManiquiStatus = 'En Producción' | 'Disponible' | 'Vendido' | 'Dañado';

export interface IManiqui {
  id?: number | undefined;
  numero_serie: string;
  modelo_id: number;
  fecha_ensamblaje?: Date | undefined;
  numero_lote?: string | undefined;
  status: ManiquiStatus;
}

export interface IPieza {
  id?: number | undefined;
  serial_parte?: string | undefined;
  tipo_parte_id: number;
  modelo_id: number;
  origen_id: number;
  tono_acabado_id: number;
  maniqui_id?: number | undefined;
  costo: number;
}

export interface ICliente {
  id?: number | undefined;
  nombre: string;
  cuit_cuil: string;
  email?: string | undefined;
  activo: boolean;
}

export type MetodoPago = 'Efectivo' | 'Transferencia' | 'Tarjeta' | 'Mercado Pago' | 'Otros';
export type Moneda = 'ARS' | 'USD';

export interface IVenta {
  id?: number | undefined;
  cliente_id: number;
  fecha_venta?: Date | undefined;
  total: number;
  metodo_pago: MetodoPago;
  nro_factura?: string | undefined;
  cae?: string | undefined;
  fecha_vencimiento_cae?: string | Date | undefined;
  moneda: Moneda;
}

export interface IDetalleVenta {
  id?: number | undefined;
  venta_id: number;
  maniqui_id: number;
  precio_final: number;
}
