import ClienteRepository from '../repositories/ClienteRepository.js';
import VentaRepository from '../repositories/VentaRepository.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

/**
 * Controladores Comerciales refactorizados.
 */

// --- CLIENTES ---
export const listarClientes = asyncHandler(async (req, res) => {
  const { nombre, cuit_cuil } = req.query;
  const clientes = await ClienteRepository.findAll({ nombre, cuit_cuil });
  res.json(clientes);
});

export const registrarCliente = asyncHandler(async (req, res) => {
  const { nombre, cuit_cuil, email } = req.body;
  const nuevoCliente = await ClienteRepository.create({ nombre, cuit_cuil, email });
  res.status(201).json({ id: nuevoCliente.id, message: 'Cliente registrado' });
});

// --- VENTAS ---
export const listarVentas = asyncHandler(async (req, res) => {
  const { cliente_id, metodo_pago } = req.query;
  const ventas = await VentaRepository.findAll({ cliente_id, metodo_pago });
  res.json(ventas);
});

export const registrarVenta = asyncHandler(async (req, res) => {
  const { cliente_id, metodo_pago, maniquies } = req.body;
  const resultado = await VentaRepository.createWithDetails(cliente_id, metodo_pago, maniquies);
  res.status(201).json({ ...resultado, message: 'Venta registrada con éxito' });
});

export const generarFactura = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const venta = await VentaRepository.findById(id);
  
  if (!venta) {
    const error = new Error('Venta no encontrada');
    error.statusCode = 404;
    throw error;
  }

  res.json({
    factura_nro: `0001-0000${id}`,
    cae: "74239847239841",
    vencimiento: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    total: venta.total
  });
});
