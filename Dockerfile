# ── Stage 1: Builder ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Install build tools needed by some native modules
RUN apk add --no-cache python3 make g++

# Copy package files first (layer cache)
COPY package.json package-lock.json* ./

# Install all deps — skip postinstall (prisma generate) for now
# to avoid needing DATABASE_URL at build time
RUN npm ci --ignore-scripts

# Copy prisma schema and generate client
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Generate Prisma client without needing a real DB connection
RUN npx prisma generate

# Copy rest of source
COPY . .

# Build with node-server preset
ENV NITRO_PRESET=node-server
# Dummy env vars so any dotenv reads during build don't crash
ENV DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy
ENV DIRECT_URL=postgresql://dummy:dummy@localhost:5432/dummy

RUN npm run build

# ── Stage 2: Production runner ─────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Nitro node-server outputs to .output/
COPY --from=builder /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
