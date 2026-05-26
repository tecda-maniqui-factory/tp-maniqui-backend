import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/index.js';

export const register = async (req, res) => {
  const { username, password, nombre_completo, email, rol } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existe = await Usuario.findOne({ where: { username } });
    if (existe) {
      return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Crear usuario
    const nuevoUsuario = await Usuario.create({
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ 
      where: { username, activo: true } 
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const validPassword = await bcrypt.compare(password, usuario.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, username: usuario.username, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    usuario.last_login = new Date();
    await usuario.save();

    res.json({
      token,
      usuario: {
        id: usuario.id,
        username: usuario.username,
        nombre: usuario.nombre_completo,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
