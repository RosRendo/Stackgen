import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class AiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || 'dummy_key',
    });
  }

  private getMockBlueprint(level: string) {
    const blueprints: Record<string, any> = {

      // ─────────────────────────────────────────────────────────────
      // MVP  — Ship fast, validate idea, solo / 1–2 person team
      // ─────────────────────────────────────────────────────────────
      MVP: {
        techStack: [
          // Frontend
          { name: 'Next.js',      simpleIconSlug: 'nextdotjs',   rationale: 'Full-stack React framework with App Router & SSR out of the box.',       category: 'Frontend' },
          { name: 'Tailwind CSS', simpleIconSlug: 'tailwindcss', rationale: 'Utility-first CSS. No separate stylesheet needed — fast prototyping.', category: 'Frontend' },
          { name: 'Shadcn UI',    simpleIconSlug: 'shadcnui',    rationale: 'Copy-paste accessible components built on Radix UI — no npm bloat.',     category: 'Frontend' },
          // Database / Backend
          { name: 'Supabase',     simpleIconSlug: 'supabase',    rationale: 'All-in-one BaaS — PostgreSQL DB, Auth, Storage, and Realtime in one.',   category: 'Database' },
          // DevOps
          { name: 'Vercel',       simpleIconSlug: 'vercel',      rationale: 'Zero-config git-push deploy with preview URLs on every pull request.',    category: 'DevOps'   },
          // Testing
          { name: 'Vitest',       simpleIconSlug: 'vitest',      rationale: 'Lightning-fast unit testing with native ESM support, no config needed.', category: 'Testing'  },
        ],
        checklist: [
          // ── Frontend ──
          { id: 'mvp-f1', category: 'Frontend', title: 'Init Next.js project & configure Tailwind', description: 'Run `npx create-next-app@latest`. Set up Tailwind v4 and configure the global CSS file with your brand colors, font (e.g., Inter via next/font), and dark mode class.', relatedTech: ['Next.js', 'Tailwind CSS'], status: 'TODO' },
          { id: 'mvp-f2', category: 'Frontend', title: 'Install & configure Shadcn UI', description: 'Run `npx shadcn@latest init`. Add Button, Card, Input, Label, Dialog, and Toast components. Set up the global Toaster in your root layout.', relatedTech: ['Shadcn UI', 'Radix UI'], status: 'TODO' },
          { id: 'mvp-f3', category: 'Frontend', title: 'Build core pages & navigation', description: 'Create `/` (landing), `/dashboard`, `/auth/login`, and `/auth/signup` pages. Build a responsive Navbar and Sidebar using Shadcn components. Add a 404 and loading skeleton.', relatedTech: ['Next.js', 'Tailwind CSS'], status: 'TODO' },
          // ── Database / Auth ──
          { id: 'mvp-d1', category: 'Database', title: 'Setup Supabase project & schema', description: 'Create a Supabase project. In the Table Editor, create your core tables (e.g. `profiles`, `items`). Enable Row Level Security on all tables. Add `.env.local` with your Supabase URL and anon key.', relatedTech: ['Supabase', 'PostgreSQL'], status: 'TODO' },
          { id: 'mvp-d2', category: 'Database', title: 'Configure Supabase Auth (OAuth + Email)', description: 'Enable Email/Password and Google OAuth in Supabase Auth settings. Create a Next.js middleware to protect `/dashboard` routes. Handle sessions with `@supabase/ssr`.', relatedTech: ['Supabase', 'Next.js'], status: 'TODO' },
          // ── DevOps ──
          { id: 'mvp-o1', category: 'DevOps', title: 'Deploy to Vercel & configure environment', description: 'Link your GitHub repo to a Vercel project. Add all `NEXT_PUBLIC_*` and server-side env vars in the Vercel dashboard. Enable preview deployments on every PR branch.', relatedTech: ['Vercel', 'GitHub'], status: 'TODO' },
          { id: 'mvp-o2', category: 'DevOps', title: 'Add custom domain & HTTPS', description: 'Point your domain DNS to Vercel nameservers. Vercel automatically provisions an SSL certificate via Let\'s Encrypt. Verify www → non-www redirect works correctly.', relatedTech: ['Vercel'], status: 'TODO' },
          // ── Testing ──
          { id: 'mvp-t1', category: 'Testing', title: 'Setup Vitest for unit tests', description: 'Install Vitest and add a `vitest.config.ts`. Write tests for utility functions and form validation helpers. Add `npm test` to your CI step in GitHub Actions.', relatedTech: ['Vitest'], status: 'TODO' },
        ],
        nodes: [
          { id: 'n1', position: { x: 250, y: 0   }, data: { label: 'User Browser' } },
          { id: 'n2', position: { x: 250, y: 150  }, data: { label: 'Next.js App (Vercel)' } },
          { id: 'n3', position: { x: 250, y: 300  }, data: { label: 'Supabase (Auth + DB)' } },
        ],
        edges: [
          { id: 'e1', source: 'n1', target: 'n2' },
          { id: 'e2', source: 'n2', target: 'n3' },
        ],
      },

      // ─────────────────────────────────────────────────────────────
      // Startup  — Custom backend, real team, production-ready
      // ─────────────────────────────────────────────────────────────
      Startup: {
        techStack: [
          // Frontend
          { name: 'Next.js',      simpleIconSlug: 'nextdotjs',   rationale: 'SSR + API routes in one project. Perfect for B2B SaaS dashboards.',     category: 'Frontend' },
          { name: 'Tailwind CSS', simpleIconSlug: 'tailwindcss', rationale: 'Utility-first styling — consistent design at scale with no CSS files.', category: 'Frontend' },
          { name: 'Zustand',      simpleIconSlug: 'zustand',     rationale: 'Minimal global state management — simple, fast, no boilerplate.',       category: 'Frontend' },
          // Backend
          { name: 'NestJS',       simpleIconSlug: 'nestjs',      rationale: 'Modular, decorator-based Node.js framework. Scales with your team.',    category: 'Backend'  },
          { name: 'Prisma',       simpleIconSlug: 'prisma',      rationale: 'Type-safe ORM with auto-generated migrations and client.',               category: 'Backend'  },
          // Database
          { name: 'PostgreSQL',   simpleIconSlug: 'postgresql',  rationale: 'Proven relational database — ACID compliant, great for SaaS.',          category: 'Database' },
          { name: 'Redis',        simpleIconSlug: 'redis',       rationale: 'In-memory cache for sessions, rate limiting, and real-time queues.',    category: 'Database' },
          // DevOps
          { name: 'Docker',       simpleIconSlug: 'docker',      rationale: 'Containerize every service for identical dev/prod environments.',       category: 'DevOps'   },
          { name: 'GitHub Actions', simpleIconSlug: 'githubactions', rationale: 'Free CI/CD for open-source — run tests & lint on every push.',     category: 'DevOps'   },
          // Testing
          { name: 'Jest',         simpleIconSlug: 'jest',        rationale: 'Standard Node.js testing framework, built into NestJS by default.',    category: 'Testing'  },
          { name: 'Supertest',    simpleIconSlug: 'jest',        rationale: 'HTTP integration testing for your NestJS controllers and endpoints.',  category: 'Testing'  },
        ],
        checklist: [
          // ── Frontend ──
          { id: 'st-f1', category: 'Frontend', title: 'Bootstrap Next.js with Zustand state', description: 'Init the Next.js frontend. Configure Zustand stores for user session and global UI state. Set up Axios with request/response interceptors that attach the JWT Bearer token automatically.', relatedTech: ['Next.js', 'Zustand', 'Axios'], status: 'TODO' },
          { id: 'st-f2', category: 'Frontend', title: 'Build dashboard layout & navigation', description: 'Create the authenticated app shell: a collapsible Sidebar, Topbar with user avatar dropdown, and a main content area. Protect all `/dashboard/*` routes using Next.js middleware.', relatedTech: ['Next.js', 'Tailwind CSS'], status: 'TODO' },
          // ── Backend ──
          { id: 'st-b1', category: 'Backend', title: 'Initialize NestJS with modules & Swagger', description: 'Generate the NestJS project. Create Auth, Users, and core feature modules. Configure global ValidationPipe with class-validator DTOs. Enable Swagger at `/api/docs` for team reference.', relatedTech: ['NestJS', 'Swagger', 'TypeScript'], status: 'TODO' },
          { id: 'st-b2', category: 'Backend', title: 'Implement JWT authentication & guards', description: 'Create a JWT strategy using @nestjs/passport. Build AuthGuard and RolesGuard for protected routes. Implement refresh token rotation: store refresh tokens in Redis with a short TTL.', relatedTech: ['NestJS', 'JWT', 'Redis'], status: 'TODO' },
          { id: 'st-b3', category: 'Backend', title: 'Design Prisma schema & seed data', description: 'Write `schema.prisma` with User, Session, and your core business models. Generate the Prisma client. Write a `seed.ts` file to populate local dev data. Run `prisma migrate dev` on each schema change.', relatedTech: ['Prisma', 'PostgreSQL'], status: 'TODO' },
          // ── Database ──
          { id: 'st-d1', category: 'Database', title: 'Provision PostgreSQL & Redis via Docker', description: 'Write a `docker-compose.yml` with PostgreSQL and Redis services. Use named volumes for data persistence. Add a health-check so the API waits for DB readiness before starting.', relatedTech: ['Docker', 'PostgreSQL', 'Redis'], status: 'TODO' },
          { id: 'st-d2', category: 'Database', title: 'Configure PgBouncer connection pooling', description: 'Add PgBouncer as a sidecar container in your compose file. Set pool_mode to `transaction`. Point your Prisma DATABASE_URL at PgBouncer (port 6432) to prevent connection exhaustion under load.', relatedTech: ['PgBouncer', 'PostgreSQL'], status: 'TODO' },
          // ── DevOps ──
          { id: 'st-o1', category: 'DevOps', title: 'Create GitHub Actions CI pipeline', description: 'Create `.github/workflows/ci.yml` that runs on every push and PR. Steps: checkout → install → lint → test → build. Cache `node_modules` between runs to speed up the pipeline.', relatedTech: ['GitHub Actions', 'Docker'], status: 'TODO' },
          { id: 'st-o2', category: 'DevOps', title: 'Configure production environment secrets', description: 'Use GitHub Secrets for DATABASE_URL, JWT_SECRET, REDIS_URL. Use a `.env.example` file (no real values) committed to repo. Never commit `.env` files — add them to `.gitignore`.', relatedTech: ['GitHub Actions'], status: 'TODO' },
          // ── Testing ──
          { id: 'st-t1', category: 'Testing', title: 'Write unit tests for services & DTOs', description: 'Use Jest with NestJS TestingModule. Mock Prisma client with `jest-mock-extended`. Target 70%+ coverage on all service methods. Run `npx jest --coverage` in the CI pipeline.', relatedTech: ['Jest', 'NestJS'], status: 'TODO' },
          { id: 'st-t2', category: 'Testing', title: 'Write API integration tests with Supertest', description: 'Spin up an in-memory NestJS app in tests. Use Supertest to hit real HTTP endpoints. Test the full auth flow: register → login → access protected route → refresh token.', relatedTech: ['Supertest', 'Jest'], status: 'TODO' },
          // ── Security ──
          { id: 'st-s1', category: 'Security', title: 'Implement rate limiting & CORS policy', description: 'Add `@nestjs/throttler` with a limit of 20 req/min per IP. Configure CORS to only allow your frontend domain. Set security headers (Helmet.js) for XSS, clickjacking, and content-type sniffing protection.', relatedTech: ['NestJS', 'Helmet.js'], status: 'TODO' },
        ],
        nodes: [
          { id: 'n1', position: { x: 250, y: 0   }, data: { label: 'User Browser' } },
          { id: 'n2', position: { x: 250, y: 150  }, data: { label: 'Next.js Frontend' } },
          { id: 'n3', position: { x: 250, y: 300  }, data: { label: 'NestJS API' } },
          { id: 'n4', position: { x: 100, y: 450  }, data: { label: 'PostgreSQL' } },
          { id: 'n5', position: { x: 400, y: 450  }, data: { label: 'Redis Cache' } },
        ],
        edges: [
          { id: 'e1', source: 'n1', target: 'n2' },
          { id: 'e2', source: 'n2', target: 'n3' },
          { id: 'e3', source: 'n3', target: 'n4' },
          { id: 'e4', source: 'n3', target: 'n5' },
        ],
      },

      // ─────────────────────────────────────────────────────────────
      // Professional  — Microservices, event-driven, cloud-native
      // ─────────────────────────────────────────────────────────────
      Professional: {
        techStack: [
          // Frontend
          { name: 'React',        simpleIconSlug: 'react',          rationale: 'SPA architecture with Vite for hot-reload and module federation.',        category: 'Frontend' },
          { name: 'Vite',         simpleIconSlug: 'vite',           rationale: 'Blazing fast HMR and build tool — replaces Create React App.',            category: 'Frontend' },
          { name: 'React Query',  simpleIconSlug: 'reactquery',     rationale: 'Server state management with caching, background sync, and prefetch.',   category: 'Frontend' },
          // Backend
          { name: 'NestJS',       simpleIconSlug: 'nestjs',         rationale: 'API Gateway + microservice orchestration with TCP/Redis transport.',      category: 'Backend'  },
          { name: 'RabbitMQ',     simpleIconSlug: 'rabbitmq',       rationale: 'AMQP message broker for async event-driven communication.',               category: 'Backend'  },
          { name: 'Prisma',       simpleIconSlug: 'prisma',         rationale: 'Type-safe ORM shared across multiple microservices.',                     category: 'Backend'  },
          // Database
          { name: 'PostgreSQL',   simpleIconSlug: 'postgresql',     rationale: 'Primary relational store with HA read-replicas on AWS RDS.',             category: 'Database' },
          { name: 'Redis',        simpleIconSlug: 'redis',          rationale: 'Distributed cache, pub/sub for real-time, and session storage.',          category: 'Database' },
          // DevOps
          { name: 'Docker',       simpleIconSlug: 'docker',         rationale: 'Multi-stage Dockerfiles for minimal, secure production images.',          category: 'DevOps'   },
          { name: 'Terraform',    simpleIconSlug: 'terraform',      rationale: 'IaC for reproducible AWS infrastructure — VPC, ECS, RDS, ALB.',          category: 'DevOps'   },
          { name: 'GitHub Actions', simpleIconSlug: 'githubactions', rationale: 'Full CI/CD pipeline: test → build → push to ECR → deploy to ECS.',     category: 'DevOps'   },
          // Testing
          { name: 'Jest',         simpleIconSlug: 'jest',           rationale: 'Unit and integration testing for all microservices.',                    category: 'Testing'  },
          { name: 'Playwright',   simpleIconSlug: 'playwright',     rationale: 'End-to-end browser testing — real user flows on Chrome, Firefox, Safari.', category: 'Testing' },
          // Security
          { name: 'AWS Secrets Manager', simpleIconSlug: 'amazonaws', rationale: 'Centralized secret rotation — no secrets in env vars or git.',        category: 'DevOps'   },
        ],
        checklist: [
          // ── Frontend ──
          { id: 'pr-f1', category: 'Frontend', title: 'Setup React SPA with Vite & Module Federation', description: 'Init with `npm create vite@latest`. Configure Webpack Module Federation plugin so distinct feature areas (Admin, Dashboard, Billing) can be deployed independently without breaking the shell.', relatedTech: ['React', 'Vite', 'Webpack'], status: 'TODO' },
          { id: 'pr-f2', category: 'Frontend', title: 'Configure React Query for server state', description: 'Install TanStack Query. Wrap the app in `QueryClientProvider`. Create typed query hooks per resource (e.g. `useUserProfile`, `useOrders`). Configure stale time, retry logic, and error boundaries.', relatedTech: ['React Query', 'TypeScript'], status: 'TODO' },
          // ── Backend ──
          { id: 'pr-b1', category: 'Backend', title: 'Initialize NestJS API Gateway with RBAC', description: 'Setup the NestJS gateway. Implement JWT strategy + custom RolesGuard with decorators (`@Roles("admin")`). Route requests to internal microservices using NestJS microservice TCP transport.', relatedTech: ['NestJS', 'JWT', 'TypeScript'], status: 'TODO' },
          { id: 'pr-b2', category: 'Backend', title: 'Implement RabbitMQ async event bus', description: 'Deploy RabbitMQ via Docker. Define topic exchanges and durable queues per domain (user-events, order-events). Implement publish-subscribe pattern in NestJS using `@nestjs/microservices`.', relatedTech: ['RabbitMQ', 'AMQP', 'NestJS'], status: 'TODO' },
          { id: 'pr-b3', category: 'Backend', title: 'Build domain microservices (Auth, Orders, Notifications)', description: 'Create separate NestJS apps for Auth, Orders, and Notifications. Each service owns its DB schema in Prisma. Services communicate only via RabbitMQ events — no direct HTTP calls between services.', relatedTech: ['NestJS', 'Prisma', 'RabbitMQ'], status: 'TODO' },
          // ── Database ──
          { id: 'pr-d1', category: 'Database', title: 'Provision AWS RDS PostgreSQL with read replicas', description: 'Use Terraform to create a Multi-AZ RDS PostgreSQL instance. Add 1–2 read replicas for reporting queries. Point Prisma `DATABASE_URL` to the writer, `REPLICA_URL` to the reader endpoint.', relatedTech: ['PostgreSQL', 'Terraform', 'AWS RDS'], status: 'TODO' },
          { id: 'pr-d2', category: 'Database', title: 'Configure Redis ElastiCache cluster', description: 'Use Terraform to deploy an AWS ElastiCache Redis cluster in a private subnet. Configure NestJS cache manager to use Redis for API response caching. Set TTLs per endpoint based on data freshness requirements.', relatedTech: ['Redis', 'AWS ElastiCache', 'Terraform'], status: 'TODO' },
          // ── DevOps ──
          { id: 'pr-o1', category: 'DevOps', title: 'Write multi-stage Dockerfiles for all services', description: 'Create a Dockerfile per service using multi-stage builds: `builder` stage installs deps + compiles TypeScript, `production` stage copies only the `dist/` folder to an Alpine base. Final image should be under 150MB.', relatedTech: ['Docker', 'Alpine'], status: 'TODO' },
          { id: 'pr-o2', category: 'DevOps', title: 'Provision AWS ECS + ALB via Terraform', description: 'Write Terraform modules for: VPC with public/private subnets, NAT Gateway, ECR repositories, ECS Fargate cluster, Task Definitions per service, and an Application Load Balancer with path-based routing.', relatedTech: ['Terraform', 'AWS ECS', 'AWS ALB'], status: 'TODO' },
          { id: 'pr-o3', category: 'DevOps', title: 'Build full CI/CD pipeline with GitHub Actions', description: 'Create a workflow that: runs lint + tests → builds Docker image → pushes to ECR → updates the ECS task definition → triggers a rolling deployment. Use GitHub OIDC to authenticate with AWS — no long-lived keys needed.', relatedTech: ['GitHub Actions', 'AWS ECR', 'AWS ECS'], status: 'TODO' },
          // ── Testing ──
          { id: 'pr-t1', category: 'Testing', title: 'Write unit & integration tests for all services', description: 'Use Jest TestingModule for each service. Mock RabbitMQ transport. Write integration tests that use a real in-memory SQLite database via Prisma. Target 80%+ branch coverage across all modules.', relatedTech: ['Jest', 'NestJS', 'Prisma'], status: 'TODO' },
          { id: 'pr-t2', category: 'Testing', title: 'Implement Playwright E2E tests', description: 'Write end-to-end flows: user signup → login → complete core action → logout. Run in CI against a staging environment. Configure Playwright to generate HTML reports and screenshots on failure.', relatedTech: ['Playwright', 'GitHub Actions'], status: 'TODO' },
          // ── Security ──
          { id: 'pr-s1', category: 'Security', title: 'Centralize secrets with AWS Secrets Manager', description: 'Migrate all secrets (DB password, JWT secret, API keys) from env vars to AWS Secrets Manager. Use IAM roles for the ECS Task to read secrets at runtime — zero secrets in your codebase or CI environment.', relatedTech: ['AWS Secrets Manager', 'Terraform', 'IAM'], status: 'TODO' },
          { id: 'pr-s2', category: 'Security', title: 'Configure WAF rules & DDoS protection', description: 'Attach AWS WAF to the Application Load Balancer. Enable managed rule groups for SQL injection, XSS, and known bad IPs. Enable AWS Shield Standard (free) for DDoS protection at the network layer.', relatedTech: ['AWS WAF', 'AWS Shield'], status: 'TODO' },
        ],
        nodes: [
          { id: 'n1', position: { x: 250, y: 0   }, data: { label: 'Web Client (React SPA)' } },
          { id: 'n2', position: { x: 250, y: 150  }, data: { label: 'NestJS API Gateway' } },
          { id: 'n3', position: { x: 80,  y: 300  }, data: { label: 'Auth Service' } },
          { id: 'n4', position: { x: 420, y: 300  }, data: { label: 'Orders Service' } },
          { id: 'n5', position: { x: 250, y: 450  }, data: { label: 'RabbitMQ Event Bus' } },
          { id: 'n6', position: { x: 250, y: 600  }, data: { label: 'PostgreSQL (AWS RDS)' } },
          { id: 'n7', position: { x: 500, y: 600  }, data: { label: 'Redis (ElastiCache)' } },
        ],
        edges: [
          { id: 'e1', source: 'n1', target: 'n2' },
          { id: 'e2', source: 'n2', target: 'n3' },
          { id: 'e3', source: 'n2', target: 'n4' },
          { id: 'e4', source: 'n3', target: 'n5' },
          { id: 'e5', source: 'n4', target: 'n5' },
          { id: 'e6', source: 'n3', target: 'n6' },
          { id: 'e7', source: 'n4', target: 'n6' },
          { id: 'e8', source: 'n2', target: 'n7' },
        ],
      },

      // ─────────────────────────────────────────────────────────────
      // Enterprise  — Global scale, compliance, full observability
      // ─────────────────────────────────────────────────────────────
      Enterprise: {
        techStack: [
          // Frontend
          { name: 'React (MFE)',    simpleIconSlug: 'react',           rationale: 'Micro-frontend shell: teams deploy features independently.',               category: 'Frontend' },
          { name: 'TypeScript',     simpleIconSlug: 'typescript',      rationale: 'Strict typing across all MFEs and shared contracts — reduces runtime bugs.', category: 'Frontend' },
          // Backend
          { name: 'Spring Boot',    simpleIconSlug: 'springboot',      rationale: 'Enterprise Java — battle-tested for financial and regulated industries.',    category: 'Backend'  },
          { name: 'Go',             simpleIconSlug: 'go',              rationale: 'High-throughput analytics workers — minimal memory, maximum concurrency.',   category: 'Backend'  },
          { name: 'gRPC',           simpleIconSlug: 'grpc',            rationale: 'Binary protocol for low-latency inter-service communication.',               category: 'Backend'  },
          // Database
          { name: 'PostgreSQL',     simpleIconSlug: 'postgresql',      rationale: 'Core transactional store — multi-region replication via Patroni.',           category: 'Database' },
          { name: 'Apache Kafka',   simpleIconSlug: 'apachekafka',     rationale: 'Event streaming: replay any domain event, audit log, CQRS/ES pattern.',     category: 'Database' },
          { name: 'Cassandra',      simpleIconSlug: 'apachecassandra', rationale: 'Multi-region NoSQL for petabyte-scale write-heavy time-series data.',        category: 'Database' },
          { name: 'Elasticsearch',  simpleIconSlug: 'elasticsearch',   rationale: 'Full-text search and log aggregation across all services.',                 category: 'Database' },
          // DevOps
          { name: 'Kubernetes',     simpleIconSlug: 'kubernetes',      rationale: 'Container orchestration: auto-scaling, self-healing, zero-downtime deploys.', category: 'DevOps' },
          { name: 'Terraform',      simpleIconSlug: 'terraform',       rationale: 'IaC for every AWS resource — EKS, RDS, Kafka MSK, VPCs, IAM.',              category: 'DevOps'  },
          { name: 'ArgoCD',         simpleIconSlug: 'argo',            rationale: 'GitOps continuous delivery — cluster state always mirrors your Git repo.',    category: 'DevOps'  },
          // Testing
          { name: 'JUnit 5',        simpleIconSlug: 'junit5',          rationale: 'Standard Java testing framework for Spring Boot services.',                  category: 'Testing' },
          { name: 'Playwright',     simpleIconSlug: 'playwright',      rationale: 'E2E browser testing across all MFE apps in a real browser.',                category: 'Testing' },
          { name: 'k6',             simpleIconSlug: 'k6',              rationale: 'Load testing — define SLOs and verify your system meets them under stress.', category: 'Testing' },
          // Security
          { name: 'Istio',          simpleIconSlug: 'istio',           rationale: 'Service mesh — mTLS between all pods, traffic policies, and circuit breaking.', category: 'Security' },
          { name: 'HashiCorp Vault', simpleIconSlug: 'vault',          rationale: 'Dynamic secrets — DB credentials auto-rotate, API keys expire automatically.', category: 'Security' },
          // Monitoring
          { name: 'Datadog',        simpleIconSlug: 'datadog',         rationale: 'APM, metrics, logs, and distributed traces in one unified platform.',        category: 'DevOps'  },
        ],
        checklist: [
          // ── Frontend ──
          { id: 'en-f1', category: 'Frontend', title: 'Design & build the MFE shell application', description: 'Create the host shell app with Webpack Module Federation. It loads remote MFE modules at runtime from different deployment URLs. Define shared libraries (React, React Router, design system) to avoid duplication.', relatedTech: ['React', 'TypeScript', 'Webpack'], status: 'TODO' },
          { id: 'en-f2', category: 'Frontend', title: 'Publish shared design system as private NPM package', description: 'Extract all UI components (Button, Table, Modal, Charts) into a monorepo package. Publish to GitHub Packages or npm. Each MFE imports from the package — one place to update branding across all apps.', relatedTech: ['TypeScript', 'React'], status: 'TODO' },
          { id: 'en-f3', category: 'Frontend', title: 'Implement multi-tenant routing & white-labeling', description: 'Read tenant from subdomain or JWT claim. Load tenant-specific theme variables (colors, logo) from a config API. Ensure all pages render correctly for each tenant without code duplication.', relatedTech: ['React', 'TypeScript'], status: 'TODO' },
          // ── Backend ──
          { id: 'en-b1', category: 'Backend', title: 'Bootstrap Spring Boot core domain services', description: 'Create a multi-module Maven/Gradle project. Each bounded context (Users, Orders, Billing, Inventory) is a separate Spring Boot module. Use Spring Cloud Gateway as the API Gateway with JWT validation at the edge.', relatedTech: ['Spring Boot', 'Java', 'gRPC'], status: 'TODO' },
          { id: 'en-b2', category: 'Backend', title: 'Build Go analytics worker services', description: 'Write Go services for high-frequency telemetry ingestion (millions of events/day). Use goroutines and channels for concurrent event processing. Expose gRPC interfaces consumed by the Spring services via Protobuf contracts.', relatedTech: ['Go', 'gRPC', 'Protobuf'], status: 'TODO' },
          { id: 'en-b3', category: 'Backend', title: 'Implement CQRS pattern with Kafka Outbox', description: 'Separate read models (query-side) from write models (command-side). Use the Transactional Outbox Pattern: write events to an `outbox` table atomically with your DB transaction, then relay to Kafka via Debezium CDC.', relatedTech: ['Apache Kafka', 'Spring Boot', 'Debezium'], status: 'TODO' },
          // ── Database ──
          { id: 'en-d1', category: 'Database', title: 'Deploy multi-broker Kafka cluster (MSK)', description: 'Use Terraform to provision AWS MSK (Managed Kafka). Configure 3-broker cluster across 3 AZs. Define topic partitions and replication factors per domain. Enable TLS encryption and IAM authentication.', relatedTech: ['Apache Kafka', 'Terraform', 'AWS MSK'], status: 'TODO' },
          { id: 'en-d2', category: 'Database', title: 'Deploy multi-region Cassandra ring', description: 'Provision Cassandra across 2+ AWS regions. Configure NetworkTopologyStrategy with RF=3 per region. Use LOCAL_QUORUM for writes to ensure low-latency regional consistency. Monitor with Cassandra Reaper for anti-entropy repairs.', relatedTech: ['Cassandra', 'AWS'], status: 'TODO' },
          { id: 'en-d3', category: 'Database', title: 'Configure Elasticsearch for search & logs', description: 'Deploy an Elasticsearch cluster via Elastic Cloud or AWS OpenSearch. Index all domain events for audit logs and full-text search. Connect Logstash/Fluentd to ship application logs. Build Kibana dashboards for ops teams.', relatedTech: ['Elasticsearch', 'Kibana', 'Fluentd'], status: 'TODO' },
          // ── DevOps ──
          { id: 'en-o1', category: 'DevOps', title: 'Provision EKS cluster with Terraform', description: 'Write Terraform EKS module: managed node groups, cluster autoscaler, IRSA (IAM Roles for Service Accounts), VPC CNI plugin. Deploy across 3 AZs with a mix of On-Demand and Spot instances for cost optimization.', relatedTech: ['Kubernetes', 'Terraform', 'AWS EKS'], status: 'TODO' },
          { id: 'en-o2', category: 'DevOps', title: 'Write Helm charts for all services', description: 'Create a Helm chart per service with configurable values for replicas, resource limits, env vars, and ingress. Use Helm `values-prod.yaml` and `values-staging.yaml` for environment-specific config. Store charts in a private OCI registry.', relatedTech: ['Kubernetes', 'Helm'], status: 'TODO' },
          { id: 'en-o3', category: 'DevOps', title: 'Setup ArgoCD for GitOps delivery', description: 'Install ArgoCD in the cluster. Create an Application per service pointing to your Helm charts repo. Set auto-sync so any merge to `main` triggers a live cluster update. Enable Slack notifications for sync failures.', relatedTech: ['ArgoCD', 'Kubernetes', 'Helm'], status: 'TODO' },
          { id: 'en-o4', category: 'DevOps', title: 'Implement Datadog APM & distributed tracing', description: 'Deploy the Datadog Agent as a DaemonSet. Instrument Spring Boot with dd-java-agent and Go with dd-trace-go. Configure OpenTelemetry context propagation so a single trace ID follows a request across all 5+ services end-to-end.', relatedTech: ['Datadog', 'OpenTelemetry'], status: 'TODO' },
          // ── Testing ──
          { id: 'en-t1', category: 'Testing', title: 'Write JUnit 5 tests with 85%+ coverage', description: 'Use Spring Boot Test slice annotations (@WebMvcTest, @DataJpaTest) for fast, focused tests. Use Testcontainers to spin up real PostgreSQL and Kafka in CI. Enforce 85% line coverage with JaCoCo in the Maven build.', relatedTech: ['JUnit 5', 'Testcontainers', 'Spring Boot'], status: 'TODO' },
          { id: 'en-t2', category: 'Testing', title: 'Run k6 load tests against staging', description: 'Write k6 scripts that simulate your peak traffic (e.g. 10,000 concurrent users). Define SLOs: p99 latency < 200ms, error rate < 0.1%. Run automatically in a dedicated CI job before every production release.', relatedTech: ['k6', 'GitHub Actions'], status: 'TODO' },
          // ── Security ──
          { id: 'en-s1', category: 'Security', title: 'Install Istio service mesh with mTLS', description: 'Install Istio using Helm. Enable strict mTLS mode: all pod-to-pod communication is encrypted and mutually authenticated. Define PeerAuthentication policies for each namespace. Use Kiali dashboard to visualize the service graph.', relatedTech: ['Istio', 'Kubernetes'], status: 'TODO' },
          { id: 'en-s2', category: 'Security', title: 'Deploy HashiCorp Vault for dynamic secrets', description: 'Install Vault on Kubernetes using the official Helm chart. Enable the database secrets engine for PostgreSQL: Vault generates a new username/password per service request with a 1-hour TTL. Configure the Vault Agent Injector to deliver secrets to pods automatically.', relatedTech: ['HashiCorp Vault', 'Kubernetes'], status: 'TODO' },
          { id: 'en-s3', category: 'Security', title: 'Implement RBAC & audit logging (SOC2/GDPR)', description: 'Define fine-grained RBAC policies at the API and Kubernetes namespace level. Enable Kubernetes audit logging to CloudWatch. Configure the Elasticsearch audit index to store every data access event — required for SOC2 Type II and GDPR compliance.', relatedTech: ['Kubernetes', 'Elasticsearch', 'AWS CloudWatch'], status: 'TODO' },
        ],
        nodes: [
          { id: 'n1', position: { x: 250, y: 0   }, data: { label: 'CDN + WAF (CloudFront)' } },
          { id: 'n2', position: { x: 80,  y: 150  }, data: { label: 'MFE: Core App' } },
          { id: 'n3', position: { x: 420, y: 150  }, data: { label: 'MFE: Admin Portal' } },
          { id: 'n4', position: { x: 250, y: 300  }, data: { label: 'Spring API Gateway' } },
          { id: 'n5', position: { x: 80,  y: 450  }, data: { label: 'Spring Domain Services' } },
          { id: 'n6', position: { x: 420, y: 450  }, data: { label: 'Go Analytics Workers' } },
          { id: 'n7', position: { x: 250, y: 600  }, data: { label: 'Kafka Event Bus (MSK)' } },
          { id: 'n8', position: { x: 80,  y: 750  }, data: { label: 'PostgreSQL (Multi-AZ)' } },
          { id: 'n9', position: { x: 420, y: 750  }, data: { label: 'Cassandra (Multi-Region)' } },
        ],
        edges: [
          { id: 'e1',  source: 'n1', target: 'n2' },
          { id: 'e2',  source: 'n1', target: 'n3' },
          { id: 'e3',  source: 'n2', target: 'n4' },
          { id: 'e4',  source: 'n3', target: 'n4' },
          { id: 'e5',  source: 'n4', target: 'n5' },
          { id: 'e6',  source: 'n4', target: 'n6' },
          { id: 'e7',  source: 'n5', target: 'n7' },
          { id: 'e8',  source: 'n6', target: 'n7' },
          { id: 'e9',  source: 'n5', target: 'n8' },
          { id: 'e10', source: 'n6', target: 'n9' },
        ],
      },
    };

    return blueprints[level] || blueprints['MVP'];
  }

  async generateBlueprint(projectName: string, description: string, level: string, useMock: boolean = false) {
    if (useMock || !process.env.GEMINI_API_KEY) {
      return { data: this.getMockBlueprint(level), usage: 0 };
    }

    const prompt = `
      You are an expert Software Architect. A user wants to build a project called "${projectName}".
      Description: "${description}"
      Complexity Level: "${level}" (MVP, Startup, Professional, Enterprise).

      Please generate a highly detailed system architecture blueprint.
      
      You MUST return exactly a JSON object (and nothing else, no markdown wrappers) matching this schema:
      {
        "techStack": [
          { "name": "string", "simpleIconSlug": "string (lowercase icon slug for simpleicons.org)", "rationale": "string", "category": "Frontend, Backend, Database, DevOps, Security, or Testing" }
        ],
        "checklist": [
          { "id": "string", "category": "string", "title": "string", "description": "string", "relatedTech": ["string"], "status": "TODO" }
        ],
        "nodes": [
          { "id": "string", "position": { "x": number, "y": number }, "data": { "label": "string" } }
        ],
        "edges": [
          { "id": "string", "source": "string", "target": "string" }
        ]
      }
      
      For nodes, ensure distinct IDs and sequential positioning on the Y axis (y: 0, 150, 300, 450) and X axis (x: 250). Do NOT return empty arrays.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const parsedData = JSON.parse(response.text || '{}');

      return {
        data: parsedData,
        usage: 1000 // Mock usage for now
      };
    } catch (error) {
      console.warn('Gemini API failed, falling back to mock blueprint:', error);
      return { data: this.getMockBlueprint(level), usage: 0 };
    }
  }

  async generateTaskPrompt(ctx: {
    taskTitle: string;
    taskDescription?: string;
    techStack: any[];
    checklist?: any[];
    projectName?: string;
    projectDescription?: string;
  }, useMock: boolean = false) {
    const { taskTitle, taskDescription, techStack, checklist, projectName, projectDescription } = ctx;

    // Group tech by tier for structured context
    const tierGroups: Record<string, string[]> = { Frontend: [], Backend: [], Database: [], DevOps: [], Testing: [] };
    techStack.forEach(t => {
      const cat = t.category || 'Backend';
      if (tierGroups[cat]) tierGroups[cat].push(t.name);
      else tierGroups['Backend'].push(t.name);
    });

    // Group checklist by category for structured context
    const checklistByCategory: Record<string, string[]> = {};
    (checklist || []).forEach(task => {
      const cat = task.category || 'General';
      if (!checklistByCategory[cat]) checklistByCategory[cat] = [];
      checklistByCategory[cat].push(task.title);
    });

    const techSummary = Object.entries(tierGroups)
      .filter(([, names]) => names.length > 0)
      .map(([tier, names]) => `  [${tier}]: ${names.join(', ')}`)
      .join('\n');

    const checklistSummary = Object.entries(checklistByCategory)
      .filter(([, tasks]) => tasks.length > 0)
      .map(([cat, tasks]) => `  [${cat}]:\n${tasks.map(t => `    - ${t}`).join('\n')}`)
      .join('\n');

    if (useMock || !process.env.GEMINI_API_KEY) {
      const isDevOps = taskTitle.toLowerCase().includes('docker') || taskTitle.toLowerCase().includes('kubernetes') || taskTitle.toLowerCase().includes('cicd') || taskTitle.toLowerCase().includes('deploy');
      const isDb = taskTitle.toLowerCase().includes('postgres') || taskTitle.toLowerCase().includes('redis') || taskTitle.toLowerCase().includes('schema') || taskTitle.toLowerCase().includes('database') || taskTitle.toLowerCase().includes('prisma');
      const isBackend = taskTitle.toLowerCase().includes('api') || taskTitle.toLowerCase().includes('service') || taskTitle.toLowerCase().includes('nest') || taskTitle.toLowerCase().includes('auth');

      let dynamicTree = '';
      if (isDevOps) {
        dynamicTree = `project-root/
├── docker/
│   ├── Dockerfile.api
│   ├── Dockerfile.frontend
│   └── docker-compose.yml
├── .github/
│   └── workflows/
│       └── ci.yml
└── kubernetes/
    ├── deployment.yaml
    └── service.yaml`;
      } else if (isDb) {
        dynamicTree = `project-root/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── src/
    ├── database/
    │   └── db.module.ts
    ├── repositories/
    │   └── entity.repository.ts
    └── services/
        └── cache.service.ts`;
      } else if (isBackend) {
        dynamicTree = `project-root/
└── src/
    ├── modules/
    │   └── feature/
    │       ├── feature.module.ts
    │       ├── feature.controller.ts
    │       ├── feature.service.ts
    │       └── dto/
    │           └── create-feature.dto.ts
    └── tests/
        └── feature.service.spec.ts`;
      } else {
        dynamicTree = `project-root/
└── src/
    ├── components/
    │   └── Feature/
    │       ├── Feature.tsx
    │       ├── Feature.test.tsx
    │       └── index.ts
    ├── hooks/
    │   └── useFeature.ts
    ├── services/
    │   └── feature.api.ts
    └── types/
        └── feature.types.ts`;
      }

      return {
        data: {
          prompt: `# AI Developer Prompt: ${taskTitle}
${projectName ? `\n**Project:** ${projectName}` : ''}
${projectDescription ? `**Description:** ${projectDescription}\n` : ''}

---

## 🏗️ Project Architecture (Tech Stack by Tier)
\`\`\`
${techSummary || '  No tech stack defined yet.'}
\`\`\`

## 📋 Full Project Checklist (All Planned Steps by Category)
${checklistSummary ? `\`\`\`\n${checklistSummary}\n\`\`\`` : '_No checklist generated yet._'}

