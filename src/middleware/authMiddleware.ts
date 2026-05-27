/**
 * @file authMiddleware.ts
 * @description Filtros de seguridad para proteger rutas y verificar roles.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Interfaz extendida para incluir el usuario en la petición Express.
 */
export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    rol: 'vendedor' | 'gerente_prod';
  };
}

/**
 * Middleware para validar el token JWT.
 */
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'No se proporcionó un token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

/**
 * Middleware para restringir acceso solo a Gerentes de Producción.
 */
export const esGerente = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.rol !== 'gerente_prod') {
    return res.status(403).json({ error: 'Acceso denegado: Se requiere rol Gerente de Producción' });
  }
  next();
};

/**
 * Middleware para restringir acceso solo a Vendedores.
 */
export const esVendedor = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.rol !== 'vendedor' && req.user?.rol !== 'gerente_prod') {
    return res.status(403).json({ error: 'Acceso denegado: Se requiere rol Vendedor' });
  }
  next();
};
