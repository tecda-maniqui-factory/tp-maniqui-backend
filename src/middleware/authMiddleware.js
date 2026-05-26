import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. No se proporcionó token.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

export const esGerente = (req, res, next) => {
  if (req.user && req.user.rol === 'gerente_prod') {
    next();
  } else {
    res.status(403).json({ error: 'Acceso denegado. Se requiere rol de Gerente.' });
  }
};
