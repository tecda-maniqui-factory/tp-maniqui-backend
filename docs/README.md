# 📖 Centro de Documentación del Servidor (Backend)

Este documento centraliza el contrato de la API y la estrategia de validación del proyecto **Tecda Maniquí**.

## 🗺️ Mapa de Navegación

1. ### 📘 [Documentación Swagger (En Vivo)](http://localhost:8081/api-docs)
   * Visor interactivo para explorar y probar la API en tiempo real.

2. ### 🔌 [Especificación OpenAPI 2.1 (openapi.yaml)](../openapi.yaml)
   * Contrato técnico oficial con soporte para facturación y borrado lógico.

3. ### 🧪 [Estrategia de Testing](../tests/README.md)
   * Detalle de pruebas unitarias (`node:test`) e integración.

---

## 🎨 Visualización de la API
Para ver el archivo `openapi.yaml` de forma gráfica:
*   **Web:** Copia el contenido en [Swagger Editor](https://editor.swagger.io/).
*   **VS Code:** Instala la extensión "Swagger Viewer" y abre el archivo en la raíz.
*   **Local (Redoc/Swagger UI):**
    1. Desde la raíz del repo ejecuta: `python3 -m http.server 8082`
    2. Abre: `http://localhost:8082/docs/api/`

> [!TIP]
> Recuerda que usamos el **puerto 8081** para nuestras pruebas para evitar conflictos con otros servicios locales.
