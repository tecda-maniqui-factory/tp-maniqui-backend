import { Maniqui, Modelo, Pieza } from '../models/index.js';
import sequelize from '../db.js';

export const listarManiquies = async (req, res) => {
  const { modelo_id, status } = req.query;
  const where = {};
  if (modelo_id) where.modelo_id = modelo_id;
  if (status) where.status = status;
  try {
    const maniquies = await Maniqui.findAll({
      where,
      include: [{ model: Modelo, attributes: ['nombre'] }]
    });
    res.json(maniquies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerManiquiPorSerie = async (req, res) => {
  const { serie } = req.params;
  try {
    const maniqui = await Maniqui.findOne({ where: { numero_serie: serie } });
    if (!maniqui) return res.status(404).json({ error: 'Maniquí no encontrado' });
    res.json(maniqui);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registrarManiqui = async (req, res) => {
  const { modelo_id, numero_serie } = req.body;
  try {
    // 1. Validar duplicado ANTES de llamar al SP para devolver 409 correcto
    const existe = await Maniqui.findOne({ where: { numero_serie } });
    if (existe) {
      return res.status(409).json({ error: 'El número de serie ya existe' });
    }

    // 2. Llamar al SP de ensamblaje
    const [result] = await sequelize.query(
      'CALL EnsamblarManiqui(?, ?)',
      { replacements: [modelo_id, numero_serie] }
    );
    
    res.status(201).json({ 
      message: 'Maniquí ensamblado y registrado con éxito mediante SP',
      detalle: result 
    });
  } catch (error) {
    // Capturar errores específicos del SP (Piezas insuficientes, etc.)
    if (error.parent && error.parent.errno === 1644) {
      return res.status(400).json({ error: error.parent.sqlMessage });
    }
    res.status(500).json({ error: error.message });
  }
};

export const listarPiezas = async (req, res) => {
  const { tipo_parte_id, modelo_id, maniqui_id } = req.query;
  const where = {};
  if (tipo_parte_id) where.tipo_parte_id = tipo_parte_id;
  if (modelo_id) where.modelo_id = modelo_id;
  if (maniqui_id === 'null') where.maniqui_id = null;
  else if (maniqui_id) where.maniqui_id = maniqui_id;

  try {
    const piezas = await Pieza.findAll({ where });
    res.json(piezas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registrarPieza = async (req, res) => {
  const { tipo_parte_id, modelo_id, origen_id, tono_acabado_id, costo } = req.body;
  try {
    const nuevaPieza = await Pieza.create({ tipo_parte_id, modelo_id, origen_id, tono_acabado_id, costo });
    res.status(201).json({ id: nuevaPieza.id, message: 'Pieza registrada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const ensamblarPieza = async (req, res) => {
  const { codigo } = req.params;
  const { maniqui_id } = req.body;
  try {
    const [actualizado] = await Pieza.update(
      { maniqui_id },
      { where: { serial_parte: codigo, maniqui_id: null } }
    );
    if (actualizado === 0) return res.status(409).json({ error: 'Incompatible o ya ensamblada' });
    res.json({ message: 'Pieza ensamblada correctamente' });
  } catch (error) {
    if (error.parent && error.parent.errno === 1644) return res.status(400).json({ error: error.parent.sqlMessage });
    res.status(500).json({ error: error.message });
  }
};
