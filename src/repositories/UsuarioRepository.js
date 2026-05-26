import { Usuario } from '../models/index.js';

/**
 * Patrón Repository para Usuarios.
 */
class UsuarioRepository {
  async findByUsername(username) {
    return await Usuario.findOne({ where: { username, activo: true } });
  }

  async findByUsernameAll(username) {
    return await Usuario.findOne({ where: { username } });
  }

  async create(userData) {
    return await Usuario.create(userData);
  }

  async updateLastLogin(id) {
    return await Usuario.update(
      { last_login: new Date() },
      { where: { id } }
    );
  }
}

export default new UsuarioRepository();
