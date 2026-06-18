# 🔌 Tecda Maniquí - Backend API v3.0 (TypeScript)

Este repositorio contiene la API profesional de **Tecda Maniquí**, migrada integralmente a **TypeScript** bajo principios **SOLID estrictos**. El sistema gestiona la cadena de producción, ensamblaje técnico, ventas y administración de una fábrica de maniquíes.

---

## 🏗️ Arquitectura y Principios de Diseño

El backend ha sido diseñado siguiendo una arquitectura de capas desacoplada para maximizar la testabilidad y el mantenimiento:

1.  **Capa de Controladores (Express):** Orquesta el flujo HTTP, validaciones de entrada y respuestas. No contiene lógica de negocio.
2.  **Capa de Servicios (Lógica de Negocio):** Encapsula las reglas operativas, cálculos y coordinación entre múltiples repositorios.
3.  **Capa de Repositorios (Persistencia):** Abstrae las consultas a la base de datos MySQL mediante Sequelize.
4.  **Inyección de Dependencias (DIP):** Implementada mediante un **Composition Root** (`src/container.ts`), permitiendo el desacoplamiento total entre capas.
5.  **Contratos (Interfaces):** Definición rigurosa de tipos para entidades, repositorios y servicios.
6.  **Documentación Completa en Español (ECC):** Controladores, servicios, modelos y la configuración del servidor cuentan con bloques `@example` de inicialización/ejecución y etiquetas `@throws` para el control exhaustivo de excepciones.

---

## 🚀 Tecnologías

*   **Runtime:** Node.js 22+
*   **Lenguaje:** TypeScript 5.x (Strict Mode)
*   **Framework:** Express.js
*   **ORM:** Sequelize (Class-based models)
*   **Base de Datos:** MySQL 8.0 / MariaDB
*   **Seguridad:** JWT (JSON Web Tokens) + RBAC (Roles) + BCryptJS
*   **Documentación:** TypeDoc (Código TS) + OpenAPI/Swagger (Endpoint API interactiva) + Redocly (API estática)
*   **Testing:** Native Node.js Test Runner + tsx

---

## 🛠️ Instalación y Configuración

1.  **Instalar dependencias:**
    ```bash
    pnpm install
    ```
2.  **Configurar variables de entorno:**
    Crea un archivo `.env` basado en `.env.example`:
    ```bash
    PORT=8082
    JWT_SECRET=tu_secreto_super_seguro
    DB_NAME=tecda_maniqui
    DB_USER=root
    DB_PASS=password
    DB_HOST=127.0.0.1
    ```
3.  **Levantar la base de datos:**
    Asegúrate de tener MySQL/MariaDB corriendo y aplicar los scripts de reforma de la base de datos.

---

## 📖 Ejecución y Documentación

### Desarrollo
```bash
pnpm dev
```
Usa `tsx` para una ejecución rápida con hot-reload sin compilación manual.

### Compilación (Producción)
```bash
pnpm build
# El código transpilado se genera en /dist
pnpm start
```

### Documentación del Sistema
*   **API Interactiva en Vivo:** Inicia el servidor y visita `http://localhost:8082/api-docs` (Swagger UI).
*   **Especificación de la API (Redocly):**
    Genera y actualiza el documento HTML interactivo de OpenAPI:
    ```bash
    pnpm exec redocly build-docs openapi.yaml -o docs/api/redoc.html
    ```
    Puedes consultar el archivo local: [docs/api/redoc.html](file:///home/jmro/Documentos/Proyectos/maniqui/tp-maniqui-backend/docs/api/redoc.html).
*   **Referencia Técnica de Código (TypeDoc):**
    Genera el desglose completo de clases, tipos e inyección de dependencias:
    ```bash
    pnpm exec typedoc
    ```
    Puedes abrir el archivo en tu navegador: [docs/api-ts/index.html](file:///home/jmro/Documentos/Proyectos/maniqui/tp-maniqui-backend/docs/api-ts/index.html).

---

## 🧪 Suite de Pruebas

*   **Tests Unitarios:** Validan servicios y lógica aislada usando mocks de repositorios.
    ```bash
    pnpm test:unit
    ```
*   **Tests de Integración:** Validan flujos completos API-DB mediante scripts de integración.
    ```bash
    pnpm test:integration
    ```
*   **Ejecución Completa:**
    ```bash
    pnpm test
    ```

---

## 📂 Estructura del Proyecto

*   `src/types/`: Definiciones de contratos e interfaces.
*   `src/models/`: Modelos de Sequelize (Clases).
*   `src/repositories/`: Acceso a datos y persistencia.
*   `src/services/`: Lógica de negocio (SOLID).
*   `src/controllers/`: Handlers de Express.
*   `src/container.ts`: Configuración de Inyección de Dependencias.
*   `tests/unit/`: Pruebas de servicios con `node:test`.

---
