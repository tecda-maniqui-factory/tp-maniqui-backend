import SistemaRepository from '../repositories/SistemaRepository.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

/**
 * Controladores de Sistema refactorizados.
 */

// --- CATALOGOS ---

export const listarModelos = asyncHandler(async (req, res) => {
  const modelos = await SistemaRepository.findAllModelos();
  res.json(modelos);
});

export const listarSexos = asyncHandler(async (req, res) => {
  const rows = await SistemaRepository.rawQuery('SELECT * FROM Cat_Sexos');
  res.json(rows);
});

export const listarTiposParte = asyncHandler(async (req, res) => {
  const rows = await SistemaRepository.rawQuery('SELECT * FROM Cat_TiposParte');
  res.json(rows);
});

export const listarTonosAcabado = asyncHandler(async (req, res) => {
  const rows = await SistemaRepository.rawQuery('SELECT * FROM Cat_TonosAcabado');
  res.json(rows);
});

export const listarOrigenes = asyncHandler(async (req, res) => {
  const rows = await SistemaRepository.rawQuery('SELECT * FROM Origenes_Piezas');
  res.json(rows);
});

// --- ANALITICA ---

export const obtenerRentabilidad = asyncHandler(async (req, res) => {
  const rows = await SistemaRepository.rawQuery('SELECT * FROM Vista_Rentabilidad');
  res.json(rows);
});

export const obtenerStockCritico = asyncHandler(async (req, res) => {
  const rows = await SistemaRepository.rawQuery('SELECT * FROM Vista_Stock_Critico');
  res.json(rows);
});

export const calcularDescuento = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { porcentaje } = req.query;
  const result = await SistemaRepository.calcularDescuentoUDF(id, porcentaje);
  
  if (!result) {
    const error = new Error('Modelo no encontrado');
    error.statusCode = 404;
    throw error;
  }
  res.json(result);
});

export const reporteProduccion = asyncHandler(async (req, res) => {
  const resumen = await SistemaRepository.getProduccionResumen();
  res.json({
    timestamp: new Date(),
    resumen
  });
});

// --- PROVEEDORES ---

export const listarProveedores = asyncHandler(async (req, res) => {
  const rows = await SistemaRepository.findProveedores();
  res.json(rows);
});

export const registrarProveedor = asyncHandler(async (req, res) => {
  const { nombre, codigo } = req.body;
  await SistemaRepository.createProveedor(nombre, codigo);
  res.status(201).json({ message: 'Proveedor registrado' });
});
