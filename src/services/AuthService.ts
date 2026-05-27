/**
 * @file AuthService.ts
 * @description Servicio para la gestión de autenticación y sesiones.
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUsuarioRepository } from '../types/repositories.js';
import { IAuthService } from '../types/services.js';
import { IUsuario } from '../types/entities.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

/**
 * Servicio encargado de la lógica de autenticación, cifrado y generación de tokens.
 */
export class AuthService implements IAuthService {
  constructor(private usuarioRepo: IUsuarioRepository) {}

  /**
   * Registra un nuevo usuario en el sistema.
   */
  async register(userData: Partial<IUsuario> & { password?: string }): Promise<Partial<IUsuario>> {
    const { username, password, nombre_completo, email, rol } = userData;

    if (!username) throw new AppError('El nombre de usuario es requerido', 400);

    const existe = await this.usuarioRepo.findByUsernameAll(username);
    if (existe) {
      throw new AppError('El nombre de usuario ya está en uso', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password || 'default123', salt);

    const nuevoUsuario = await this.usuarioRepo.create({
      username,
      password_hash,
      nombre_completo,
      email,
      rol: rol || 'vendedor',
      activo: true
    });

    return {
      id: nuevoUsuario.id,
      username: nuevoUsuario.username,
      rol: nuevoUsuario.rol
    };
  }

  /**
   * Valida credenciales y genera un token JWT.
   */
  async login(username: string, password: string): Promise<{ token: string; usuario: Partial<IUsuario> & { nombre?: string | undefined } }> {
    const usuario = await this.usuarioRepo.findByUsername(username);

    if (!usuario) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const validPassword = await bcrypt.compare(password, usuario.password_hash);
    if (!validPassword) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const token = jwt.sign(
      { id: usuario.id, username: usuario.username, rol: usuario.rol },
      env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    await this.usuarioRepo.updateLastLogin(usuario.id!);

    return {
      token,
      usuario: {
        id: usuario.id,
        username: usuario.username,
        nombre: usuario.nombre_completo,
        rol: usuario.rol
      }
    };
  }
}
