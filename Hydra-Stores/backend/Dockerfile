FROM oven/bun:1.3 AS builder
WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

COPY prisma.config.ts ./
COPY prisma ./prisma
COPY scripts ./scripts
RUN bunx prisma generate && bun scripts/fix-prisma-client-resolution.cjs

COPY src ./src
COPY apps ./apps
COPY libs ./libs
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY nest-cli.json ./
COPY webpack.config.cjs ./

ENV NODE_OPTIONS="--max-old-space-size=1024"
RUN bun run build:api:only

FROM oven/bun:1.3-slim AS runner
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=3002

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/scripts ./scripts
COPY docker-entrypoint.sh ./
RUN sed -i 's/\r$//' docker-entrypoint.sh && chmod +x docker-entrypoint.sh

EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3002/api/v1/health || exit 1

ENTRYPOINT ["/bin/sh", "docker-entrypoint.sh"]