---

## 🎯 Your Current Task
**"${taskTitle}"**
${taskDescription ? `\n${taskDescription}\n` : ''}

---

## 📁 File Structure to Create/Modify
\`\`\`text
${dynamicTree}
\`\`\`

## ✅ Step-by-Step Implementation

### Phase 1 – Setup & Scaffolding
- [ ] Scaffold the file structure shown above
- [ ] Install any required dependencies
- [ ] Configure environment variables

### Phase 2 – Core Implementation
${tierGroups.Frontend.length > 0 ? `#### Frontend (${tierGroups.Frontend.join(', ')})\n- [ ] Build the UI components and connect to API\n- [ ] Handle loading/error states` : ''}
${tierGroups.Backend.length > 0 ? `#### Backend (${tierGroups.Backend.join(', ')})\n- [ ] Implement the service/controller logic\n- [ ] Validate all inputs with DTOs/schemas` : ''}
${tierGroups.Database.length > 0 ? `#### Database (${tierGroups.Database.join(', ')})\n- [ ] Write/update schema definitions\n- [ ] Create seed data for local development` : ''}
${tierGroups.DevOps.length > 0 ? `#### DevOps (${tierGroups.DevOps.join(', ')})\n- [ ] Update CI/CD configuration\n- [ ] Verify environment parity` : ''}

