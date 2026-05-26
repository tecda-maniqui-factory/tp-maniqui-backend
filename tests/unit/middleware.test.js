import test from 'node:test';
import assert from 'node:assert';
import { esGerente } from '../../src/middleware/authMiddleware.js';

test('Middleware: esGerente', async (t) => {
  await t.test('Debe permitir el acceso si el rol es gerente_prod', () => {
    const req = { user: { rol: 'gerente_prod' } };
    const res = {};
    let nextLlamado = false;
    const next = () => { nextLlamado = true; };

    esGerente(req, res, next);
    assert.strictEqual(nextLlamado, true);
  });

  await t.test('Debe denegar el acceso (403) si el rol no es gerente_prod', () => {
    const req = { user: { rol: 'vendedor' } };
    let statusEnviado = 0;
    const res = {
      status: (code) => {
        statusEnviado = code;
        return { json: () => {} };
      }
    };
    const next = () => {};

    esGerente(req, res, next);
    assert.strictEqual(statusEnviado, 403);
  });
});
