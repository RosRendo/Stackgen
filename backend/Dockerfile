# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install OpenSSL and libc6-compat for Prisma on Alpine
RUN apk add --no-cache libc6-compat openssl

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package definitions and prisma schema
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma/

# Install all dependencies
RUN pnpm install --frozen-lockfile || pnpm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN pnpm exec prisma generate

# Build the NestJS application
RUN pnpm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

RUN apk add --no-cache libc6-compat openssl
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma/

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile || pnpm install --prod

# Copy built artifacts from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

ENV PORT=3001
EXPOSE 3001

# Start the application directly
CMD ["node", "dist/main"]
