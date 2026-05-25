# 📖 Centro de Documentación del Servidor (Backend)

Bienvenido al centro de conocimiento del proyecto **Tecda Maniquí**. Aquí gestionamos el "Contrato" de nuestra API y su estrategia de validación.

## 🗺️ Mapa de Navegación

1. ### 🎓 [Guía Maestra de Pruebas (TESTING_GUIDE.md)](TESTING_GUIDE.md)
   * **LECTURA OBLIGATORIA:** Explica la metodología API-First, cómo usar **Prism** y cómo ejecutar pruebas sin haber programado el servidor aún.

2. ### 🔌 [Especificación de API REST (openapi.yaml)](../openapi.yaml)
   * El "Plano" técnico de nuestro servidor. Define endpoints, modelos de datos y reglas de negocio.

3. ### 🧪 [Suite de Pruebas Interactiva (api_tests.http)](../tests/api_tests.http)
   * Archivo ejecutable para disparar peticiones contra el servidor (Mock o Real) con un solo clic.

---

## 🎨 Visualización de la API
Para ver el archivo `openapi.yaml` de forma gráfica:
*   **Web:** Copia el contenido en [Swagger Editor](https://editor.swagger.io/).
*   **VS Code:** Instala la extensión "Swagger Viewer" y abre el archivo en la raíz.

> [!TIP]
> Recuerda que usamos el **puerto 8081** para nuestras pruebas para evitar conflictos con otros servicios locales.
