# 🧪 Guía de Calidad y Pruebas (Dual-Layer Testing)

El ecosistema de pruebas de Tecda Maniquí está diseñado para garantizar que tanto el contrato de la API como la lógica interna de los servicios funcionen correctamente.

---

## 🏗️ 1. Estrategia de Pruebas

Implementamos dos niveles de validación:

### Capa 1: Pruebas Unitarias (Lógica Interna)
*   **Herramienta:** Native Node.js Test Runner + `tsx`.
*   **Ubicación:** `tests/unit/*.test.ts`.
*   **Objetivo:** Validar los **Servicios** de forma aislada. Utilizamos mocks de los repositorios para probar la lógica de negocio sin depender de la base de datos real.
*   **Ejecución:** `pnpm test:unit`.

### Capa 2: Pruebas de Integración (Caja Negra)
*   **Herramienta:** Scripts Bash + `curl` + Prism (Mock).
*   **Ubicación:** `tests/integration/`.
*   **Objetivo:** Validar que el servidor (Mock o Real) cumpla con el contrato definido en `openapi.yaml`.
*   **Ejecución:** `pnpm test:integration`.

---

## 🎭 2. Desarrollo API-First con Prism

Para permitir que el equipo de Frontend trabaje en paralelo, utilizamos **Prism** como servidor de mocks.

### Iniciar servidor de mocks:
```bash
pnpm mock
```
Esto levantará un servidor en el puerto 8081 que responde dinámicamente basándose en los esquemas de `openapi.yaml`.

---

## 🛠️ 3. Ejecución de Pruebas

### Pruebas Totales
Para una validación completa antes de un deploy:
```bash
pnpm test
```

### Escenarios Avanzados (Scripts de Integración)
Puedes ejecutar auditorías específicas:
```bash
# Validar seguridad (401, 403)
bash tests/integration/security.http

# Validar flujo principal de producción
bash tests/integration/test_senior.sh
```

---

## ✍️ 4. Cómo escribir un nuevo Test Unitario

Gracias a la inyección de dependencias, probar un servicio es sencillo:

```typescript
import test from 'node:test';
import assert from 'node:assert';
import { MiServicio } from '../../src/services/MiServicio.js';

test('MiServicio', async (t) => {
  await t.test('Debe hacer X cosa', async () => {
    const mockRepo = { find: async () => 'dato_falso' };
    const servicio = new MiServicio(mockRepo as any);
    const result = await servicio.procesar();
    assert.strictEqual(result, 'dato_esperado');
  });
});
```

---
*La calidad no es un acto, es un hábito. Ejecute las pruebas antes de cada commit.*
