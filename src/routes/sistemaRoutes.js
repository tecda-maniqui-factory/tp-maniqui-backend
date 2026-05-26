import { Router } from 'express';
import { 
  listarModelos, 
  listarSexos, 
  listarTiposParte, 
  listarTonosAcabado, 
  listarOrigenes,
  calcularDescuento,
  reporteProduccion,
  listarProveedores,
  registrarProveedor,
  obtenerRentabilidad,
  obtenerStockCritico
} from '../controllers/sistemaController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = Router();

// Catalogos
router.get('/modelos', listarModelos);
router.get('/catalogos/sexos', verificarToken, listarSexos);
router.get('/catalogos/tipos-parte', verificarToken, listarTiposParte);
router.get('/catalogos/tonos-acabado', verificarToken, listarTonosAcabado);
router.get('/catalogos/origenes', verificarToken, listarOrigenes);

// Analítica
router.get('/modelos/:id/descuento', calcularDescuento);
router.get('/reportes/produccion', verificarToken, reporteProduccion);
router.get('/reportes/rentabilidad', verificarToken, obtenerRentabilidad);
router.get('/reportes/stock-critico', verificarToken, obtenerStockCritico);

// Proveedores
router.get('/proveedores', verificarToken, listarProveedores);
router.post('/proveedores', verificarToken, registrarProveedor);

export default router;
