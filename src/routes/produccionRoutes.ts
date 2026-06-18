/**
 * @file produccionRoutes.ts
 * @description Rutas para el módulo de Producción.
 */

import { Router } from 'express';
import { produccionController } from '../container.js';
import { reglasManiqui, reglasPieza } from '../middleware/validatorMiddleware.js';
import { verifyToken, esGerente, esGerenteOOperario } from '../middleware/authMiddleware.js';

const router: Router = Router();

router.use(verifyToken);

/**
 * Rutas de Maniquíes
 */
router.get('/maniquies', produccionController.getManiquies);
router.get('/maniquies/:serie', produccionController.getManiquiBySerie);
router.post('/maniquies/ensamblar', esGerenteOOperario, reglasManiqui, produccionController.ensamblarManiqui);

/**
 * Rutas de Piezas
 */
router.get('/piezas/stock', produccionController.getPiezasStock);
router.post('/piezas/ingreso', esGerente, reglasPieza, produccionController.ingresarPiezas);

/** Router de Express para este módulo */
export default router;
