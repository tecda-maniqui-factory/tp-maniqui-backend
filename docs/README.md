
## 🗺️ Mapa de Recursos

### 1. 📘 [Documentación de la API (Swagger)](http://localhost:8081/api-docs)
*   **Enfoque:** Consumidores de la API (Frontend, Integraciones).
*   **Contenido:** Endpoints, esquemas JSON, códigos de error y consola de pruebas interactiva.
*   **Contrato:** Basado en la especificación [OpenAPI 3.0 (openapi.yaml)](../openapi.yaml).

### 2. 🏗️ [Referencia Técnica de Código (TypeDoc)](./api-ts/index.html)
*   **Enfoque:** Desarrolladores del Backend.
*   **Contenido:** Diagramas de clases, interfaces de repositorios, contratos de servicios e inyección de dependencias.
*   **Generación:** Se actualiza automáticamente ejecutando `pnpm docs`.

### 3. 🛡️ [Guía de Seguridad](./SECURITY_GUIDE.md)
*   Explicación detallada del modelo de autenticación JWT, RBAC (Roles) y cifrado de datos.

### 4. 🧪 [Guía de Calidad y Testing](./TESTING_GUIDE.md)
*   Metodología de pruebas unitarias y de integración para asegurar la integridad de la lógica de negocio.

---

## 🛠️ Stack Tecnológico de Documentación

*   **OpenAPI 3.0:** Para definir el contrato agnóstico al lenguaje.
*   **Swagger UI:** Publicación visual del contrato.
*   **TypeDoc:** Generación de documentación desde el código fuente TypeScript.
*   **Prism:** Servidor de mocks para desarrollo paralelo del Frontend.

---
> [!IMPORTANT]
> Para cualquier cambio en la estructura de los datos, actualice primero las interfaces en `src/types/entities.ts` y luego el archivo `openapi.yaml`.
