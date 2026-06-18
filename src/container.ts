/**
 * @file container.ts
 * @description Contenedor centralizado para la inyección de dependencias (DI) manual.
 * Instancia y enlaza los repositorios, servicios y controladores de la aplicación para resolver dependencias.
 */

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

// --- INSTANCIACIÓN DE SERVICIOS (Con inyección de repositorios) ---

/** Servicio encargado de la lógica de negocio de autenticación y usuarios */
const authService = new AuthService(UsuarioRepository);

/** Servicio encargado de la lógica comercial, clientes y ventas */
const comercialService = new ComercialService(ClienteRepository, VentaRepository, ManiquiRepository);

/** Servicio encargado del control de producción y ensamblaje de maniquíes */
const produccionService = new ProduccionService(ManiquiRepository);

/** Servicio encargado de la administración del catálogo e información general del sistema */
const sistemaService = new SistemaService(SistemaRepository);

// --- CONTROLADORES EXPORTADOS (Con inyección de servicios) ---

/** Controlador HTTP para gestionar la autenticación y usuarios */
export const authController = new AuthController(authService);

/** Controlador HTTP para gestionar clientes y transacciones comerciales */
export const comercialController = new ComercialController(comercialService);

/** Controlador HTTP para la cadena de producción y ensamblado de maniquíes */
export const produccionController = new ProduccionController(produccionService);

/** Controlador HTTP para utilidades generales del sistema y catálogos */
export const sistemaController = new SistemaController(sistemaService);

