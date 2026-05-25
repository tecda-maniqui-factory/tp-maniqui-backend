# 📖 Centro de Documentación del Servidor (Backend)

Bienvenido al centro de documentación técnica del **Servidor Backend** del proyecto **Tecda Maniquí**, correspondiente a la materia de **Prácticas Profesionalizantes**.

Aquí encontrarás toda la documentación detallada del diseño de la API REST, los casos de prueba interactivos y las configuraciones de puertos y despliegue del servidor.

## 🗺️ Mapa de Navegación

Para facilitar la exploración de la capa de servicios, la documentación se divide en las siguientes secciones detalladas:

1. ### 🔌 [Especificación de API REST (OpenAPI / Swagger)](openapi.yaml)
   * Definición formal e interactiva de los endpoints del sistema (CRUD, filtros, respuestas de error).
   * Mapeo directo de las rutinas de la base de datos (Stored Procedures, Triggers, Views y Funciones SQL).

2. ### 🧪 [Suite de Pruebas de API REST (.http)](api_tests.http)
   * Archivo de texto plano `.http` compatible con la extensión **REST Client** de VS Code / Cursor.
   * Peticiones listas para interactuar con todos los endpoints de forma ágil y con un solo clic.
   * Casos de prueba específicos para verificar respuestas exitosas y forzar excepciones del Trigger Anti-Frankenstein (respuesta `409 Conflict`).

---

## 🎨 ¿Cómo Visualizar la API de forma Interactiva?

La especificación está escrita bajo el estándar mundial **OpenAPI 3.0 (YAML)**. Puedes visualizarla gráficamente mediante:

### Método A: Swagger Editor (En la Web - Sin Instalar Nada)
1. Abre el archivo [docs/openapi.yaml](openapi.yaml) y copia su contenido.
2. Ingresa a **[Swagger Editor](https://editor.swagger.io/)** en tu navegador.
3. Pega el código YAML para renderizar la interfaz interactiva.

### Método B: Extensión de VS Code / Cursor
1. Instala la extensión **"OpenAPI Swagger Editor"** o **"Swagger Viewer"**.
2. Abre `docs/openapi.yaml` y haz clic en el botón de vista previa.

---

> [!NOTE]
> Este backend está configurado por defecto para correr en el **puerto `8081`** para evitar colisiones con el puente local de WhatsApp que ya ocupa el puerto `8080`.
