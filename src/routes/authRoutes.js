import { Router } from 'express';
import { login, register } from '../controllers/authController.js';
import { reglasLogin, reglasRegistro } from '../middleware/validatorMiddleware.js';

import { verificarToken, esGerente } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', verificarToken, esGerente, reglasRegistro, register);
router.post('/login', reglasLogin, login);

export default router;
