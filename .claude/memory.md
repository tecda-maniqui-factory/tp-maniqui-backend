# Project Memory & Architecture Decisions

This file tracks important context and architecture decisions for the Tecda Maniquí Backend project.

---

## 📝 Decisions & Resolutions

### 1. Database Codes Alignment
* **Date:** 2026-06-16
* **Context:** The frontend was sending incorrect codes for parts (`BRI`, `BRD`, `PII`, `PID`) which caused the backend to throw `Tipo de pieza no encontrado` (HTTP 404).
* **Decision:** Keep the database catalogs as the source of truth (`BRA-I`, `BRA-D`, `PIE-I`, `PIE-D`) and modify the frontend to match.

### 2. Startup Race Condition
* **Date:** 2026-06-16
* **Context:** `conectarDB()` was not awaited, causing the server to start listening before the DB was ready and creating errors when the `SSEManager` queries database orders during import.
* **Decision:** Wrap server startup in an async function, await `conectarDB()`, and call `sseManager.cargarOrdenesDesdeBD()` deferredly after the database is connected.

### 3. Log Leakage of Secrets
* **Date:** 2026-06-16
* **Context:** `JWT_SECRET` was logged to stdout on startup.
* **Decision:** Remove debug prints to secure logs in production.

### 4. Error Message Redaction
* **Date:** 2026-06-16
* **Context:** Non-operational errors (HTTP 500) leaked database exceptions and structures to the client.
* **Decision:** Redact non-operational error messages from HTTP responses and output a generic "Error interno del servidor", while maintaining full stack traces in internal server logs.

### 5. Access Control to Critical Reports
* **Date:** 2026-06-16
* **Context:** The route `/reportes/stock-critico` lacked the `esGerente` middleware.
* **Decision:** Protect the endpoint with `esGerente` to enforce role-based access control.
