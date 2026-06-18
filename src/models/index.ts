/**
 * @file index.ts
 * @description Definición central de modelos de datos utilizando Sequelize ORM.
 * Configura las clases correspondientes a cada tabla de la base de datos de Tecda Maniquí y sus asociaciones.
 */

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db.js';
import { IUsuario, IModelo, IManiqui, IPieza, ICliente, IVenta, IDetalleVenta, IOrdenCompra, IModeloReceta } from '../types/entities.js';

// --- USUARIO ---

/**
 * Atributos opcionales al crear un nuevo Usuario en la base de datos.
 * El campo `id` y el estado `activo` son generados automáticamente.
 */
interface UsuarioCreationAttributes extends Optional<IUsuario, 'id' | 'activo'> {}

/**
 * Modelo Sequelize para representar la entidad Usuario.
 * Administra las credenciales, correos electrónicos, estado de actividad y roles (vendedor, gerente_prod, operario).
 */
export class Usuario extends Model<IUsuario, UsuarioCreationAttributes> implements IUsuario {
  declare id: number;
  declare username: string;
  declare password_hash: string;
  declare nombre_completo: string;
  declare email: string;
  declare rol: 'vendedor' | 'gerente_prod' | 'operario';
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
  rol: { type: DataTypes.ENUM('vendedor', 'gerente_prod', 'operario'), defaultValue: 'vendedor' },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true },
  last_login: { type: DataTypes.DATE },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { sequelize, modelName: 'Usuarios' });

// --- MODELO ---

/**
 * Atributos opcionales al crear un nuevo Modelo de diseño de maniquí.
 */
interface ModeloCreationAttributes extends Optional<IModelo, 'id' | 'activo'> {}

/**
 * Modelo Sequelize para representar el catálogo de Modelos de Maniquíes.
 * Almacena las especificaciones de diseño como género, estilo, tipo de cuerpo, costos de producción y precios de venta.
 */
export class Modelo extends Model<IModelo, ModeloCreationAttributes> implements IModelo {
  declare id: number;
  declare nombre: string;
  declare sexo_id?: number;
  declare estilo_id?: number;
  declare cuerpo_id?: number;
  declare costo_unitario: number;
  declare precio_venta: number;
  declare activo: boolean;
}
Modelo.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, unique: true, allowNull: false },
  sexo_id: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  estilo_id: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  cuerpo_id: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  costo_unitario: { type: DataTypes.DECIMAL(10, 2) },
  precio_venta: { type: DataTypes.DECIMAL(10, 2) },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { sequelize, modelName: 'Modelos' });

// --- MANIQUI ---

/**
 * Atributos opcionales al registrar un nuevo Maniquí físico.
 */
interface ManiquiCreationAttributes extends Optional<IManiqui, 'id' | 'status'> {}

/**
 * Modelo Sequelize para representar los Maniquíes físicos e individuales.
 * Hace seguimiento a cada unidad mediante su número de serie, lote, fecha de ensamblaje y estado de inventario.
 */
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

/**
 * Atributos opcionales al registrar una nueva Pieza en inventario.
 */
interface PiezaCreationAttributes extends Optional<IPieza, 'id'> {}

/**
 * Modelo Sequelize para representar las Piezas y componentes de los maniquíes.
 * Almacena información de componentes específicos (brazos, torsos, etc.), su procedencia, tono de pintura y costo.
 */
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

/**
 * Atributos opcionales al registrar un nuevo Cliente.
 */
interface ClienteCreationAttributes extends Optional<ICliente, 'id' | 'activo'> {}

/**
 * Modelo Sequelize para representar la base de datos de Clientes compradores.
 * Utiliza CUIT/CUIL como clave única de identificación comercial para facturación.
 */
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

/**
 * Atributos opcionales al registrar una Venta comercial.
 */
interface VentaCreationAttributes extends Optional<IVenta, 'id' | 'fecha_venta' | 'metodo_pago' | 'moneda'> {}

