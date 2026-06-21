# ── Stage 1: Builder ──────────────────────────────────────────────────────────
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Install system deps needed by native modules (node-gyp, canvas, etc.)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    openssl \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json ./

# Install all deps fresh — package-lock.json dikecualikan via .dockerignore
# karena dibuat di Windows dan hanya berisi binary platform Windows.
# npm install di sini akan resolve binary Linux yang benar.
RUN npm install --ignore-scripts

# Copy prisma schema then generate client
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Generate Prisma client — needs a DATABASE_URL but only for config parsing
ENV DATABASE_URL=postgresql://x:x@localhost:5432/x
ENV DIRECT_URL=postgresql://x:x@localhost:5432/x
RUN npx prisma generate

# Copy full source
COPY . .

# Build args untuk VITE_ vars yang perlu di-embed saat build
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Build
ENV NITRO_PRESET=node-server
# Increase Node.js heap for large builds
ENV NODE_OPTIONS=--max-old-space-size=4096
RUN npm run build

# ── Stage 2: Production runner ─────────────────────────────────────────────────
FROM node:22-bookworm-slim AS runner

WORKDIR /app

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

COPY --from=builder /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
