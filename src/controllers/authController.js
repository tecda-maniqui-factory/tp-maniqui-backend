import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UsuarioRepository from '../repositories/UsuarioRepository.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

/**
 * Controladores de Autenticación refactorizados.
 * Usa Repository Pattern para Usuarios y asyncHandler para errores.
 */

export const register = asyncHandler(async (req, res) => {
  const { username, password, nombre_completo, email, rol } = req.body;

  const existe = await UsuarioRepository.findByUsernameAll(username);
  if (existe) {
    const error = new Error('El nombre de usuario ya está en uso');
    error.statusCode = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const nuevoUsuario = await UsuarioRepository.create({
    username,
    password_hash,
    nombre_completo,
    email,
    rol: rol || 'vendedor'
  });

  res.status(201).json({
    message: 'Usuario registrado con éxito',
    usuario: {
      id: nuevoUsuario.id,
      username: nuevoUsuario.username,
      rol: nuevoUsuario.rol
    }
  });
});

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const usuario = await UsuarioRepository.findByUsername(username);

  if (!usuario) {
    const error = new Error('Credenciales inválidas');
    error.statusCode = 401;
    throw error;
  }

  const validPassword = await bcrypt.compare(password, usuario.password_hash);
  if (!validPassword) {
    const error = new Error('Credenciales inválidas');
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: usuario.id, username: usuario.username, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  await UsuarioRepository.updateLastLogin(usuario.id);

  res.json({
    token,
    usuario: {
      id: usuario.id,
      username: usuario.username,
      nombre: usuario.nombre_completo,
      rol: usuario.rol
    }
  });
});
