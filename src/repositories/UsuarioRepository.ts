/**
 * @file UsuarioRepository.ts
 * @description Repositorio para la gestión de persistencia de Usuarios y seguridad de acceso.
 */

import { Usuario } from '../models/index.js';
import { IUsuarioRepository } from '../types/repositories.js';
import { IUsuario } from '../types/entities.js';

/**
 * Patrón Repository para gestionar la persistencia y acceso a Usuarios.
 */
class UsuarioRepository implements IUsuarioRepository {
  /**
   * Busca un usuario activo por su nombre de usuario.
   */
  async findByUsername(username: string): Promise<IUsuario | null> {
    return await Usuario.findOne({ where: { username, activo: true } });
  }

  /**
   * Busca un usuario (activo o inactivo) por su nombre de usuario.
   */
  async findByUsernameAll(username: string): Promise<IUsuario | null> {
    return await Usuario.findOne({ where: { username } });
  }

  /**
   * Crea un nuevo usuario en la base de datos.
   */
  async create(userData: Partial<IUsuario>): Promise<IUsuario> {
    return await Usuario.create(userData as any);
  }

  /**
   * Actualiza la fecha del último inicio de sesión.
   */
  async updateLastLogin(id: number): Promise<number[]> {
    return await Usuario.update(
      { last_login: new Date() },
      { where: { id } }
    );
  }
}

/** Instancia singleton del repositorio */
const instance = new UsuarioRepository();
export default instance;
export { UsuarioRepository };
