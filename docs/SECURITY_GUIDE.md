# 🛡️ Guía de Arquitectura de Seguridad

Este documento describe las capas de seguridad implementadas en la API de Tecda Maniquí, orientadas a proteger la integridad de los datos y la privacidad de los usuarios.

---

## 🏗️ 1. Modelo de Identidad: Aplicación vs. Base de Datos

Hemos migrado de un esquema basado en usuarios de base de datos a un modelo de **Usuarios de Aplicación**.

### Beneficios
*   **Escalabilidad:** El servidor no mantiene conexiones persistentes por usuario.
*   **Enriquecimiento:** Podemos gestionar perfiles complejos (email, nombre real, auditoría) directamente en la tabla `Usuarios`.
*   **Tipado Estricto:** Gracias a TypeScript, la interfaz `IUsuario` garantiza que los datos de identidad se manejen consistentemente en toda la aplicación.

---

## 🔒 2. Estrategia de Defensa en Profundidad

### Nivel 1: Aislamiento de Infraestructura
El backend se comunica con MySQL utilizando una cuenta de servicio limitada (`app_backend`). Esta cuenta solo tiene privilegios sobre la base de datos `tecda_maniqui`, mitigando el riesgo de ataques transversales al servidor.

### Nivel 2: Autenticación JWT (Stateless)
Implementamos **JSON Web Tokens** para la gestión de sesiones:
*   **Firma:** Los tokens son firmados con una clave secreta (`JWT_SECRET`).
*   **Payload:** Incluye `id`, `username` y `rol`.
*   **Expiración:** Los tokens caducan automáticamente a las 8 horas.

### Nivel 3: Control de Acceso basado en Roles (RBAC)
Mediante middlewares (`authMiddleware.ts`), restringimos el acceso según la jerarquía:
*   `esVendedor`: Acceso a operaciones comerciales y consultas.
*   `esGerente`: Acceso total, incluyendo procesos críticos de ensamblaje y gestión de personal.

### Nivel 4: Integridad de Datos (Criptografía)
Nunca almacenamos contraseñas en texto plano. Utilizamos **BCryptJS** con un factor de costo de 10 para el hasheo de credenciales, lo que protege las cuentas incluso en caso de una fuga de datos.

---

## 🚀 3. Flujo de Seguridad en Código (TypeScript)

1.  **Validación de Esquema:** `validatorMiddleware.ts` utiliza `express-validator` para sanear y validar que las entradas cumplan con el formato esperado antes de llegar a los servicios.
2.  **Verificación de Token:** El middleware `verifyToken` extrae y valida el JWT, inyectando el objeto `user` en el request (ver `AuthRequest` en los tipos).
3.  **Lógica de Negocio Protegida:** Los servicios (`src/services/`) asumen que la entrada ya ha sido sanitizada, pero validan reglas de negocio adicionales (ej. no duplicar nombres de usuario).

---
*Diseñado bajo estándares modernos de seguridad para aplicaciones industriales.*
