# 🛡️ Guía de Arquitectura: Seguridad y Autenticación

Este documento explica la evolución del sistema de seguridad de **Tecda Maniquí**, desde el control de base de datos hasta el modelo de aplicación profesional.

---

## 🏗️ 1. Modelo actual (Híbrido)

Se utiliza un esquema de **Usuarios de Aplicación** en lugar de usuarios de base de datos (DB Users).

### Motivo del cambio
1.  **Flexibilidad:** Ahora podemos guardar el email del usuario, su nombre completo y si la cuenta está activa.
2.  **Seguridad JWT:** El servidor ya no abre una conexión a la DB por cada usuario que se loguea. En su lugar, usa un **Token JWT** firmado.
3.  **Abstracción:** El usuario final no sabe que existe una base de datos MySQL; solo interactúa con la API.

---

## 🔒 2. Capas de Seguridad

### Nivel 1: El Usuario Técnico (`app_backend`)
El Backend no se conecta como "root". Se conecta con un usuario limitado (`app_backend`) que solo tiene permisos para las tablas de este proyecto. Si el backend fuera hackeado, el atacante no podría borrar otras bases de datos del servidor.

### Nivel 2: RBAC (Control de Acceso basado en Roles)
En la tabla `Usuarios`, cada registro tiene un `rol`:
*   **Vendedor:** Solo accede a catálogos y reportes.
*   **Gerente de Producción:** Puede ejecutar el Stored Procedure de ensamblaje.

### Nivel 3: Hasheo de Contraseñas
Las contraseñas se almacenan con **bcrypt**, lo que evita exponer credenciales aun si la base de datos es comprometida.

---

## 🚀 3. Flujo de Login
1.  El **Frontend** envía `username` y `password`.
2.  El **Backend** busca el `username` en la tabla `Usuarios`.
3.  El **Backend** compara el hash guardado con el password enviado.
4.  Si coinciden, genera un **Token JWT** que contiene el ID y el Rol del usuario.
5.  El **Frontend** guarda ese token y lo envía en el header `Authorization` de cada petición.

---
*Este diseño cumple con los estándares de la industria para aplicaciones escalables y seguras.*
