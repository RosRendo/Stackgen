# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm@latest

# Copy package definitions, workspace config, and prisma schema
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY prisma ./prisma/

# Install all dependencies
RUN pnpm install --no-frozen-lockfile

# Copy application source code
COPY . .

# Generate Prisma Client and build NestJS
RUN pnpm exec prisma generate
RUN pnpm run build

# Prune devDependencies to keep only production packages
RUN pnpm prune --prod --no-optional

# Production stage
FROM node:20-slim AS production

WORKDIR /app

# Install OpenSSL for runtime Prisma connection
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy compiled code, production node_modules, and prisma schema from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

ENV PORT=3001
EXPOSE 3001

# Start the application
CMD ["node", "dist/main"]
