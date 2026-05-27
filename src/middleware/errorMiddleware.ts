/**
 * @file errorMiddleware.ts
 * @description Gestión centralizada de errores y envoltorios asíncronos.
 */

import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.js';
import { AppError } from '../utils/AppError.js';

/**
 * Middleware global para capturar y formatear errores.
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err instanceof AppError ? err.statusCode : (err.statusCode || 500);
  const message = err.message || 'Error interno del servidor';

  logger.error({
    method: req.method,
    url: req.url,
    status: statusCode,
    error: message,
    stack: statusCode === 500 ? err.stack : undefined
  });

  res.status(statusCode).json({
    error: message,
    isOperational: err instanceof AppError ? err.isOperational : false
  });
};

/**
 * Envoltorio para controladores asíncronos.
 */
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
