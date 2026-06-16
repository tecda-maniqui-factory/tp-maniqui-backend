# Security Policy

This document outlines the security posture, vulnerability reporting process, and security practices of the Tecda Maniquí Backend service.

## 🔒 Security Practices

1. **Authentication & Authorization:** All API requests (except public auth endpoints) must include a valid JWT in the `Authorization: Bearer <token>` header. Roles are validated at route level (e.g., `esGerente` middleware).
2. **Environment Variables:** Credentials and secrets (like database passwords and `JWT_SECRET`) must never be hardcoded in source files. They must be loaded securely via system environment variables.
3. **Error Redaction:** Raw database or execution errors are caught by the global error handler (`src/middleware/errorMiddleware.ts`) and redacted before responding to clients, presenting a generic `Error interno del servidor` to avoid information leakage.
4. **SQL Injection Prevention:** Parameterized SQL queries or Sequelize ORM built-in queries are strictly used for database interactions.

## 🛡️ Vulnerability Reporting

If you find a security vulnerability, please report it immediately:
1. Do not open a public issue.
2. Email your findings and reproduction steps to the development lead.
3. A patch will be prepared and deployed before disclosure.
