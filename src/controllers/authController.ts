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
 * 
 * Expone endpoints de Express que delegan en {@link IAuthService}
 * para registrar usuarios e iniciar sesión con JWT.
 * 
 * @example
 * ```ts
 * const authController = new AuthController(authService);
 * router.post('/register', authController.register);
 * router.post('/login', authController.login);
 * ```
 */
export class AuthController {
  constructor(private authService: IAuthService) {}

  /**
   * Endpoint para el registro de nuevos usuarios en el sistema.
   * 
   * @route POST /auth/register
   * @param req - Objeto de petición HTTP de Express. Espera body con {@link IUsuario}.
   * @param res - Objeto de respuesta HTTP de Express.
   * @returns Promesa que envía una respuesta JSON con el usuario creado y código de estado 201.
   * @throws {AppError} Si el registro falla debido a validaciones o si el usuario ya existe.
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
   * Endpoint para el inicio de sesión y autenticación de usuarios.
   * 
   * @route POST /auth/login
   * @param req - Objeto de petición HTTP de Express. Espera body con username y password.
   * @param res - Objeto de respuesta HTTP de Express.
   * @returns Promesa que envía una respuesta JSON con el token JWT y los datos del usuario.
   * @throws {AppError} Si las credenciales provistas son incorrectas.
   */
  login = asyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body;
    logger.info('Intento de login para usuario: %s', username);
    const result = await this.authService.login(username, password);
    res.json(result);
  });
}
