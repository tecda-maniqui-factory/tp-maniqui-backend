/**
 * @file authRoutes.ts
 * @description Rutas para el módulo de Autenticación.
 */

import { Router } from 'express';
import { authController } from '../container.js';
import { reglasLogin, reglasRegistro } from '../middleware/validatorMiddleware.js';
import { verifyToken, esGerente } from '../middleware/authMiddleware.js';

const router: Router = Router();

/**
 * @route POST /auth/register
 */
router.post('/register', verifyToken, esGerente, reglasRegistro, authController.register);

/**
 * @route POST /auth/login
 */
router.post('/login', reglasLogin, authController.login);

/** Router de Express para este módulo */
export default router;
