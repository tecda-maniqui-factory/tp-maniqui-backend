import test from 'node:test';
import assert from 'node:assert';
import { ProduccionService } from '../../src/services/ProduccionService.js';
import { Pieza } from '../../src/models/index.js';

// Mock de Pieza.count para controlar el stock en los tests
const originalCount = Pieza.count;

test('ProduccionService (Unitario)', async (t) => {
  
  await t.test('listarManiquies: Debe llamar al repositorio', async () => {
    const mockRepo = {
      findAll: async (filters: any) => [{ id: 1, numero_serie: 'ABC' } as any],
      findBySerie: async () => null,
      assemble: async () => ({}),
      create: async () => ({}) as any,
      findAllPiezas: async () => []
    };

    const service = new ProduccionService(mockRepo);
    const result = await service.listarManiquies({});

    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0]?.numero_serie, 'ABC');
  });

  await t.test('ensamblarManiqui: Debe lanzar error si falta una pieza (Torso)', async () => {
    const mockRepo = {
      findAll: async () => [],
      findBySerie: async () => null,
      assemble: async () => ({}),
      create: async () => ({}) as any,
      findAllPiezas: async () => []
    };

    // Simular que no hay stock de Cabeza (tipo_parte_id: 1)
    Pieza.count = (async (options: any) => {
      if (options.where.tipo_parte_id === 1) return 0;
      return 1;
    }) as any;

    const service = new ProduccionService(mockRepo);
    await assert.rejects(
      () => service.ensamblarManiqui(1, 'SERIE-ERROR'),
      { message: 'Stock insuficiente: No hay Cabeza disponible para este modelo.' }
    );
  });

  await t.test('ensamblarManiqui: Debe llamar a assemble si hay stock de todas las piezas', async () => {
    let assembleCalled = false;
    const mockRepo = {
      findAll: async () => [],
      findBySerie: async () => null,
      assemble: async (modId: number, serie: string) => {
        assembleCalled = true;
        return { success: true };
      },
      create: async () => ({}) as any,
      findAllPiezas: async () => []
    };

    // Simular que hay stock de todas las piezas
    Pieza.count = (async () => 1) as any;

    const service = new ProduccionService(mockRepo);
    const result = await service.ensamblarManiqui(1, 'SERIE-OK');

    assert.strictEqual(assembleCalled, true);
    assert.deepStrictEqual(result, { success: true });
  });

  // Restaurar originalCount al finalizar
  Pieza.count = originalCount;
});
