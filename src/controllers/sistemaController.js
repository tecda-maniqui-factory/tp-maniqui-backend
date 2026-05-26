import { Modelo, Maniqui } from '../models/index.js';
import sequelize from '../db.js';

// --- CATALOGOS ---

export const listarModelos = async (req, res) => {
  try {
    const modelos = await Modelo.findAll();
    res.json(modelos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listarSexos = async (req, res) => {
  try {
    const [rows] = await sequelize.query('SELECT * FROM Cat_Sexos');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listarTiposParte = async (req, res) => {
  try {
    const [rows] = await sequelize.query('SELECT * FROM Cat_TiposParte');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listarTonosAcabado = async (req, res) => {
  try {
    const [rows] = await sequelize.query('SELECT * FROM Cat_TonosAcabado');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listarOrigenes = async (req, res) => {
  try {
    const [rows] = await sequelize.query('SELECT * FROM Origenes_Piezas');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- ANALITICA (Vistas SQL) ---

export const obtenerRentabilidad = async (req, res) => {
  try {
    const [rows] = await sequelize.query('SELECT * FROM Vista_Rentabilidad');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerStockCritico = async (req, res) => {
  try {
    const [rows] = await sequelize.query('SELECT * FROM Vista_Stock_Critico');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const calcularDescuento = async (req, res) => {
  const { id } = req.params;
  const { porcentaje } = req.query;
  try {
    // Uso de la UDF CalcularDescuento de la DB
    const [result] = await sequelize.query(
      'SELECT precio_venta, CalcularDescuento(precio_venta, ?) as precio_final FROM Modelos WHERE id = ?',
      { replacements: [porcentaje, id] }
    );
    
    if (result.length === 0) return res.status(404).json({ error: 'Modelo no encontrado' });
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const reporteProduccion = async (req, res) => {
  try {
    const resumen = await Maniqui.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad']
      ],
      group: ['status']
    });
    res.json({
      timestamp: new Date(),
      resumen
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- PROVEEDORES ---

export const listarProveedores = async (req, res) => {
  try {
    const [rows] = await sequelize.query("SELECT * FROM Origenes_Piezas WHERE tipo = 'Proveedor Externo'");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registrarProveedor = async (req, res) => {
  const { nombre, codigo } = req.body;
  try {
    await sequelize.query(
      "INSERT INTO Origenes_Piezas (nombre, codigo, tipo) VALUES (?, ?, 'Proveedor Externo')",
      { replacements: [nombre, codigo] }
    );
    res.status(201).json({ message: 'Proveedor registrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
