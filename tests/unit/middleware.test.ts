/**
 * @file middleware.test.ts
 * @description Pruebas unitarias para validar el comportamiento de los middlewares.
 */

import test from 'node:test';
import assert from 'node:assert';
import { esGerente } from '../../src/middleware/authMiddleware.js';
import { Response, NextFunction } from 'express';

test('Middleware: esGerente', async (t) => {
  
  await t.test('Debe permitir el acceso si el rol es gerente_prod', () => {
    const req: any = { user: { rol: 'gerente_prod' } };
    const res: any = {};
    let nextLlamado = false;
    const next: NextFunction = (() => { nextLlamado = true; }) as any;

    esGerente(req, res, next);
    assert.strictEqual(nextLlamado, true);
  });

  await t.test('Debe denegar el acceso (403) si el rol no es gerente_prod', () => {
    const req: any = { user: { rol: 'vendedor' } };
    let statusEnviado = 0;
    const res: any = {
      status: (code: number) => {
        statusEnviado = code;
        return { json: () => {} };
      }
    };
    const next: NextFunction = (() => {}) as any;

    esGerente(req, res, next);
    assert.strictEqual(statusEnviado, 403);
  });
});
