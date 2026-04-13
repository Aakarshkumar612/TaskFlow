# syntax=docker/dockerfile:1

# ──────────────────────────────────────────────
# TASKFLOW Backend - Dockerfile
# Uses debian-slim for Prisma compatibility
# ──────────────────────────────────────────────
FROM node:20-slim AS base
WORKDIR /app

# ──────────────────────────────────────────────
# Dependencies
# ──────────────────────────────────────────────
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# ──────────────────────────────────────────────
# Build
# ──────────────────────────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npx prisma generate

COPY . .
RUN npx tsc

# ──────────────────────────────────────────────
# Production
# ──────────────────────────────────────────────
FROM base AS runner
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

RUN groupadd -r appgroup && useradd -r -g appgroup appuser && \
    chown -R appuser:appgroup /app

USER appuser

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:5000/health || exit 1

CMD ["node", "dist/server.js"]
