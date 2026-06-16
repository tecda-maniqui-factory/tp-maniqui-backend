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
  const isOperational = err instanceof AppError;
  const statusCode = isOperational ? err.statusCode : 500;
  const message = isOperational ? err.message : 'Error interno del servidor';

  logger.error({
    method: req.method,
    url: req.url,
    status: statusCode,
    error: err instanceof Error ? err.message : String(err),
    stack: statusCode === 500 ? (err instanceof Error ? err.stack : undefined) : undefined
  });

  res.status(statusCode).json({
    error: message,
    isOperational
  });
};

/**
 * Envoltorio para controladores asíncronos.
 */
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
