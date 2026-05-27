/**
 * @file auth.test.ts
 * @description Prueba unitaria para verificar la correcta generación y decodificación de tokens JWT.
 */

import test from 'node:test';
import assert from 'node:assert';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

test('JWT: Autenticación', async (t) => {
  await t.test('Debe generar y verificar un token correctamente', () => {
    const payload = { id: 1, username: 'test', rol: 'vendedor' };
    const secret = process.env.JWT_SECRET || 'test-secret';
    
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    const decoded: any = jwt.verify(token, secret);
    
    assert.strictEqual(decoded.username, 'test');
    assert.strictEqual(decoded.rol, 'vendedor');
  });
});
