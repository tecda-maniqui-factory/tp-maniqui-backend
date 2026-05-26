# 🧪 Estrategia de Testing - Tecda Maniquí

Este proyecto utiliza un enfoque de **Pirámide de Pruebas** para asegurar la máxima calidad.

## 1. Pruebas Unitarias (`tests/unit/`)
*   **Herramienta:** `node:test` (Nativo de Node.js).
*   **Objetivo:** Validar lógica aislada sin dependencias externas.
*   **Frecuencia:** Ejecutar después de cada cambio en la lógica.
*   **Comando:** `pnpm test:unit`

## 2. Pruebas de Integración (`tests/integration/`)
*   **Herramienta:** Bash + Curl + HTTP Client.
*   **Objetivo:** Validar el flujo completo: API -> Middleware -> Sequelize -> MySQL.
*   **Frecuencia:** Ejecutar antes de cada commit/deploy.
*   **Comando:** `pnpm test:integration`

## 3. Pruebas de Base de Datos (`GESTION_BBDD/tp-maniqui-db/tests/`)
*   **Herramienta:** SQL Scripts.
*   **Objetivo:** Validar Stored Procedures, Triggers y Vistas directamente en el motor.
*   **Archivo clave:** `test_reforma_v2.sql`

---
> [!IMPORTANT]
> Antes de correr las pruebas de integración, el script ejecutará automáticamente `reset_db_users.js` para asegurar un entorno limpio.
