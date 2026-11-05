# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files, lockfile, AND workspace config (required for pnpm build script approvals)
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY prisma ./prisma/

# Approve build scripts and install all dependencies
RUN pnpm approve-builds --all || true
RUN pnpm install

# Copy application source code
COPY . .

# Generate Prisma Client and build the NestJS application
RUN pnpm exec prisma generate
RUN pnpm run build

# Production stage
FROM node:20-slim AS production

WORKDIR /app

# Install OpenSSL for runtime Prisma connection
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY prisma ./prisma/

# Install only production dependencies
RUN pnpm approve-builds --all || true
RUN pnpm install --prod

# Copy built artifacts from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

ENV PORT=3001
EXPOSE 3001

# Start the application
CMD ["node", "dist/main"]
