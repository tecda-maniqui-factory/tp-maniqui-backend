# 🔌 Tecda Maniquí - Servidor API (Backend)

Este repositorio contiene la implementación de la **API Express (Backend)** para el sistema de gestión de producción e inventario de la fábrica de maniquíes **Tecda**. 

---

## 📂 Estructura del Repositorio (Senior Mode)

Siguiendo las mejores prácticas de la industria, el repositorio se organiza así:

*   **`openapi.yaml`**: El **Contrato** de la API en la raíz para máxima visibilidad.
*   **/tests**: Carpeta de validación.
    *   `api_tests.http`: Suite de pruebas interactivas para REST Client.
*   **/docs**: Centro de conocimiento.
    *   `TESTING_GUIDE.md`: 🎓 Guía didáctica sobre pruebas.
    *   `SECURITY_GUIDE.md`: 🛡️ Guía de arquitectura de seguridad (JWT + RBAC).
    *   `README.md`: Mapa detallado.

---

## 🎓 Objetivos de Aprendizaje (Teaching-Learning)

1.  **Capa de Datos:** SQL avanzado (Triggers, SP, UDF).
2.  **Capa de Seguridad:** Implementación de tabla de usuarios, hasheo de contraseñas y autenticación JWT.
3.  **Capa de Contrato:** OpenAPI 3.0 con escenarios de error.

---

## 🚀 ¿Cómo empezar? (Testing First)

Antes de escribir código, debemos validar nuestro diseño:

1.  **Simula la API con Prism:**
    ```bash
    npx @stoplight/prism-cli mock openapi.yaml -p 8081 -d
    ```
2.  **Aprende a realizar las pruebas:**
    Consulta nuestra 🎓 **[Guía de Pruebas (TESTING_GUIDE.md)](docs/TESTING_GUIDE.md)** para entender el flujo de trabajo profesional.
3.  **Ejecuta las pruebas interactivas:**
    Usa el archivo **[tests/api_tests.http](tests/api_tests.http)** con la extensión REST Client.

---
*Desarrollado para la materia Prácticas Profesionalizantes - @tecda-maniqui-factory.*
