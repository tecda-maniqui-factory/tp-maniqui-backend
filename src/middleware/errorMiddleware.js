/**
 * Middleware de manejo de errores centralizado.
 * Sigue el patrón de 'Central Error Handler' para evitar try-catch repetitivos
 * y estandarizar el formato de respuesta al cliente.
 */
export const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.stack}`);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  // Errores específicos de Sequelize/MySQL
  if (err.parent && err.parent.errno === 1644) {
    return res.status(400).json({ 
      error: 'Error de validación de negocio',
      detalle: err.parent.sqlMessage 
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ 
      error: 'Conflicto de duplicidad',
      detalle: err.errors.map(e => e.message) 
    });
  }

  res.status(statusCode).json({
    error: message,
    status: statusCode
  });
};

/**
 * Wrapper para controladores asíncronos.
 * Evita tener que escribir try-catch en cada controlador.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
