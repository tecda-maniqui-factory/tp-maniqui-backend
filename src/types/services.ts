import { ICliente, IUsuario, IManiqui, IVenta } from './entities.js';

export interface IAuthService {
  register(userData: Partial<IUsuario> & { password?: string }): Promise<Partial<IUsuario>>;
  login(username: string, password: string): Promise<{ token: string; usuario: Partial<IUsuario> & { nombre?: string | undefined } }>;
}

export interface IComercialService {
  listarClientes(filters?: Record<string, unknown>): Promise<ICliente[]>;
  registrarCliente(data: Partial<ICliente>): Promise<ICliente>;
  listarVentas(filters?: Record<string, unknown>): Promise<IVenta[]>;
  registrarVenta(data: { cliente_id: number; metodo_pago?: string; maniquies: any[]; moneda?: string }): Promise<IVenta>;
  obtenerVenta(id: number): Promise<IVenta>;
}

export interface IProduccionService {
  listarManiquies(filters?: Record<string, unknown>): Promise<IManiqui[]>;
  obtenerManiqui(serie: string): Promise<IManiqui>;
  ensamblarManiqui(modelo_id: number, numero_serie: string): Promise<unknown>;
  obtenerStockPiezas(): Promise<any[]>;
  ingresarPiezas(origen_codigo: string, tipo_parte_codigo: string, modelo_id: number, cantidad: number): Promise<void>;
}

export interface ISistemaService {
  listarModelos(): Promise<any[]>;
  crearModelo(data: { nombre: string; partes: string[]; sexo_id: number }): Promise<any>;
  obtenerResumenProduccion(): Promise<any[]>;
  obtenerRentabilidad(): Promise<any[]>;
  obtenerStockCritico(): Promise<any[]>;
  calcularDescuento(modeloId: number, porcentaje: number): Promise<unknown>;
  listarProveedores(): Promise<any[]>;
  crearProveedor(nombre: string, codigo: string): Promise<void>;
}
