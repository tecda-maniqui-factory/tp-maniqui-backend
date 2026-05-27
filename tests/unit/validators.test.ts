/**
 * @file validators.test.ts
 * @description Pruebas unitarias para las reglas de validación.
 */

import test from 'node:test';
import assert from 'node:assert';
import { reglasLogin, reglasCliente } from '../../src/middleware/validatorMiddleware.js';

test('Validadores: Reglas de Entrada', async (t) => {
  
  await t.test('reglasLogin: Debe existir la definición de reglas', async () => {
    assert.strictEqual(Array.isArray(reglasLogin), true);
    assert.ok(reglasLogin.length > 0);
  });

  await t.test('reglasCliente: Debe existir la definición de reglas', async () => {
    assert.strictEqual(Array.isArray(reglasCliente), true);
    assert.ok(reglasCliente.length > 0);
  });
});
