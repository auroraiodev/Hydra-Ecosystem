# =============================================================================
# Hydra Admin — Combined Dockerfile (frontend + NestJS backend)
#
# Port layout inside the container:
#   3001  ws-proxy (public, exposed to Traefik/Coolify)
#   3002  NestJS backend (internal)
#   3010  Next.js standalone (internal)
# =============================================================================

# ---------------------------------------------------------------------------
# Stage 1: Builder
# ---------------------------------------------------------------------------
FROM oven/bun:1.3 AS builder
WORKDIR /workspace

# Build-time env vars injected by Coolify for NEXT_PUBLIC_* values
ARG NEXT_PUBLIC_ADMIN_URL
ARG NEXT_PUBLIC_FRONTEND_URL
ARG NEXT_PUBLIC_SELLER_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_BACKEND_API_URL
ARG NEXT_PUBLIC_AUTH_SERVICE_URL
ARG NEXT_PUBLIC_APP_URL
# Hydtra-Chat service URL (injected at build-time; Coolify must pass this)
ARG CHAT_SERVICE_URL=http://hydra-chat:3007

ENV NEXT_PUBLIC_ADMIN_URL=$NEXT_PUBLIC_ADMIN_URL \
    NEXT_PUBLIC_FRONTEND_URL=$NEXT_PUBLIC_FRONTEND_URL \
    NEXT_PUBLIC_SELLER_URL=$NEXT_PUBLIC_SELLER_URL \
    NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_BACKEND_API_URL=$NEXT_PUBLIC_BACKEND_API_URL \
    NEXT_PUBLIC_AUTH_SERVICE_URL=$NEXT_PUBLIC_AUTH_SERVICE_URL \
    NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    CHAT_SERVICE_URL=$CHAT_SERVICE_URL

# ── 1. Frontend deps (cached layer) ──────────────────────────────────────────
COPY app/package.json app/bun.lock* ./app/
COPY theme/package.json theme/bun.lock* ./theme/

WORKDIR /workspace/app
RUN bun install --frozen-lockfile

# ── 2. Frontend source ────────────────────────────────────────────────────────
WORKDIR /workspace
COPY app ./app
COPY theme ./theme

# Inline local theme package so Next.js can resolve arcane-vault-ui
RUN rm -rf /workspace/app/node_modules/arcane-vault-ui && \
    mkdir -p /workspace/app/node_modules/arcane-vault-ui && \
    find /workspace/theme -maxdepth 1 -mindepth 1 ! -name 'node_modules' \
      -exec cp -r {} /workspace/app/node_modules/arcane-vault-ui/ \;

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=1024"

WORKDIR /workspace/app
RUN bun run build

# ── 3. Backend (NestJS) ───────────────────────────────────────────────────────
WORKDIR /workspace
COPY backend/package.json backend/bun.lock* ./backend/
COPY backend/ ./backend/

WORKDIR /workspace/backend
RUN bun install && \
    bunx prisma generate && \
    bun scripts/fix-prisma-client-resolution.cjs && \
    bun run build:api:only

# ---------------------------------------------------------------------------
# Stage 2: Runner
# ---------------------------------------------------------------------------
FROM oven/bun:1.3-slim AS runner
WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends ca-certificates curl && \
    rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"
# NestJS is co-located in this container — route chat/WS to localhost
ENV CHAT_SERVICE_URL=http://127.0.0.1:3002

# Next.js standalone output
COPY --from=builder /workspace/app/.next/standalone ./
COPY --from=builder /workspace/app/.next/static ./.next/static
COPY --from=builder /workspace/app/public ./public

# ws-proxy (public entry point on :3001)
COPY ws-proxy.js ./ws-proxy.js

# NestJS backend
COPY --from=builder /workspace/backend/dist ./backend/dist
COPY --from=builder /workspace/backend/node_modules ./backend/node_modules
COPY --from=builder /workspace/backend/package.json ./backend/package.json
COPY --from=builder /workspace/backend/prisma ./backend/prisma

EXPOSE 3001
EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3002/api/v1/health || exit 1

# NestJS on 3002 (background), Next.js on 3010 (background), ws-proxy on 3001 (foreground)
CMD bunx prisma migrate deploy --schema backend/prisma/schema.prisma 2>/dev/null; \
    PORT=3002 bun backend/dist/main.js & \
    PORT=3010 bun server.js & \
    PORT=3001 NEXT_PORT=3010 bun ws-proxy.js
