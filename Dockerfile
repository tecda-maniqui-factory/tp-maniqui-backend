# ==============================================================================
# 🐳 Dockerfile - Backend (tp-maniqui-backend)
# Descripción: Compila el backend de Node.js/Express y lo corre en produccion.
# ==============================================================================

# --- Stage 1: Construcción ---
FROM node:22-slim AS builder

# Habilitar corepack e instalar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copiar archivos base de dependencias y workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json typedoc.json openapi.yaml ./
COPY src ./src

# Instalar dependencias e iniciar compilacion de TypeScript
RUN pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm build

# --- Stage 2: Producción ---
FROM node:22-slim

# Establecer meta-informacion legible en el contenedor
LABEL project="tecda-maniqui"
LABEL component="backend"
LABEL description="API REST construida con Express y TypeScript, corriendo sobre Node.js 22."

WORKDIR /app

# Asegurar que el directorio /app pertenezca al usuario node
RUN chown -R node:node /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copiar el build compilado y archivos necesarios asignándoles propiedad al usuario node
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder --chown=node:node /app/openapi.yaml ./openapi.yaml

# Cambiar al usuario node
USER node

# Instalar unicamente las dependencias de produccion
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

EXPOSE 8081

CMD ["node", "dist/index.js"]
