/**
 * @file comercialRoutes.ts
 * @description Rutas para el módulo Comercial.
 */

import { Router } from 'express';
import { comercialController } from '../container.js';
import { reglasCliente, reglasVenta } from '../middleware/validatorMiddleware.js';
import { verifyToken, esVendedor } from '../middleware/authMiddleware.js';

const router: Router = Router();

// Todas las rutas comerciales requieren autenticación
router.use(verifyToken);

/**
 * Rutas de Clientes
 */
router.get('/clientes', comercialController.getClientes);
router.post('/clientes', reglasCliente, comercialController.createCliente);

/**
 * Rutas de Ventas
 */
router.get('/ventas', comercialController.getVentas);
router.post('/ventas', esVendedor, reglasVenta, comercialController.registrarVenta);
router.get('/ventas/:id', comercialController.getVentaById);

/** Router de Express para este módulo */
export default router;
