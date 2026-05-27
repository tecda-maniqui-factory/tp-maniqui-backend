/**
 * @file index.ts
 * @description Definición central de modelos de datos utilizando Sequelize ORM.
 */

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db.js';
import { IUsuario, IModelo, IManiqui, IPieza, ICliente, IVenta, IDetalleVenta } from '../types/entities.js';

// --- USUARIO ---
interface UsuarioCreationAttributes extends Optional<IUsuario, 'id' | 'activo'> {}
export class Usuario extends Model<IUsuario, UsuarioCreationAttributes> implements IUsuario {
  declare id: number;
  declare username: string;
  declare password_hash: string;
  declare nombre_completo: string;
  declare email: string;
  declare rol: 'vendedor' | 'gerente_prod';
  declare activo: boolean;
  declare last_login?: Date;
  declare created_at?: Date;
}
Usuario.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  nombre_completo: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true },
  rol: { type: DataTypes.ENUM('vendedor', 'gerente_prod'), defaultValue: 'vendedor' },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true },
  last_login: { type: DataTypes.DATE },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { sequelize, modelName: 'Usuarios' });

// --- MODELO ---
interface ModeloCreationAttributes extends Optional<IModelo, 'id' | 'activo'> {}
export class Modelo extends Model<IModelo, ModeloCreationAttributes> implements IModelo {
  declare id: number;
  declare nombre: string;
  declare costo_unitario: number;
  declare precio_venta: number;
  declare activo: boolean;
}
Modelo.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, unique: true, allowNull: false },
  costo_unitario: { type: DataTypes.DECIMAL(10, 2) },
  precio_venta: { type: DataTypes.DECIMAL(10, 2) },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { sequelize, modelName: 'Modelos' });

// --- MANIQUI ---
interface ManiquiCreationAttributes extends Optional<IManiqui, 'id' | 'status'> {}
export class Maniqui extends Model<IManiqui, ManiquiCreationAttributes> implements IManiqui {
  declare id: number;
  declare numero_serie: string;
  declare modelo_id: number;
  declare fecha_ensamblaje?: Date;
  declare numero_lote?: string;
  declare status: 'En Producción' | 'Disponible' | 'Vendido' | 'Dañado';
}
Maniqui.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  numero_serie: { type: DataTypes.STRING, unique: true, allowNull: false },
  modelo_id: { type: DataTypes.INTEGER, allowNull: false },
  fecha_ensamblaje: { type: DataTypes.DATE },
  numero_lote: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('En Producción', 'Disponible', 'Vendido', 'Dañado'), defaultValue: 'Disponible' }
}, { sequelize, modelName: 'Maniquies' });

// --- PIEZA ---
interface PiezaCreationAttributes extends Optional<IPieza, 'id'> {}
export class Pieza extends Model<IPieza, PiezaCreationAttributes> implements IPieza {
  declare id: number;
  declare serial_parte: string;
  declare tipo_parte_id: number;
  declare modelo_id: number;
  declare origen_id: number;
  declare tono_acabado_id: number;
  declare maniqui_id?: number;
  declare costo: number;
}
Pieza.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  serial_parte: { type: DataTypes.STRING, unique: true },
  tipo_parte_id: { type: DataTypes.INTEGER, allowNull: false },
  modelo_id: { type: DataTypes.INTEGER, allowNull: false },
  origen_id: { type: DataTypes.INTEGER, allowNull: false },
  tono_acabado_id: { type: DataTypes.INTEGER, allowNull: false },
  maniqui_id: { type: DataTypes.INTEGER },
  costo: { type: DataTypes.DECIMAL(10, 2) }
}, { sequelize, modelName: 'Piezas' });

// --- CLIENTE ---
interface ClienteCreationAttributes extends Optional<ICliente, 'id' | 'activo'> {}
export class Cliente extends Model<ICliente, ClienteCreationAttributes> implements ICliente {
  declare id: number;
  declare nombre: string;
  declare cuit_cuil: string;
  declare email: string;
  declare activo: boolean;
}
Cliente.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  cuit_cuil: { type: DataTypes.STRING, unique: true },
  email: { type: DataTypes.STRING },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { sequelize, modelName: 'Clientes' });

// --- VENTA ---
interface VentaCreationAttributes extends Optional<IVenta, 'id' | 'fecha_venta' | 'metodo_pago' | 'moneda'> {}
export class Venta extends Model<IVenta, VentaCreationAttributes> implements IVenta {
  declare id: number;
  declare cliente_id: number;
  declare fecha_venta: Date;
  declare total: number;
  declare metodo_pago: 'Efectivo' | 'Transferencia' | 'Tarjeta' | 'Mercado Pago' | 'Otros';
  declare nro_factura?: string;
  declare cae?: string;
  declare fecha_vencimiento_cae?: Date;
  declare moneda: 'ARS' | 'USD';
}
Venta.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cliente_id: { type: DataTypes.INTEGER, allowNull: false },
  fecha_venta: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  total: { type: DataTypes.DECIMAL(12, 2) },
  metodo_pago: { type: DataTypes.ENUM('Efectivo', 'Transferencia', 'Tarjeta', 'Mercado Pago', 'Otros'), defaultValue: 'Transferencia' },
  nro_factura: { type: DataTypes.STRING, unique: true },
  cae: { type: DataTypes.STRING },
  fecha_vencimiento_cae: { type: DataTypes.DATEONLY },
  moneda: { type: DataTypes.ENUM('ARS', 'USD'), defaultValue: 'ARS' }
}, { sequelize, modelName: 'Ventas' });

// --- DETALLE VENTA ---
interface DetalleVentaCreationAttributes extends Optional<IDetalleVenta, 'id'> {}
export class DetalleVenta extends Model<IDetalleVenta, DetalleVentaCreationAttributes> implements IDetalleVenta {
  declare id: number;
  declare venta_id: number;
  declare maniqui_id: number;
  declare precio_final: number;
}
DetalleVenta.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  venta_id: { type: DataTypes.INTEGER, allowNull: false },
  maniqui_id: { type: DataTypes.INTEGER, unique: true, allowNull: false },
  precio_final: { type: DataTypes.DECIMAL(10, 2) }
}, { sequelize, modelName: 'Detalle_Ventas' });

// --- RELACIONES ---
Modelo.hasMany(Maniqui, { foreignKey: 'modelo_id' });
Maniqui.belongsTo(Modelo, { foreignKey: 'modelo_id' });
Maniqui.hasMany(Pieza, { foreignKey: 'maniqui_id' });
Pieza.belongsTo(Maniqui, { foreignKey: 'maniqui_id' });
Cliente.hasMany(Venta, { foreignKey: 'cliente_id' });
Venta.belongsTo(Cliente, { foreignKey: 'cliente_id' });
Venta.hasMany(DetalleVenta, { foreignKey: 'venta_id' });
DetalleVenta.belongsTo(Venta, { foreignKey: 'venta_id' });
