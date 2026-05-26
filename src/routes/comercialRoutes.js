import { Router } from 'express';
import { 
  listarClientes, 
  registrarCliente, 
  listarVentas, 
  registrarVenta, 
  generarFactura 
} from '../controllers/comercialController.js';
import { verificarToken } from '../middleware/authMiddleware.js';
import { reglasCliente, reglasVenta } from '../middleware/validatorMiddleware.js';

const router = Router();

router.get('/clientes', verificarToken, listarClientes);
router.post('/clientes', verificarToken, reglasCliente, registrarCliente);

router.get('/ventas', verificarToken, listarVentas);
router.post('/ventas', verificarToken, reglasVenta, registrarVenta);
router.get('/ventas/:id/factura', verificarToken, generarFactura);

export default router;
