import UsuarioRepository from './repositories/UsuarioRepository.js';
import ClienteRepository from './repositories/ClienteRepository.js';
import VentaRepository from './repositories/VentaRepository.js';
import ManiquiRepository from './repositories/ManiquiRepository.js';
import SistemaRepository from './repositories/SistemaRepository.js';

import { AuthService } from './services/AuthService.js';
import { ComercialService } from './services/ComercialService.js';
import { ProduccionService } from './services/ProduccionService.js';
import { SistemaService } from './services/SistemaService.js';

import { AuthController } from './controllers/authController.js';
import { ComercialController } from './controllers/comercialController.js';
import { ProduccionController } from './controllers/produccionController.js';
import { SistemaController } from './controllers/sistemaController.js';

// Services
const authService = new AuthService(UsuarioRepository);
const comercialService = new ComercialService(ClienteRepository, VentaRepository, ManiquiRepository);
const produccionService = new ProduccionService(ManiquiRepository);
const sistemaService = new SistemaService(SistemaRepository);

// Controllers

/** Controlador para autenticación y usuarios */
export const authController = new AuthController(authService);
/** Controlador para clientes y transacciones comerciales */
export const comercialController = new ComercialController(comercialService);
/** Controlador para la cadena de producción y piezas */
export const produccionController = new ProduccionController(produccionService);
/** Controlador para utilidades del sistema y catálogos */
export const sistemaController = new SistemaController(sistemaService);
