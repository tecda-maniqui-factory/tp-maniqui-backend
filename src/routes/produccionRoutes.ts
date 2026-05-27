/**
 * @file produccionRoutes.ts
 * @description Rutas para el módulo de Producción.
 */

import { Router } from 'express';
import { produccionController } from '../container.js';
import { reglasManiqui } from '../middleware/validatorMiddleware.js';
import { verifyToken, esGerente } from '../middleware/authMiddleware.js';

const router: Router = Router();

router.use(verifyToken);

/**
 * Rutas de Maniquíes
 */
router.get('/maniquies', produccionController.getManiquies);
router.get('/maniquies/:serie', produccionController.getManiquiBySerie);
router.post('/maniquies/ensamblar', esGerente, reglasManiqui, produccionController.ensamblarManiqui);

/**
 * Rutas de Piezas
 */
router.get('/piezas/stock', produccionController.getPiezasStock);

/** Router de Express para este módulo */
export default router;
