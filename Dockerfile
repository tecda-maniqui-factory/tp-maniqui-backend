# --- Stage 1: Build ---
FROM node:22-slim AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json typedoc.json ./
COPY src ./src

RUN pnpm install --frozen-lockfile
RUN pnpm build

# --- Stage 2: Production ---
FROM node:22-slim

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/openapi.yaml ./openapi.yaml

RUN pnpm install --prod --frozen-lockfile

EXPOSE 8081

CMD ["node", "dist/index.js"]
