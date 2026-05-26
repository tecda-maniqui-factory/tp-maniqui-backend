import sequelize from '../db.js';
import { Cliente, Venta, DetalleVenta, Maniqui } from '../models/index.js';
import { Op } from 'sequelize';

// --- CLIENTES ---
// Ejemplo: /clientes?nombre=Moda&cuit_cuil=20-1
export const listarClientes = async (req, res) => {
  const { nombre, cuit_cuil } = req.query;
  const where = {};

  if (nombre) where.nombre = { [Op.like]: `%${nombre}%` };
  if (cuit_cuil) where.cuit_cuil = cuit_cuil;

  try {
    const clientes = await Cliente.findAll({ where });
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registrarCliente = async (req, res) => {
  const { nombre, cuit_cuil, email } = req.body;
  try {
    const nuevoCliente = await Cliente.create({ nombre, cuit_cuil, email });
    res.status(201).json({ id: nuevoCliente.id, message: 'Cliente registrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- VENTAS ---
// Ejemplo: /ventas?cliente_id=1&metodo_pago=Tarjeta
export const listarVentas = async (req, res) => {
  const { cliente_id, metodo_pago } = req.query;
  const where = {};

  if (cliente_id) where.cliente_id = cliente_id;
  if (metodo_pago) where.metodo_pago = metodo_pago;

  try {
    const ventas = await Venta.findAll({
      where,
      include: [{ model: Cliente, attributes: ['nombre'] }]
    });
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registrarVenta = async (req, res) => {
  const { cliente_id, metodo_pago, maniquies } = req.body;
  const t = await sequelize.transaction();

  try {
    const total = maniquies.reduce((sum, m) => sum + m.precio_final, 0);
    const nuevaVenta = await Venta.create({
      cliente_id,
      total,
      metodo_pago: metodo_pago || 'Transferencia'
    }, { transaction: t });

    for (const item of maniquies) {
      await DetalleVenta.create({
        venta_id: nuevaVenta.id,
        maniqui_id: item.maniqui_id,
        precio_final: item.precio_final
      }, { transaction: t });

      await Maniqui.update(
        { status: 'Vendido' },
        { where: { id: item.maniqui_id }, transaction: t }
      );
    }

    await t.commit();
    res.status(201).json({ id: nuevaVenta.id, total, message: 'Venta registrada con éxito' });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
};

export const generarFactura = async (req, res) => {
  const { id } = req.params;
  try {
    const venta = await Venta.findByPk(id);
    if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });
    res.json({
      factura_nro: `0001-0000${id}`,
      cae: "74239847239841",
      vencimiento: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      total: venta.total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
