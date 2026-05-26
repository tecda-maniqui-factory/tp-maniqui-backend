import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

export const Usuario = sequelize.define('Usuarios', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { 
    type: DataTypes.STRING, 
    unique: true, 
    allowNull: false,
    validate: { len: [4, 50] }
  },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  nombre_completo: { type: DataTypes.STRING },
  email: { 
    type: DataTypes.STRING, 
    unique: true,
    validate: { isEmail: true }
  },
  rol: { 
    type: DataTypes.ENUM('vendedor', 'gerente_prod'), 
    defaultValue: 'vendedor' 
  },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true },
  last_login: { type: DataTypes.DATE },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

export const Modelo = sequelize.define('Modelos', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, unique: true, allowNull: false },
  costo_unitario: { type: DataTypes.DECIMAL(10, 2), validate: { min: 0 } },
  precio_venta: { type: DataTypes.DECIMAL(10, 2), validate: { min: 0 } },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true } // Nueva columna
});

export const Maniqui = sequelize.define('Maniquies', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  numero_serie: { type: DataTypes.STRING, unique: true, allowNull: false },
  modelo_id: { type: DataTypes.INTEGER, allowNull: false },
  fecha_ensamblaje: { type: DataTypes.DATE },
  numero_lote: { type: DataTypes.STRING },
  status: { 
    type: DataTypes.ENUM('En Producción', 'Disponible', 'Vendido', 'Dañado'), 
    defaultValue: 'Disponible' 
  }
});

export const Pieza = sequelize.define('Piezas', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  serial_parte: { type: DataTypes.STRING, unique: true },
  tipo_parte_id: { type: DataTypes.INTEGER, allowNull: false },
  modelo_id: { type: DataTypes.INTEGER, allowNull: false },
  origen_id: { type: DataTypes.INTEGER, allowNull: false },
  tono_acabado_id: { type: DataTypes.INTEGER, allowNull: false },
  maniqui_id: { type: DataTypes.INTEGER },
  costo: { type: DataTypes.DECIMAL(10, 2), validate: { min: 0 } }
});

export const Cliente = sequelize.define('Clientes', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  cuit_cuil: { 
    type: DataTypes.STRING, 
    unique: true,
    validate: { is: /^[0-9]{2}-[0-9]{8}-[0-9]{1}$/ }
  },
  email: { type: DataTypes.STRING, validate: { isEmail: true } },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true } // Nueva columna
});

export const Venta = sequelize.define('Ventas', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cliente_id: { type: DataTypes.INTEGER, allowNull: false },
  fecha_venta: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  total: { type: DataTypes.DECIMAL(12, 2), validate: { min: 0 } },
  metodo_pago: { 
    type: DataTypes.ENUM('Efectivo', 'Transferencia', 'Tarjeta', 'Mercado Pago', 'Otros'), 
    defaultValue: 'Transferencia' 
  },
  // Campos extendidos de Facturación (Step 5)
  nro_factura: { type: DataTypes.STRING, unique: true },
  cae: { type: DataTypes.STRING },
  fecha_vencimiento_cae: { type: DataTypes.DATEONLY },
  moneda: { type: DataTypes.ENUM('ARS', 'USD'), defaultValue: 'ARS' }
});

export const DetalleVenta = sequelize.define('Detalle_Ventas', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  venta_id: { type: DataTypes.INTEGER, allowNull: false },
  maniqui_id: { type: DataTypes.INTEGER, unique: true, allowNull: false },
  precio_final: { type: DataTypes.DECIMAL(10, 2), validate: { min: 0 } }
});

// Relaciones
Modelo.hasMany(Maniqui, { foreignKey: 'modelo_id' });
Maniqui.belongsTo(Modelo, { foreignKey: 'modelo_id' });
Maniqui.hasMany(Pieza, { foreignKey: 'maniqui_id' });
Pieza.belongsTo(Maniqui, { foreignKey: 'maniqui_id' });
Cliente.hasMany(Venta, { foreignKey: 'cliente_id' });
Venta.belongsTo(Cliente, { foreignKey: 'cliente_id' });
Venta.hasMany(DetalleVenta, { foreignKey: 'venta_id' });
DetalleVenta.belongsTo(Venta, { foreignKey: 'venta_id' });