### Phase 3 – Testing & Integration
- [ ] Write unit tests for all new logic
- [ ] Run integration tests and verify end-to-end flow
- [ ] Check for edge cases and error boundaries

### Phase 4 – Review & Deploy
- [ ] Code review and cleanup
- [ ] Open a pull request with a clear description
- [ ] Deploy to staging and verify before production

---
> 💡 **[Free Tier Mock]** Upgrade to a paid plan for full AI-generated prompts tailored specifically to your task, tech stack, and project context.`
        },
        usage: 0
      };
    }

    const prompt = `
      You are an expert Developer Assistant acting as a Senior Engineer.
      The user is building a project called "${projectName || 'their project'}".
      ${projectDescription ? `Project description: "${projectDescription}"` : ''}

      ## Full Tech Stack (grouped by architectural tier):
      ${techSummary}

      ## Full Project Checklist (all planned tasks, by category):
      ${checklistSummary || 'No checklist available.'}

      ## The specific task to implement right now:
      Title: "${taskTitle}"
      ${taskDescription ? `Description: "${taskDescription}"` : ''}

      Generate a highly detailed, structured developer prompt that the user can paste into Cursor, GitHub Copilot, or Claude to implement this task perfectly.

      The prompt MUST:
      1. Open with "You are a Senior [relevant role] engineer." as context for the AI.
      2. List the full tech stack grouped by tier (Frontend, Backend, Database, DevOps) so the AI understands the complete architecture.
      3. Reference how THIS task fits into the broader project checklist (mention which phase/category it belongs to, what comes before and after it).
      4. Provide a detailed, text-based file tree (using ├── and └──) of exact files to create or modify.
      5. Give a numbered, step-by-step implementation checklist broken down by tier (Frontend steps, Backend steps, Database steps, etc.) with markdown checkboxes.
      6. End with a "Testing & Verification" section with specific test commands and what to verify.

      Return ONLY a JSON object matching this schema:
      { "prompt": "the full generated prompt as a markdown string" }
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      return {
        data: parsed,
        usage: 1000
      };
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to generate task prompt', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async chat(message: string, context: any) {
    if (!process.env.GEMINI_API_KEY) {
      return { reply: `I am your CTO Assistant. You said: "${message}". Please add a Gemini API Key to get real AI responses!` };
    }

    const systemPrompt = `
      You are DevArchitect AI, an expert CTO and Software Architect. 
      The user is currently building a project with the following context:
      ${JSON.stringify(context, null, 2)}
      
      Answer their questions about software engineering, architecture, code, or general knowledge. Be highly technical, concise, and helpful. Use markdown formatting.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: `${systemPrompt}\n\nUser: ${message}`
      });

      return { reply: response.text };
    } catch (error) {
      console.warn('Gemini API failed for chat:', error);
      return { reply: 'I am currently experiencing high demand. Please try again in a few seconds.' };
    }
  }

  async generateDocs(projectName: string, description: string, techStack: any[], nodes: any[]) {
    if (!process.env.GEMINI_API_KEY) {
      return {
        readme: `# ${projectName}\n\n${description}\n\n## Tech Stack\n${techStack.map(t => `- ${t.name}`).join('\n')}`,
        architecture: `# Architecture\n\nGenerated for ${projectName}.`
      };
    }

    const prompt = `
      You are an expert technical writer and Software Architect. 
      Generate a standard README.md and ARCHITECTURE.md for the following project:
      Project: ${projectName}
      Description: ${description}
      Tech Stack: ${JSON.stringify(techStack)}
      Architecture Nodes: ${JSON.stringify(nodes)}

      Return a JSON object ONLY with the following schema:
      {
        "readme": "markdown string for README.md",
        "architecture": "markdown string for ARCHITECTURE.md"
      }
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.warn('Gemini API failed for docs:', error);
      return {
        readme: `# ${projectName}\n\n${description}\n\n## Tech Stack\n${techStack.map(t => `- ${t.name}`).join('\n')}`,
        architecture: `# Architecture\n\nGenerated for ${projectName}.`
      };
    }
  }

  private getMockScan() {
    return {
      score: { overall: 75, security: 60, devops: 80, architecture: 85 },
      techStack: [
        { name: 'Node.js', simpleIconSlug: 'nodedotjs', category: 'Backend' },
        { name: 'React', simpleIconSlug: 'react', category: 'Frontend' }
      ],
      findings: [
        { category: 'Security', issue: 'Missing security best practices', impact: 'High' }
      ],
      checklist: [
        { id: '1', title: 'Add Dependabot', status: 'TODO', category: 'DevOps', description: 'Enable Dependabot for automated security updates.', relatedTech: ['GitHub'] },
        { id: '2', title: 'Setup GitHub Actions for CI', status: 'TODO', category: 'DevOps', description: 'Create a CI pipeline to run tests on PR.', relatedTech: ['GitHub Actions'] }
      ],
      nodes: [
        { id: '1', position: { x: 250, y: 0 }, data: { label: 'GitHub Repo' } },
        { id: '2', position: { x: 250, y: 150 }, data: { label: 'Node.js Backend' } }
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' }
      ]
    };
  }

  async scanGithub(githubUrl: string) {
    if (!process.env.GEMINI_API_KEY) {
      return this.getMockScan();
    }

    try {
      let owner = '';
      let repo = '';
      const urlParts = githubUrl.split('github.com/');
      if (urlParts.length > 1) {
        const pathParts = urlParts[1].split('/');
        owner = pathParts[0];
        repo = pathParts[1].replace('.git', '');
      } else {
        throw new Error('Invalid GitHub URL');
      }

      let packageJsonContent = '';
      try {
        const pkgUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/package.json`;
        const res = await fetch(pkgUrl);
        if (res.ok) {
          packageJsonContent = await res.text();
        } else {
          const masterRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/master/package.json`);
          if (masterRes.ok) {
            packageJsonContent = await masterRes.text();
          }
        }
      } catch (err) {
        console.warn('Could not fetch package.json', err);
      }

      const prompt = `
        You are an expert DevSecOps and Software Architect. I want you to evaluate a GitHub repository for Production Readiness.
        Repo: ${owner}/${repo}
        Package.json content: ${packageJsonContent ? packageJsonContent : 'Not found or not a Node project.'}

        Based on standard best practices for ${packageJsonContent ? 'Node.js/JavaScript' : 'software engineering'}, generate a Production Readiness Score.
        Also infer their Tech Stack from the package.json, generate an architectural diagram (nodes/edges), and provide an actionable remediation checklist.
        
        Return ONLY valid JSON with this exact schema:
        {
          "score": { "overall": number, "security": number, "devops": number, "architecture": number },
          "techStack": [ { "name": "string", "simpleIconSlug": "string (lowercase icon slug for simpleicons.org)", "category": "Frontend, Backend, Database, DevOps, Security, or Testing" } ],
          "findings": [ { "category": "Security|DevOps|Architecture", "issue": "string", "impact": "High|Medium|Low" } ],
          "checklist": [ { "id": "string", "category": "string", "title": "string", "description": "string", "relatedTech": ["string"], "status": "TODO" } ],
          "nodes": [ { "id": "string", "position": { "x": number, "y": number }, "data": { "label": "string" } } ],
          "edges": [ { "id": "string", "source": "string", "target": "string" } ]
        }
        
        For nodes, ensure distinct IDs and sequential positioning on the Y axis (y: 0, 150, 300) and X axis (x: 250). Do NOT return empty arrays if possible.
      `;

      const response = await this.ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.warn('Gemini API failed, falling back to mock scan:', error);
      return this.getMockScan();
    }
  }

  async estimateCost(level: string, techStack: any[]) {
    if (!process.env.GEMINI_API_KEY) {
      return {
        totalMonthly: 45,
        breakdown: [
          { service: 'Vercel Pro', cost: 20, description: 'Frontend Hosting & Serverless APIs' },
          { service: 'Neon/Supabase DB', cost: 25, description: 'PostgreSQL Database' }
        ],
        notes: 'This is a mock estimation.'
      };
    }

    const prompt = `
      You are a Cloud Infrastructure Expert. The user is building a "${level}" software project using the following tech stack:
      ${JSON.stringify(techStack.map(t => t.name))}

      Provide a realistic, modern monthly cost estimation for running this stack in production. 
      Use modern Serverless/PaaS providers where appropriate (e.g. Vercel, Supabase, AWS, Render).

      Return ONLY valid JSON with this schema:
      {
        "totalMonthly": number,
        "breakdown": [
          { "service": "string", "cost": number, "description": "string" }
        ],
        "notes": "string (brief summary or advice on saving costs)"
      }
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.warn('Gemini API failed for cost:', error);
      return {
        totalMonthly: 45,
        breakdown: [
          { service: 'Vercel Pro', cost: 20, description: 'Frontend Hosting & Serverless APIs' },
          { service: 'Neon/Supabase DB', cost: 25, description: 'PostgreSQL Database' }
        ],
        notes: 'This is a mock estimation due to high AI demand.'
      };
    }
  }

  async generateBoilerplate(projectName: string, techStack: any[]) {
    if (!process.env.GEMINI_API_KEY) {
      return {
        files: [
          { path: 'package.json', content: '{\n  "name": "mock-app"\n}' },
          { path: 'README.md', content: '# Mock App\nGenerated by AI.' }
        ]
      };
    }

    const prompt = `
      You are an expert developer. The user wants to download a boilerplate starter for a project named "${projectName}".
      The tech stack they selected is: ${JSON.stringify(techStack.map(t => t.name))}.
      
      Generate a realistic, production-ready starting codebase (e.g. package.json, docker-compose.yml, basic server configuration file, .gitignore, README.md). Do not generate hundreds of files, just the core 5-8 root structural files that define the project.

      Return ONLY valid JSON with this schema:
      {
        "files": [
          { "path": "string (e.g. 'package.json')", "content": "string (the full file content)" }
        ]
      }
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.warn('Gemini API failed for boilerplate:', error);
      return {
        files: [
          { path: 'package.json', content: '{\n  "name": "mock-app"\n}' },
          { path: 'README.md', content: '# Mock App\nGenerated by AI.' }
        ]
      };
    }
  }
}
