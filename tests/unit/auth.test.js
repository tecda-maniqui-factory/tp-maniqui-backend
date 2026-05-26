import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const testJWT = () => {
  console.log('🧪 Ejecutando Prueba Unitaria: Generación de JWT...');
  
  const payload = { id: 1, username: 'test', rol: 'vendedor' };
  const secret = process.env.JWT_SECRET || 'test-secret';
  
  try {
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    const decoded = jwt.verify(token, secret);
    
    if (decoded.username === 'test' && decoded.rol === 'vendedor') {
      console.log('✅ Prueba Unitaria PASADA: Token generado y verificado correctamente.');
      return true;
    } else {
      console.log('❌ Prueba Unitaria FALLIDA: Los datos del token no coinciden.');
      return false;
    }
  } catch (error) {
    console.log('❌ Prueba Unitaria FALLIDA:', error.message);
    return false;
  }
};

testJWT();
