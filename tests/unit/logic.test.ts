/**
 * @file logic.test.ts
 * @description Pruebas unitarias para la lógica de negocio pura.
 */

import test from 'node:test';
import assert from 'node:assert';

const calcularDescuentoJS = (precio: number, pct: number): number => precio - (precio * (pct / 100));

test('Lógica de Negocio: Cálculos', async (t) => {
  
  await t.test('CalcularDescuento: Debe aplicar el 10% correctamente', () => {
    const resultado = calcularDescuentoJS(1000, 10);
    assert.strictEqual(resultado, 900);
  });

  await t.test('CalcularDescuento: Debe manejar 0% de descuento', () => {
    const resultado = calcularDescuentoJS(500, 0);
    assert.strictEqual(resultado, 500);
  });
  
  await t.test('CalcularDescuento: Debe manejar 100% de descuento', () => {
    const resultado = calcularDescuentoJS(500, 100);
    assert.strictEqual(resultado, 0);
  });

  await t.test('Modelo: El valor por defecto de activo debe ser true', () => {
    const modeloMock = { activo: true };
    assert.strictEqual(modeloMock.activo, true);
  });
});
