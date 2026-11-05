# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Install pnpm globally
RUN npm install -g pnpm@latest

# Copy package files, lockfile, and workspace config
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY prisma ./prisma/

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Copy application source code
COPY . .

# Generate Prisma Client and build NestJS
RUN pnpm exec prisma generate
RUN pnpm run build

# Production stage
FROM node:20-slim AS production

WORKDIR /app

# Install OpenSSL for runtime Prisma connection
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm@latest

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY prisma ./prisma/

# Install only production dependencies (skip lifecycle scripts because devDependencies like prisma CLI are not present here)
RUN pnpm install --prod --no-frozen-lockfile --ignore-scripts

# Copy built artifacts and generated Prisma Client from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

ENV PORT=3001
EXPOSE 3001

# Start the application
CMD ["node", "dist/main"]