/**
 * Modelo Sequelize para representar la cabecera de las Ventas.
 * Registra información general de facturación incluyendo el método de pago, moneda, número de factura y código CAE de AFIP.
 */
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

/**
 * Atributos opcionales al registrar un renglón de Detalle de Venta.
 */
interface DetalleVentaCreationAttributes extends Optional<IDetalleVenta, 'id'> {}

/**
 * Modelo Sequelize para representar el Detalle de cada Venta.
 * Asocia de forma única cada maniquí vendido con una cabecera de venta y registra el precio final acordado.
 */
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

// --- ORDEN COMPRA ---

/**
 * Atributos opcionales al emitir una nueva Orden de Compra interna.
 */
interface OrdenCompraCreationAttributes extends Optional<IOrdenCompra, 'id' | 'fecha' | 'estado'> {}

/**
 * Modelo Sequelize para representar las Órdenes de Compra interna de materiales.
 * Utilizado por gerencia para solicitar piezas necesarias de un modelo particular que se encuentren en falta.
 */
export class OrdenesCompra extends Model<IOrdenCompra, OrdenCompraCreationAttributes> implements IOrdenCompra {
  declare id: number;
  declare modelo_nombre: string;
  declare tipo_parte: string;
  declare fecha: Date;
  declare estado: 'pendiente' | 'completada';
}
OrdenesCompra.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  modelo_nombre: { type: DataTypes.STRING, allowNull: false },
  tipo_parte: { type: DataTypes.STRING, allowNull: false },
  fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  estado: { type: DataTypes.ENUM('pendiente', 'completada'), defaultValue: 'pendiente' }
}, { sequelize, modelName: 'Ordenes_Compra' });

// --- MODELO RECETA ---

/**
 * Modelo Sequelize para la tabla intermedia de Recetas de Modelos.
 * Especifica los requerimientos obligatorios de piezas (tipos de parte) necesarios para producir un modelo de maniquí.
 */
export class ModeloReceta extends Model<IModeloReceta> implements IModeloReceta {
  declare modelo_id: number;
  declare tipo_parte_id: number;
}
ModeloReceta.init({
  modelo_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: { model: 'Modelos', key: 'id' },
    onDelete: 'CASCADE'
  },
  tipo_parte_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: { model: 'Cat_TiposParte', key: 'id' }
  }
}, { sequelize, modelName: 'Modelos_Recetas', tableName: 'Modelos_Recetas', timestamps: false });

// --- RELACIONES Y ASOCIACIONES ---

// Relación: Un Modelo tiene muchos Maniquíes individuales.
Modelo.hasMany(Maniqui, { foreignKey: 'modelo_id' });
Maniqui.belongsTo(Modelo, { foreignKey: 'modelo_id' });

// Relación: Un Maniquí físico se compone de múltiples Piezas de inventario.
Maniqui.hasMany(Pieza, { foreignKey: 'maniqui_id' });
Pieza.belongsTo(Maniqui, { foreignKey: 'maniqui_id' });

// Relación: Un Cliente puede realizar múltiples compras (Ventas).
Cliente.hasMany(Venta, { foreignKey: 'cliente_id' });
Venta.belongsTo(Cliente, { foreignKey: 'cliente_id' });

// Relación: Una Venta se compone de múltiples renglones de DetalleVenta.
Venta.hasMany(DetalleVenta, { foreignKey: 'venta_id' });
DetalleVenta.belongsTo(Venta, { foreignKey: 'venta_id' });

// Relación: Cada DetalleVenta apunta de manera exclusiva a un Maniquí vendido.
DetalleVenta.belongsTo(Maniqui, { foreignKey: 'maniqui_id', as: 'maniqui' });
Maniqui.hasMany(DetalleVenta, { foreignKey: 'maniqui_id', as: 'detalles' });

// Relación: Un Modelo posee una Receta con especificaciones de partes requeridas.
Modelo.hasMany(ModeloReceta, { foreignKey: 'modelo_id', as: 'receta' });
ModeloReceta.belongsTo(Modelo, { foreignKey: 'modelo_id' });

