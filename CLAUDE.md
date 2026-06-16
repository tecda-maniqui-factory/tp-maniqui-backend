# CLAUDE.md — Tecda Maniquí Backend Guidelines

This document provides quick reference instructions, build commands, and standards for the Tecda Maniquí Backend service.

## 🛠️ Build and Test Commands

* **Install dependencies:** `pnpm install`
* **Build TypeScript:** `pnpm run build` (runs `tsc`)
* **Typecheck (no emit):** `npx tsc --noEmit`
* **Run unit tests:** `pnpm run test:unit` (runs Node native runner with `tsx` on `tests/unit/**/*.test.ts`)
* **Run integration tests:** `pnpm run test:integration` (runs `bash tests/integration/test_all.sh`)
* **Run all tests:** `pnpm test`
* **Development mode:** `pnpm run dev` (runs `tsx watch src/index.ts`)

---

## 📂 Project Structure

* `src/config/`: App configuration and env schemas (Zod).
* `src/controllers/`: HTTP controllers handling express requests and input validation.
* `src/middleware/`: Authentication, authorization, and error handling middlewares.
* `src/models/`: Database models defined via Sequelize ORM.
* `src/repositories/`: Repository classes encapsulating SQL/Sequelize data access.
* `src/routes/`: Express router definitions.
* `src/services/`: Core business logic coordinating entities and repositories.
* `src/utils/`: Common utilities (logger, custom errors).

---

## 🎨 Code Style and Standards

1. **Type Safety:** Always use strict typing. Avoid `any` castings; prefer `unknown` or concrete interface definitions.
2. **Asynchronous Code:** Always await async functions. Never leave floating promises (e.g., when calling databases or initializers).
3. **Error Handling:** 
   - Wrap async calls in controllers with `asyncHandler`.
   - Throw `AppError` for operational errors (with explicit status codes like 400, 404, etc.).
   - Let the global `errorHandler` handle 500 internal errors to avoid leaking system stack traces.
4. **Security:**
   - Never log raw secrets or credentials (e.g., `JWT_SECRET`).
   - Restrict sensitive endpoints (like reports) using `esGerente` middleware.
   - Use parameterized queries or safe Sequelize ORM syntax to prevent SQL Injection.
