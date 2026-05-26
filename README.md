# 🔌 Tecda Maniquí - Servidor API (Backend) v2.1

Este repositorio contiene la implementación profesional de la **API Express** para la fábrica de maniquíes Tecda. 

---

## 🚀 Tecnologías y Arquitectura

*   **Framework:** Express.js (Node.js 22+)
*   **ORM:** Sequelize (Gestión de Modelos y Transacciones)
*   **Base de Datos:** MySQL 8.0 (Docker) con lógica avanzada (SP, Triggers, Vistas)
*   **Seguridad:** JWT + Roles (RBAC) + Bcrypt
*   **Documentación:** OpenAPI 3.0 + Swagger UI
*   **Testing:** Suite dual (Unitarios con `node:test` e Integración con `Bash/Curl`)

---

## 🛠️ Instalación y Uso

1.  **Instalar dependencias:**
    ```bash
    pnpm install
    ```
2.  **Configurar Entorno:**
    Asegúrate de tener un archivo `.env` (ver `.env.example`).
3.  **Iniciar Servidor:**
    ```bash
    pnpm dev
    ```
4.  **Ver Documentación Interactiva:**
    Abre: `http://localhost:8081/api-docs`

---

## 🧪 Estrategia de Pruebas

El proyecto utiliza una estructura de pruebas profesional:
*   **Pruebas Unitarias:** `pnpm test:unit` (Valida lógica aislada, middlewares y validadores).
*   **Pruebas de Integración:** `pnpm test:integration` (Valida el flujo completo API-DB).
*   **Pruebas Totales:** `pnpm test`

---

## 📂 Herramientas de Mantenimiento

*   `node run_db_reform.js`: Aplica reformas integrales a la DB (Borrado lógico, SP robustos).
*   `node reset_db_users.js`: Limpia y recrea el entorno de pruebas.
*   `node setup_admin.js`: Crea el administrador inicial.

---
*Desarrollado para la materia Prácticas Profesionalizantes - @tecda-maniqui-factory.*
