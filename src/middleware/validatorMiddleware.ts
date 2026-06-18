/**
 * @file validatorMiddleware.ts
 * @description Esquemas y reglas de validación para las peticiones de entrada utilizando express-validator.
 */

import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para procesar y responder con errores de validación si existen.
 */
export const validarRequest = (req: Request, res: Response, next: NextFunction) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  next();
};

/**
 * Reglas de validación para el inicio de sesión.
 */
export const reglasLogin = [
  body('username').notEmpty().withMessage('El nombre de usuario es requerido'),
  body('password').notEmpty().withMessage('La contraseña es requerida'),
  validarRequest
];

/**
 * Reglas de validación para el registro de nuevos usuarios.
 */
export const reglasRegistro = [
  body('username').isLength({ min: 4 }).withMessage('El usuario debe tener al menos 4 caracteres'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('email').isEmail().withMessage('Email inválido'),
  body('rol').optional().isIn(['vendedor', 'gerente_prod']).withMessage('Rol inválido'),
  validarRequest
];

/**
 * Reglas de validación para la creación de clientes.
 */
export const reglasCliente = [
  body('nombre').notEmpty().withMessage('El nombre es requerido').isLength({ min: 3 }),
  body('cuit_cuil').matches(/^[0-9]{2}-[0-9]{8}-[0-9]{1}$/).withMessage('Formato CUIT inválido (XX-XXXXXXXX-X)'),
  body('email').isEmail().withMessage('Email inválido'),
  validarRequest
];

/**
 * Reglas de validación para el ensamblaje de maniquíes.
 */
export const reglasManiqui = [
  body('modelo_id').isInt().withMessage('ID de modelo inválido'),
  body('numero_serie').notEmpty().withMessage('El número de serie es requerido'),
  validarRequest
];

/**
 * Reglas de validación para el ingreso de piezas.
 */
export const reglasPieza = [
  body('origen_codigo').notEmpty().withMessage('El origen es requerido'),
  body('tipo_parte_codigo').notEmpty().withMessage('El tipo de pieza es requerido'),
  body('modelo_id').isInt().withMessage('ID de modelo inválido'),
  body('cantidad').isInt({ min: 1 }).withMessage('La cantidad debe ser mayor a 0'),
  body('costo').isFloat({ min: 0.01 }).withMessage('El costo debe ser mayor a 0'),
  validarRequest
];

/**
 * Reglas de validación para la creación de modelos.
 */
export const reglasModelo = [
  body('nombre').isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
  body('sexo_id').isInt().withMessage('ID de sexo inválido'),
  body('partes').isArray({ min: 1 }).withMessage('Debe incluir al menos una pieza'),
  body('costo_unitario').isFloat({ min: 0.01 }).withMessage('El costo unitario debe ser mayor a 0'),
  body('precio_venta').isFloat({ min: 0.01 }).withMessage('El precio de venta debe ser mayor a 0'),
  validarRequest
];

/**
 * Reglas de validación para el registro de ventas.
 */
export const reglasVenta = [
  body('cliente_id').isInt().withMessage('ID de cliente inválido'),
  body('maniquies').isArray({ min: 1 }).withMessage('Debe incluir al menos un maniquí'),
  body('maniquies.*.maniqui_id').isInt().withMessage('ID de maniquí inválido'),
  body('maniquies.*.precio_final').isFloat({ min: 0 }).withMessage('Precio inválido'),
  validarRequest
];
