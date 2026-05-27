import test from 'node:test';
import assert from 'node:assert';
import { ProduccionService } from '../../src/services/ProduccionService.js';

test('ProduccionService (Unitario)', async (t) => {
  await t.test('listarManiquies: Debe llamar al repositorio', async () => {
    // Mock del repositorio
    const mockRepo = {
      findAll: async (filters: any) => [{ id: 1, numero_serie: 'ABC' } as any],
      findBySerie: async () => null,
      assemble: async () => ({}),
      create: async () => ({}) as any
    };

    const service = new ProduccionService(mockRepo);
    const result = await service.listarManiquies({});

    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0]?.numero_serie, 'ABC');
  });

  await t.test('obtenerManiqui: Debe lanzar error si no existe', async () => {
    const mockRepo = {
      findAll: async () => [],
      findBySerie: async () => null,
      assemble: async () => ({}),
      create: async () => ({}) as any
    };

    const service = new ProduccionService(mockRepo);
    await assert.rejects(
      () => service.obtenerManiqui('NONEXISTENT'),
      { message: 'Maniquí no encontrado', statusCode: 404 }
    );
  });
});
