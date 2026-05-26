import { Router } from 'express';
import { 
  listarManiquies, 
  obtenerManiquiPorSerie, 
  registrarManiqui,
  listarPiezas,
  registrarPieza,
  ensamblarPieza
} from '../controllers/produccionController.js';
import { verificarToken, esGerente } from '../middleware/authMiddleware.js';

import { reglasManiqui } from '../middleware/validatorMiddleware.js';

const router = Router();

// Maniquíes
router.get('/maniquies', verificarToken, listarManiquies);
router.get('/maniquies/:serie', verificarToken, obtenerManiquiPorSerie);
router.post('/maniquies', verificarToken, esGerente, reglasManiqui, registrarManiqui);

// Piezas
router.get('/piezas', verificarToken, listarPiezas);
router.post('/piezas', verificarToken, registrarPieza);
router.put('/piezas/:codigo/ensamblar', verificarToken, ensamblarPieza);

export default router;
