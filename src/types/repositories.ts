import { ICliente, IUsuario, IManiqui, IModelo, IVenta } from './entities.js';

export interface IClienteRepository {
  findAll(filters?: Record<string, unknown>): Promise<ICliente[]>;
  create(data: Partial<ICliente>): Promise<ICliente>;
  findById(id: number): Promise<ICliente | null>;
}

export interface IUsuarioRepository {
  findByUsername(username: string): Promise<IUsuario | null>;
  findByUsernameAll(username: string): Promise<IUsuario | null>;
  create(userData: Partial<IUsuario>): Promise<IUsuario>;
  updateLastLogin(id: number): Promise<number[]>;
}

export interface IManiquiRepository {
  findAll(filters?: Record<string, unknown>): Promise<IManiqui[]>;
  findBySerie(numero_serie: string): Promise<IManiqui | null>;
  assemble(modelo_id: number, numero_serie: string): Promise<unknown>;
  create(data: Partial<IManiqui>): Promise<IManiqui>;
  findAllPiezas(filters?: Record<string, unknown>): Promise<any[]>;
}

export interface ISistemaRepository {
  findAllModelos(): Promise<IModelo[]>;
  rawQuery(query: string, replacements?: unknown[]): Promise<unknown[]>;
  getProduccionResumen(): Promise<unknown[]>;
  calcularDescuentoUDF(modeloId: number, porcentaje: number): Promise<unknown | null>;
  findProveedores(): Promise<unknown[]>;
  createProveedor(nombre: string, codigo: string): Promise<void>;
}

export interface IVentaRepository {
  findAll(filters?: Record<string, unknown>): Promise<IVenta[]>;
  create(ventaData: Partial<IVenta>, detalles: { maniqui_id: number; precio_final: number }[]): Promise<IVenta>;
  findById(id: number): Promise<IVenta | null>;
}
