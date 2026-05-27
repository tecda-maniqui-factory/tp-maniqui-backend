/**
 * @file authController.ts
 * @description Controladores para la gestión de autenticación.
 */

import { Request, Response } from 'express';
import { IAuthService } from '../types/services.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import logger from '../utils/logger.js';

/**
 * Controlador para la gestión de usuarios y sesiones.
 */
export class AuthController {
  constructor(private authService: IAuthService) {}

  /**
   * Endpoint para el registro de nuevos usuarios.
   * @route POST /auth/register
   */
  register = asyncHandler(async (req: Request, res: Response) => {
    logger.info('Solicitud de registro para usuario: %s', req.body.username);
    const result = await this.authService.register(req.body);
    res.status(201).json({
      message: 'Usuario registrado con éxito',
      usuario: result
    });
  });

  /**
   * Endpoint para el inicio de sesión.
   * @route POST /auth/login
   */
  login = asyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body;
    logger.info('Intento de login para usuario: %s', username);
    const result = await this.authService.login(username, password);
    res.json(result);
  });
}
