# 📘 Guía de Pruebas de API (API-First)

Esta guía describe una metodología profesional de pruebas **Contract-First / API-First**. En lugar de escribir el servidor y probar después, primero se define el contrato (`openapi.yaml`), luego se simula el servidor para validar el diseño y, finalmente, se implementa el backend.

---

## 🧐 1. ¿Por qué probar antes de programar?

El archivo `openapi.yaml` funciona como plano del sistema. Al simular ese plano se logra:
1. **Desbloquear al equipo de Frontend:** Ellos pueden empezar a programar las pantallas consumiendo datos falsos (pero con la estructura correcta) sin esperar a que terminemos la base de datos.
2. **Validar el Diseño:** Nos damos cuenta temprano si nos falta un parámetro o si una respuesta no tiene sentido.
3. **Evitar Retrabajo:** Es más barato cambiar un archivo YAML que refactorizar cientos de líneas de código JavaScript.

---

## 🎭 2. Prism: Servidor Mock

**¿Qué es Prism?**
Prism (creado por Stoplight) es una herramienta de línea de comandos que lee tu archivo OpenAPI y automáticamente levanta un servidor web de mentira.

**¿Cómo funciona?**
Prism mira los esquemas (`schemas`) en tu YAML. Si dices que devuelves un `Maniqui` con un ID numérico y un estado, Prism inventará un número y una cadena de texto válidos y te los enviará.

### 🛠️ Cómo usar Prism:

Desde la raíz de tu proyecto backend, ejecuta:

```bash
npx @stoplight/prism-cli mock openapi.yaml -p 8081
```

*   `mock`: Le dice a Prism que cree respuestas falsas.
*   `-p 8081`: Define el puerto donde escuchará (puedes cambiarlo).
*   **Modo Dinámico (Recomendado):** Si agregas `-d` al final, Prism no devolverá siempre el mismo dato de ejemplo aburrido, sino que generará datos aleatorios diferentes en cada petición, haciéndolo sentir más como una base de datos viva.

---

## ⚡ 3. El archivo `.http` y la extensión REST Client

Con el mock corriendo, se usa un cliente para enviar peticiones HTTP. En lugar de interfaces pesadas como Postman, se pueden usar archivos de texto plano.

**¿Qué es un archivo `.http` o `.rest`?**
Es un archivo de texto que la extensión **REST Client** de VS Code (o Cursor) sabe interpretar. Te permite escribir peticiones HTTP como si estuvieras redactando un documento.

### 🛠️ Cómo usarlo:

1.  Asegúrate de instalar la extensión "REST Client" (ID: `humao.rest-client`).
2.  Abre el archivo `tests/api_tests.http`.
3.  Verás que definimos variables arriba, como `@baseUrl = http://localhost:8081`.
4.  Arriba de cada bloque que empieza con un verbo (`GET`, `POST`), aparecerá un botón interactivo **"Send Request"**.
5.  Haz clic para ejecutar la petición y ver la respuesta de Prism.

### ✍️ Cómo escribir una petición de prueba:

Sintaxis básica:

```http
### Mi título explicativo
POST {{baseUrl}}/piezas
Content-Type: application/json

{
  "tipo_parte_id": 1, 
  "modelo_id": 2
}
```
*   `###` separa una petición de otra.
*   La primera línea es el Verbo (POST) y la URL.
*   Luego van los Headers (`Content-Type`).
*   Dejas una línea en blanco, y abajo pones el cuerpo (JSON) que quieres enviar.

### 🤖 4. El Robot de Pruebas (Smoke Test con CURL)

Si no quieres ir probando uno por uno, hemos creado un script que automatiza varios comandos `curl` a la vez.

**¿Cómo usarlo?**
Desde la raíz del proyecto, simplemente ejecuta:
```bash
pnpm test
```
Este comando recorrerá los endpoints más importantes y te confirmará en la consola si el servidor (Mock o Real) responde con los códigos de estado correctos (200 OK, 201 Created, etc.).

### 🧩 4.1 Pruebas por archivo (sin correr `pnpm test`)

Puedes ejecutar **scripts individuales** o **módulos específicos** sin pasar por `pnpm test`:

```bash
# Full coverage directo
bash tests/test_all.sh

# Suite modular por área
bash tests/run_all.sh auth
bash tests/run_all.sh prod
bash tests/run_all.sh inv
bash tests/run_all.sh ana

# Auditoría final (escenarios seleccionados)
bash tests/test_senior.sh
```

Y si quieres probar **un archivo puntual** con REST Client:
*   `tests/auth/login.http`
*   `tests/produccion/maniquies.http`
*   `tests/inventario/piezas.http`
*   `tests/analitica/reportes.http`

**Cobertura actual del smoke test:**
*   **Positivos:** valida todos los endpoints definidos en `openapi.yaml`.
*   **Negativos:** cubre autenticación (401), validaciones de parámetros/cuerpo (422) y conflictos (409) donde aplica.

**Notas prácticas:**
*   Los endpoints públicos (`GET /modelos` y `GET /modelos/{id}/descuento`) se prueban sin token.
*   En Prism, algunos errores se fuerzan con el header `Prefer: code=409` para simular conflictos.

---

## 🤖 5. El Futuro: Automatización con Jest y Supertest

1.  *Levanta el servidor real en memoria.*
2.  *Envía un POST simulando la creación de un Maniquí Frankenstein.*
3.  *Verifica (Assert): ¿El servidor me respondió con un código 409 Conflict?*
    *   *Si es SÍ -> La prueba pasa en verde ✅.*
    *   *Si es NO (ej. respondió 200 OK) -> La prueba falla en rojo ❌ (¡Peligro, rompiste el Trigger!).*

### Resumen del Flujo de Trabajo (El Camino del Ninja):
1. Escribes el `openapi.yaml` (El Contrato).
2. Levantas **Prism** y juegas con el archivo `.http` para validar la idea.
3. Escribes las pruebas automatizadas (que fallarán porque no hay código).
4. Escribes el código de tu servidor en Node.js.
5. Ejecutas `pnpm test` hasta que todo esté verde.

¡Y así es como se construye software de nivel profesional! Manten este documento cerca como referencia.