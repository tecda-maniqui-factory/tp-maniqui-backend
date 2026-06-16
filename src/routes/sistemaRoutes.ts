/**
 * @file sistemaRoutes.ts
 * @description Rutas para utilidades de catálogo y reportes.
 */

import { Router } from 'express';
import { sistemaController } from '../container.js';
import { verifyToken, esGerente } from '../middleware/authMiddleware.js';

const router: Router = Router();

router.use(verifyToken);

/**
 * Catálogos
 */
router.get('/sistema/modelos', sistemaController.getModelos);
router.post('/sistema/modelos', esGerente, sistemaController.createModelo);
router.get('/sistema/modelos/:id/descuento', sistemaController.calcularDescuento);

/**
 * Proveedores
 */
router.get('/sistema/proveedores', sistemaController.getProveedores);
router.post('/sistema/proveedores', esGerente, sistemaController.createProveedor);

/**
 * Reportes Analíticos
 */
router.get('/sistema/reportes/produccion', esGerente, sistemaController.getProduccionResumen);
router.get('/reportes/rentabilidad', esGerente, sistemaController.getRentabilidad);
router.get('/reportes/stock-critico', esGerente, sistemaController.getStockCritico);

/** Router de Express para este módulo */
export default router;
