import ManiquiRepository from '../repositories/ManiquiRepository.js';
import { Pieza } from '../models/index.js'; // Aún usamos el modelo para Piezas (podría crearse otro Repo)
import { asyncHandler } from '../middleware/errorMiddleware.js';

/**
 * Controladores de Producción refactorizados con patrones de diseño.
 * Usa Repository Pattern para abstraer el acceso a datos.
 * Usa asyncHandler para eliminar bloques try-catch repetitivos.
 */

export const listarManiquies = asyncHandler(async (req, res) => {
  const { modelo_id, status } = req.query;
  const where = {};
  if (modelo_id) where.modelo_id = modelo_id;
  if (status) where.status = status;

  const maniquies = await ManiquiRepository.findAll(where);
  res.json(maniquies);
});

export const obtenerManiquiPorSerie = asyncHandler(async (req, res) => {
  const { serie } = req.params;
  const maniqui = await ManiquiRepository.findBySerie(serie);
  
  if (!maniqui) {
    const error = new Error('Maniquí no encontrado');
    error.statusCode = 404;
    throw error;
  }
  
  res.json(maniqui);
});

export const registrarManiqui = asyncHandler(async (req, res) => {
  const { modelo_id, numero_serie } = req.body;

  // El repositorio maneja la validación de duplicados y la llamada al SP
  const existe = await ManiquiRepository.findBySerie(numero_serie);
  if (existe) {
    const error = new Error('El número de serie ya existe');
    error.statusCode = 409;
    throw error;
  }

  const result = await ManiquiRepository.assemble(modelo_id, numero_serie);
  
  res.status(201).json({ 
    message: 'Maniquí ensamblado y registrado con éxito',
    detalle: result 
  });
});

export const listarPiezas = asyncHandler(async (req, res) => {
  const { tipo_parte_id, modelo_id, maniqui_id } = req.query;
  const where = {};
  if (tipo_parte_id) where.tipo_parte_id = tipo_parte_id;
  if (modelo_id) where.modelo_id = modelo_id;
  
  if (maniqui_id === 'null') where.maniqui_id = null;
  else if (maniqui_id) where.maniqui_id = maniqui_id;

  const piezas = await Pieza.findAll({ where });
  res.json(piezas);
});

export const registrarPieza = asyncHandler(async (req, res) => {
  const { tipo_parte_id, modelo_id, origen_id, tono_acabado_id, costo } = req.body;
  const nuevaPieza = await Pieza.create({ tipo_parte_id, modelo_id, origen_id, tono_acabado_id, costo });
  res.status(201).json({ id: nuevaPieza.id, message: 'Pieza registrada' });
});

export const ensamblarPieza = asyncHandler(async (req, res) => {
  const { codigo } = req.params;
  const { maniqui_id } = req.body;
  
  const [actualizado] = await Pieza.update(
    { maniqui_id },
    { where: { serial_parte: codigo, maniqui_id: null } }
  );

  if (actualizado === 0) {
    const error = new Error('Incompatible o ya ensamblada');
    error.statusCode = 409;
    throw error;
  }

  res.json({ message: 'Pieza ensamblada correctamente' });
});
