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
    // ─── shared helpers ───────────────────────────────────────────
    const t = (id: string, category: string, title: string, desc: string, techs: string[]) =>
      ({ id, category, title, description: desc, relatedTech: techs, status: 'TODO' });
    const s = (name: string, slug: string, rationale: string, category: string) =>
      ({ name, simpleIconSlug: slug, rationale, category });

    // ──────────────────────────────────────────────────────────────
    // MVP  ·  0 → 1,000 users  ·  Ship fast, validate idea
    // ──────────────────────────────────────────────────────────────
    const MVP = {
      techStack: [
        s('Next.js',         'nextdotjs',    'Full-stack React framework — App Router, SSR, and API routes in one repo.',        'Frontend'),
        s('TypeScript',      'typescript',   'Catch bugs at compile time. Use strict mode from day one.',                        'Frontend'),
        s('Tailwind CSS',    'tailwindcss',  'Utility-first CSS. No separate stylesheet — fast to prototype and iterate.',       'Frontend'),
        s('Shadcn UI',       'shadcnui',     'Copy-paste accessible components on Radix UI. Own the code, no lock-in.',          'Frontend'),
        s('React Hook Form', 'reacthookform','Performant forms with minimal re-renders and built-in validation.',                'Frontend'),
        s('Zod',             'zod',          'Runtime schema validation — share the same schema across frontend and backend.',    'Frontend'),
        s('Supabase Auth',   'supabase',     'Email/password + OAuth (Google, GitHub) out of the box. Free tier is generous.',   'Auth'),
        s('Supabase',        'supabase',     'All-in-one BaaS — PostgreSQL, Auth, Storage, Realtime, and Edge Functions.',       'Database'),
        s('PostgreSQL',      'postgresql',   'Rock-solid relational database with RLS policies for row-level data security.',    'Database'),
        s('Stripe',          'stripe',       'Industry-standard payments. Handles checkout, subscriptions, and webhooks.',       'Payment'),
        s('Resend',          'resend',       'Developer-first email API. 100 free emails/day. Excellent React Email templates.','Email'),
        s('Supabase Storage','supabase',     'S3-compatible file storage with signed URLs and RLS policies. Free 1 GB.',         'Storage'),
        s('PostHog',         'posthog',      'Open-source product analytics — events, funnels, session replay, feature flags.', 'Analytics'),
        s('Sentry',          'sentry',       'Error tracking + performance monitoring. Get alerted before users complain.',      'Monitoring'),
        s('Vercel',          'vercel',       'Zero-config deploy. Preview URLs on every PR. Edge network in 40+ regions.',      'DevOps'),
        s('Vitest',          'vitest',       'Lightning-fast unit tests with native ESM support. Works perfectly with Next.js.','Testing'),
      ],
      checklist: [
        t('mvp-f1','Frontend','Init Next.js + TypeScript + Tailwind','Run `npx create-next-app@latest --typescript`. Configure Tailwind with your brand colors and Inter font via `next/font`. Set up dark mode with `class` strategy in `tailwind.config.ts`.', ['Next.js','TypeScript','Tailwind CSS']),
        t('mvp-f2','Frontend','Install Shadcn UI & base components','Run `npx shadcn@latest init`. Add Button, Card, Input, Label, Dialog, Sheet, Toast, Badge, Skeleton. Add the global Toaster to your root layout. Test all components in isolation.', ['Shadcn UI','Radix UI']),
        t('mvp-f3','Frontend','Build core pages & layout','Create pages: `/` (landing with hero + pricing), `/dashboard` (app shell), `/auth/login`, `/auth/signup`. Add responsive Navbar, mobile hamburger menu, and a 404 page with a helpful message.', ['Next.js','Tailwind CSS']),
        t('mvp-f4','Frontend','Form validation with React Hook Form + Zod','Create reusable Zod schemas for signup, login, and all user-facing forms. Connect to React Hook Form via `@hookform/resolvers/zod`. Show inline field errors on blur. Disable submit button on invalid state.', ['React Hook Form','Zod']),
        t('mvp-f5','Frontend','SEO metadata + Open Graph tags','Add `metadata` exports to every page. Configure `og:image` for social sharing. Add `robots.txt` and `sitemap.xml` via Next.js route handlers. Test with Google\'s Rich Results tool.', ['Next.js']),
        t('mvp-a1','Auth','Configure Supabase Auth (Email + Google OAuth)','Enable Email/Password and Google OAuth in the Supabase dashboard. Install `@supabase/ssr`. Create `middleware.ts` to protect all `/dashboard/*` routes by checking the session cookie.', ['Supabase Auth','Next.js']),
        t('mvp-a2','Auth','Build auth pages & session handling','Create login and signup pages using the Supabase client. Handle email verification redirect. Implement a `useUser()` hook. Add a "Forgot password" flow with `resetPasswordForEmail`.', ['Supabase Auth','Next.js']),
        t('mvp-d1','Database','Design schema & enable Row Level Security','In the Supabase Table Editor, create `profiles` and your core domain tables. Enable RLS on ALL tables. Write policies so users can only read/write their own data. Never skip RLS on a public table.', ['Supabase','PostgreSQL']),
        t('mvp-d2','Database','Seed local dev data','Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`. Write a seed SQL script in `supabase/seed.sql`. Run `supabase start` for a local Supabase instance during development.', ['Supabase','PostgreSQL']),
        t('mvp-p1','Payment','Set up Stripe Checkout','Install `stripe` and `@stripe/stripe-js`. Create `/api/stripe/checkout` that generates a Stripe Checkout session. Add your pricing plans as Stripe Products and Prices in the Stripe dashboard.', ['Stripe']),
        t('mvp-p2','Payment','Handle Stripe webhooks','Create `/api/stripe/webhook`. Verify the `stripe-signature` header. Handle `checkout.session.completed` and `customer.subscription.*` events to update the user\'s plan in your DB.', ['Stripe']),
        t('mvp-p3','Payment','Build billing page','Create `/dashboard/billing` showing the user\'s plan, next billing date, and a "Manage Billing" button that redirects to the Stripe Customer Portal via a server-generated session URL.', ['Stripe']),
        t('mvp-e1','Email','Setup Resend & welcome email','Install `resend`. Create `emails/WelcomeEmail.tsx` using React Email. Call `resend.emails.send()` after signup. Test locally with the React Email preview server at `localhost:3001`.', ['Resend']),
        t('mvp-e2','Email','Build transactional email templates','Create templates for: email verification, password reset, payment receipt, and payment failed. Ensure all emails have plain-text fallbacks. Test deliverability with mail-tester.com.', ['Resend']),
        t('mvp-s1','Storage','User file uploads via Supabase Storage','Create a `user-uploads` bucket in Supabase Storage with RLS policies. Generate signed upload URLs server-side. Store the object path (not the full URL) in your DB. Never expose raw storage URLs to the client.', ['Supabase Storage']),
        t('mvp-an1','Analytics','Setup PostHog product analytics','Install `posthog-js`. Track key events: `user_signed_up`, `subscription_started`, `feature_used`. Build a signup conversion funnel in PostHog Insights. Enable session replay to watch real user behavior.', ['PostHog']),
        t('mvp-n1','Monitoring','Setup Sentry for error tracking','Install `@sentry/nextjs`. Run `npx @sentry/wizard`. Configure source map uploads in the build. Set up a Slack alert for any new error. Monitor your API routes for p95 latency regressions.', ['Sentry']),
        t('mvp-o1','DevOps','Deploy to Vercel & configure env vars','Connect your GitHub repo to Vercel. Add all environment variables in the Vercel dashboard. Enable preview deployments on every PR branch for QA before merging to main.', ['Vercel']),
        t('mvp-o2','DevOps','Custom domain + HTTPS','Add your domain in Vercel dashboard. Point DNS to Vercel nameservers. SSL auto-provisions via Let\'s Encrypt. Set up www → non-www redirect. Verify `Content-Security-Policy` header is present.', ['Vercel']),
        t('mvp-t1','Testing','Setup Vitest & write utility tests','Install Vitest and `@vitejs/plugin-react`. Write tests for all Zod schemas and utility functions. Add a `test:ci` script to `package.json`. Require tests pass in GitHub Actions before merging.', ['Vitest']),
      ],
      nodes: [
        { id: 'n1', position: { x: 250, y: 0   }, data: { label: 'User Browser' } },
        { id: 'n2', position: { x: 250, y: 150 }, data: { label: 'Next.js App (Vercel)' } },
        { id: 'n3', position: { x: 80,  y: 300 }, data: { label: 'Supabase (Auth + DB)' } },
        { id: 'n4', position: { x: 420, y: 300 }, data: { label: 'Stripe (Payments)' } },
        { id: 'n5', position: { x: 250, y: 450 }, data: { label: 'Resend + PostHog + Sentry' } },
      ],
      edges: [
        { id: 'e1', source: 'n1', target: 'n2' },
        { id: 'e2', source: 'n2', target: 'n3' },
        { id: 'e3', source: 'n2', target: 'n4' },
        { id: 'e4', source: 'n2', target: 'n5' },
      ],
    };

    // ──────────────────────────────────────────────────────────────
    // Startup  ·  1,000 → 50,000 users  ·  Custom backend, real team
    // ──────────────────────────────────────────────────────────────
    const Startup = {
      techStack: [
        s('Next.js',          'nextdotjs',     'SSR + API routes. Perfect for B2B SaaS dashboards with auth-gated content.',     'Frontend'),
        s('TypeScript',       'typescript',    'Strict types across the entire monorepo.',                                        'Frontend'),
        s('Tailwind CSS',     'tailwindcss',   'Consistent utility-first styling at scale.',                                     'Frontend'),
        s('TanStack Query',   'reactquery',    'Server state: caching, background sync, optimistic updates, and prefetching.',   'Frontend'),
        s('Zustand',          'zustand',       'Global client state — lightweight, no boilerplate, devtools included.',          'Frontend'),
        s('Better Auth',      'betterauth',    'Framework-agnostic auth with sessions, OAuth, and 2FA on your own backend.',     'Auth'),
        s('JWT',              'jsonwebtokens', 'Stateless access tokens with Redis-backed refresh token rotation.',              'Auth'),
        s('NestJS',           'nestjs',        'Modular, decorator-driven Node.js framework — scales with your team structure.', 'Backend'),
        s('Prisma',           'prisma',        'Type-safe ORM. Auto-generate migrations and the Prisma client from your schema.','Backend'),
        s('Swagger',          'swagger',       'Auto-generated API docs at `/api/docs` from your NestJS decorators.',           'Backend'),
        s('PostgreSQL',       'postgresql',    'ACID-compliant relational DB — the right foundation for SaaS data models.',      'Database'),
        s('Redis',            'redis',         'In-memory store: sessions, rate limiting, pub/sub, and BullMQ job queue.',       'Database'),
        s('PgBouncer',        'postgresql',    'Connection pooler — prevents PostgreSQL connection exhaustion under load.',      'Database'),
        s('Stripe',           'stripe',        'Subscriptions, metered billing, invoices, tax calculation, and the portal.',    'Payment'),
        s('Resend',           'resend',        'Transactional email via API with React Email templates and delivery analytics.','Email'),
        s('AWS S3',           'amazons3',      'Object storage for user uploads. Signed URLs for private, secure file access.', 'Storage'),
        s('BullMQ',           'redis',         'Redis-backed job queue — email sending, PDF generation, webhooks, retries.',    'Queue'),
        s('PostHog',          'posthog',       'Product analytics + session replay + feature flags + A/B tests.',               'Analytics'),
        s('Mixpanel',         'mixpanel',      'User-centric funnel and retention analytics to understand churn.',              'Analytics'),
        s('Sentry',           'sentry',        'Error tracking + performance monitoring with release tracking.',                'Monitoring'),
        s('Helmet.js',        'javascript',    'Sets 11 HTTP security headers: XSS, clickjacking, MIME sniffing protection.',   'Security'),
        s('Rate Limiter',     'nestjs',        '@nestjs/throttler — IP-based rate limiting on all public endpoints.',           'Security'),
        s('Docker',           'docker',        'Container per service for identical dev/staging/prod environments.',            'DevOps'),
        s('GitHub Actions',   'githubactions', 'CI: lint → test → build → deploy on every PR merge.',                         'DevOps'),
        s('Nginx',            'nginx',         'Reverse proxy, SSL termination, and static file serving in production.',       'DevOps'),
        s('Jest',             'jest',          'Unit + integration tests. NestJS TestingModule makes it easy to mock deps.',   'Testing'),
        s('Supertest',        'jest',          'HTTP integration testing — hit real endpoints with an in-memory NestJS app.',  'Testing'),
      ],
      checklist: [
        t('st-f1','Frontend','Bootstrap Next.js with TanStack Query + Zustand','Set up TanStack Query with a global `QueryClient`. Configure Zustand stores for user session and global UI state. Set up Axios with interceptors that attach the JWT Bearer token automatically.', ['Next.js','TanStack Query','Zustand']),
        t('st-f2','Frontend','Build authenticated app shell','Create full authenticated layout: collapsible Sidebar, Topbar with notifications + user avatar menu. Protect all `/dashboard/*` routes in `middleware.ts`. Add a loading skeleton for every data-fetching page.', ['Next.js','Tailwind CSS','Zustand']),
        t('st-f3','Frontend','SSR + caching + lazy loading','Use React Server Components for data-heavy pages. Add `next/dynamic` lazy imports for heavy components. Enable Next.js Image optimization. Set `staleTime` and `cacheTime` in TanStack Query per endpoint data freshness.', ['Next.js','TanStack Query']),
        t('st-a1','Auth','JWT with refresh token rotation','Access token: 15 min TTL. Refresh token: 7 day TTL stored in Redis with the user ID. On every API request, verify the access token. Rotate the refresh token on every use (sliding window). Revoke on logout.', ['Better Auth','JWT','Redis']),
        t('st-a2','Auth','RBAC with roles & permissions','Define roles: `admin`, `member`, `viewer`. Store role in the JWT payload. Create a NestJS `RolesGuard` + `@Roles()` decorator. Protect routes by role. Log all role violations to Sentry as a warning event.', ['NestJS','JWT']),
        t('st-a3','Auth','MFA with TOTP','Enable TOTP as optional MFA. Use `otplib` to generate and verify codes. Store the encrypted TOTP secret in the DB. Show a QR code on the security settings page. Enforce MFA for admin accounts.', ['Better Auth']),
        t('st-b1','Backend','NestJS with modules & Swagger','Create modules: AuthModule, UsersModule, SubscriptionModule, OrganizationModule. Configure `ValidationPipe` with `whitelist: true`. Enable Swagger at `/api/docs` with JWT bearer auth. Write DTO classes with class-validator decorators.', ['NestJS','Swagger','TypeScript']),
        t('st-b2','Backend','Prisma schema with migrations','Write `schema.prisma`: User, Organization, Subscription, Plan, ApiKey models. Run `prisma migrate dev`. Write `seed.ts` with test orgs and users. Add `prisma format` to pre-commit hooks to keep the schema clean.', ['Prisma','PostgreSQL']),
        t('st-b3','Backend','Logging, exception filters & health checks','Use `nestjs-pino` for structured JSON logging. Create a global `HttpExceptionFilter`. Add `/health` with DB + Redis connectivity checks. Ship logs to Logtail or Papertrail for centralized log search.', ['NestJS']),
        t('st-d1','Database','PostgreSQL + Redis via Docker Compose','Write `docker-compose.yml` with named volumes and health-checks. PgBouncer on port 6432 in `transaction` pool mode. Prisma `DATABASE_URL` points at PgBouncer. Redis with a password and persistence enabled.', ['Docker','PostgreSQL','Redis']),
        t('st-d2','Database','Index optimization','Use `EXPLAIN ANALYZE` on your 5 most-used queries. Add composite indexes where needed. Enable `pg_stat_statements`. Configure Prisma to log queries slower than 100ms. Add a monthly slow-query review to your team calendar.', ['PostgreSQL','Prisma']),
        t('st-p1','Payment','Stripe subscriptions','Create Products and Prices in Stripe for Monthly/Annual plans. On plan selection, create a Stripe Customer + Subscription. Store `stripe_customer_id` and `stripe_subscription_id` in your DB. Sync subscription status in webhooks.', ['Stripe']),
        t('st-p2','Payment','Handle all Stripe webhook events','Listen for: `customer.subscription.created`, `updated`, `deleted`, `invoice.payment_failed`. On failure: email the user, add a grace period (3 days), then downgrade. Log all webhook events to your DB for audit purposes.', ['Stripe']),
        t('st-p3','Payment','Billing portal & upgrade flow','Create `/dashboard/billing` with current plan, usage metrics, invoice history. Add "Upgrade" and "Manage Billing" buttons. Redirect to Stripe Customer Portal via a server-generated session URL.', ['Stripe']),
        t('st-e1','Email','Email queue via BullMQ','Never call Resend directly from an API handler. Always push to a BullMQ `email` queue. The worker processes sends asynchronously. Add retry logic: 3 attempts with exponential backoff (1s → 5s → 30s).', ['BullMQ','Resend','Redis']),
        t('st-e2','Email','All transactional email templates','Create React Email templates for: welcome, email verification, password reset, payment receipt, payment failed, plan upgrade, team invitation. Test each in the React Email preview server.', ['Resend']),
        t('st-s1','Storage','AWS S3 with signed URLs','Configure S3 bucket with public access blocked. Create a NestJS endpoint that generates pre-signed PUT URLs for uploads and GET URLs for reads. Store the S3 object key in the DB, never the full URL. Set a 1-hour expiry on download URLs.', ['AWS S3']),
        t('st-s2','Storage','File validation & CDN','Validate MIME type and size before generating the signed URL. Add CloudFront in front of S3 for CDN-cached delivery of public assets and user avatars. Set `Cache-Control: max-age=86400` on public objects.', ['AWS S3']),
        t('st-q1','Queue','Setup BullMQ with Bull Board UI','Install BullMQ. Create a `QueueModule` in NestJS. Define queues: `email`, `report`, `webhook`. Add Bull Board UI at `/admin/queues` (auth-protected). Monitor job success/failure rates and queue depth in real-time.', ['BullMQ','Redis']),
        t('st-q2','Queue','Dead letter queue + Slack alerts','Configure `attempts: 3` and exponential `backoff`. Failed jobs after max retries move to a DLQ. Set up a Slack alert when DLQ depth exceeds 10 jobs. Create a weekly cron to review and replay or discard DLQ jobs.', ['BullMQ','Redis']),
        t('st-an1','Analytics','Track key business events','Call `posthog.identify()` on login. Track: `subscription_started`, `feature_used`, `export_generated`, `team_member_invited`. Build a "Time to Value" funnel: signup → first core action. Review weekly.', ['PostHog']),
        t('st-sc1','Security','Helmet + CORS + rate limiting','Apply Helmet.js globally in `main.ts`. Configure CORS to only allow your frontend domain. Apply `@nestjs/throttler` at 30 req/min per IP on public routes, 100/min for authenticated users.', ['NestJS','Helmet.js']),
        t('st-sc2','Security','Secrets management','Use GitHub Secrets for CI/CD. Use `.env.example` (no values) in the repo. Add a `detect-secrets` pre-commit hook. Never store secrets in code. Rotate all secrets quarterly.', ['GitHub Actions']),
        t('st-o1','DevOps','Multi-stage Dockerfiles','Multi-stage Dockerfile: `builder` installs all deps + compiles TypeScript. `production` copies only `dist/` and prod `node_modules` to `node:20-alpine`. Final image < 200MB. Scan with `docker scout` for CVEs.', ['Docker']),
        t('st-o2','DevOps','GitHub Actions CI/CD pipeline','Workflow: checkout → install → lint → test → build Docker image → push to registry → deploy. Cache `node_modules`. Use GitHub OIDC to authenticate with your cloud — no long-lived API keys in secrets.', ['GitHub Actions','Docker']),
        t('st-o3','DevOps','Nginx reverse proxy + SSL','Nginx handles SSL termination (Let\'s Encrypt via Certbot), HTTP→HTTPS redirect, proxies `/api` to NestJS and `/` to Next.js. Set `proxy_pass`, gzip compression, and `X-Forwarded-For` header.', ['Nginx']),
        t('st-t1','Testing','Unit tests for all services','NestJS `TestingModule`. Mock Prisma with `jest-mock-extended`. Mock Redis with `ioredis-mock`. Write tests for every service method. Target 75%+ branch coverage. Run in CI on every push and block merge on failure.', ['Jest','NestJS']),
        t('st-t2','Testing','API integration tests with Supertest','Spin up a full NestJS app in tests against a real test database. Test: register → login → access protected route → refresh token → logout. Assert HTTP status codes and response body shapes.', ['Supertest','Jest']),
      ],
      nodes: [
        { id: 'n1', position: { x: 250, y: 0   }, data: { label: 'User Browser' } },
        { id: 'n2', position: { x: 250, y: 150 }, data: { label: 'Next.js Frontend' } },
        { id: 'n3', position: { x: 250, y: 300 }, data: { label: 'NestJS API' } },
        { id: 'n4', position: { x: 80,  y: 450 }, data: { label: 'PostgreSQL + Redis' } },
        { id: 'n5', position: { x: 420, y: 450 }, data: { label: 'BullMQ Workers' } },
        { id: 'n6', position: { x: 80,  y: 600 }, data: { label: 'Stripe + Resend + S3' } },
        { id: 'n7', position: { x: 420, y: 600 }, data: { label: 'PostHog + Sentry' } },
      ],
      edges: [
        { id: 'e1', source: 'n1', target: 'n2' },
        { id: 'e2', source: 'n2', target: 'n3' },
        { id: 'e3', source: 'n3', target: 'n4' },
        { id: 'e4', source: 'n3', target: 'n5' },
        { id: 'e5', source: 'n3', target: 'n6' },
        { id: 'e6', source: 'n3', target: 'n7' },
      ],
    };

    // ──────────────────────────────────────────────────────────────
    // Professional  ·  50k → 500k users  ·  Microservices, cloud-native
    // ──────────────────────────────────────────────────────────────
    const Professional = {
      techStack: [
        s('Next.js',              'nextdotjs',     'Shell app in a Turborepo monorepo with shared UI packages per team.',             'Frontend'),
        s('Turborepo',            'turborepo',     'Monorepo build system — caches builds across CI, runs tasks in parallel.',        'Frontend'),
        s('Module Federation',    'webpack',       'Deploy each feature area independently without breaking the shell app.',          'Frontend'),
        s('TanStack Query',       'reactquery',    'Optimistic updates, background polling, infinite scroll, and window refocus sync.','Frontend'),
        s('Auth.js',              'authjs',        'Next.js-native auth. Supports 50+ OAuth providers + email magic links + SAML.',   'Auth'),
        s('RBAC + MFA',           'jsonwebtokens', 'Fine-grained role + permission system with TOTP-based multi-factor auth.',        'Auth'),
        s('NestJS',               'nestjs',        'API Gateway that routes to internal microservices via gRPC.',                    'Backend'),
        s('gRPC',                 'grpc',          'Binary protocol for low-latency inter-service calls. 10× faster than REST.',      'Backend'),
        s('RabbitMQ',             'rabbitmq',      'AMQP message broker — async events, dead letter queues, retry policies.',        'Backend'),
        s('PostgreSQL',           'postgresql',    'Primary write store. Multi-AZ RDS with automatic failover.',                     'Database'),
        s('Read Replicas',        'postgresql',    'Route heavy reporting queries to replicas to spare the writer endpoint.',         'Database'),
        s('Redis',                'redis',         'Distributed cache, session store, and BullMQ backend.',                         'Database'),
        s('Stripe',               'stripe',        'Metered billing, multi-currency, Stripe Tax, and revenue analytics.',            'Payment'),
        s('SendGrid',             'sendgrid',      'Transactional + marketing email at scale with delivery analytics and webhooks.', 'Email'),
        s('S3 + CloudFront',      'amazons3',      'S3 for storage, CloudFront CDN in front for low-latency global delivery.',       'Storage'),
        s('Cloudinary',           'cloudinary',    'Image optimization, resizing, and transformation pipeline for user media.',      'Storage'),
        s('RabbitMQ',             'rabbitmq',      'Durable queues with topic exchanges for email, reports, and webhooks.',          'Queue'),
        s('Meilisearch',          'meilisearch',   'Fast, typo-tolerant full-text search. Self-hosted and easy to integrate.',       'Search'),
        s('PostHog',              'posthog',       'Feature flags, A/B tests, session replays, and custom dashboards.',              'Analytics'),
        s('Grafana',              'grafana',       'Dashboards for metrics (Prometheus), logs (Loki), and traces (Tempo).',          'Observability'),
        s('Prometheus',           'prometheus',    'Pulls metrics from all services. Evaluates alert rules and fires Alertmanager.', 'Observability'),
        s('Loki',                 'grafana',       'Log aggregation — store and query logs from all containers cheaply.',            'Observability'),
        s('AWS Secrets Manager',  'amazonaws',     'Rotate DB passwords and API keys automatically. IAM-based access, no env vars.','Security'),
        s('AWS WAF',              'amazonaws',     'Managed rules for SQLi, XSS, and known bad IPs in front of the ALB.',           'Security'),
        s('Terraform',            'terraform',     'IaC for VPC, ECS, RDS, ElastiCache, ALB, WAF — reproducible infrastructure.', 'DevOps'),
        s('Docker',               'docker',        'Multi-stage Dockerfiles per service. Final images under 150MB.',                'DevOps'),
        s('GitHub Actions',       'githubactions', 'Full pipeline: test → build → push ECR → deploy to ECS with OIDC auth.',       'DevOps'),
        s('Jest',                 'jest',          'Unit + integration tests for all microservices with 80%+ coverage.',            'Testing'),
        s('Playwright',           'playwright',    'E2E tests on all key user journeys across Chrome, Firefox, and Safari.',        'Testing'),
      ],
      checklist: [
        t('pr-f1','Frontend','Turborepo monorepo setup','Init with `npx create-turbo@latest`. Create packages: `@app/ui` (shared components), `@app/utils`, `@app/types`. Configure `turbo.json` pipeline. Each team\'s app lives in `apps/`. Build cache across CI runs.', ['Turborepo','TypeScript']),
        t('pr-f2','Frontend','Module Federation for feature isolation','Webpack Module Federation in each feature app. The shell loads remotes at runtime. Define strict TypeScript contracts in `@app/types`. Teams deploy independently — no shell redeploy required.', ['Module Federation','Webpack']),
        t('pr-a1','Auth','RBAC with fine-grained permissions','Roles: `admin`, `editor`, `viewer`. Resources: `project`, `report`. Actions: `read`, `write`, `delete`. Store permission matrix in DB. Check permissions in both middleware and UI components (hide disabled actions).', ['Auth.js','NestJS']),
        t('pr-a2','Auth','Enterprise SSO (SAML + OIDC)','Integrate Auth.js with Okta/Azure AD via SAML 2.0 using the `saml-jackson` adapter. Each org configures their own IdP in settings. Required for any B2B enterprise deal above 50 seats.', ['Auth.js']),
        t('pr-b1','Backend','NestJS API Gateway with circuit breaker','Build the gateway to route to Auth, Orders, Billing microservices via gRPC. Implement circuit breaker (`opossum`) to gracefully fallback when a downstream service is slow or down.', ['NestJS','gRPC']),
        t('pr-b2','Backend','Event-driven microservices via RabbitMQ','Topic exchanges per domain: `user.*`, `order.*`, `billing.*`. Each service subscribes only to its events. Write event contracts as TypeScript interfaces in `@app/types`. Validate with Zod on consume.', ['RabbitMQ','NestJS']),
        t('pr-b3','Backend','API versioning + deprecation policy','Use URI versioning (`/v1/`, `/v2/`). Add a `Deprecation` response header with a sunset date. Maintain v1 for 6 months after v2 launch. Document the migration guide in Swagger.', ['NestJS','Swagger']),
        t('pr-d1','Database','AWS RDS Multi-AZ + read replicas','Terraform: Multi-AZ primary for writes, 2 read replicas for reporting. Configure Prisma with datasource aliases for read/write splitting. Automated RDS snapshots daily with 7-day retention.', ['PostgreSQL','Terraform']),
        t('pr-d2','Database','Cache strategy with Redis ElastiCache','Cache-aside pattern: check Redis → on miss, query DB → write to Redis with 5-min TTL. Invalidate on writes. Use Redis keyspace notifications to detect stale entries. Monitor hit rate in Grafana.', ['Redis']),
        t('pr-sr1','Search','Integrate Meilisearch','Deploy Meilisearch in Docker. Create indexes for searchable resources. Sync from PostgreSQL to Meilisearch via a BullMQ job on every create/update/delete. Power the global search bar from the Meilisearch API.', ['Meilisearch']),
        t('pr-an1','Analytics','Feature flags + A/B testing','Use PostHog feature flags to gate new features. Set up A/B tests on key conversion pages. Track experiment results in PostHog. Only ship features that win their A/B test. Review results weekly with the product team.', ['PostHog']),
        t('pr-ob1','Observability','Grafana + Prometheus + Loki stack','Deploy the Grafana LGTM stack. Expose `/metrics` from each NestJS service using `prom-client`. Ship container logs to Loki via Promtail. Build a Grafana dashboard per service with request rate, error rate, latency (RED metrics).', ['Grafana','Prometheus','Loki']),
        t('pr-ob2','Observability','SLO alerts & on-call runbooks','Define SLOs: API p99 latency < 300ms, error rate < 0.5%, uptime > 99.9%. Create Prometheus alert rules. Route critical alerts to PagerDuty, warnings to Slack. Write runbooks for each alert. Run monthly SLO reviews.', ['Prometheus','Grafana']),
        t('pr-sc1','Security','AWS Secrets Manager for all credentials','Store DB passwords, JWT secrets, Stripe keys in Secrets Manager. Grant ECS Task IAM roles read access. Auto-rotate DB credentials every 30 days. Zero secrets in env vars, codebase, or CI config.', ['AWS Secrets Manager','Terraform']),
        t('pr-sc2','Security','AWS WAF + Shield Standard','Enable Managed Rule Groups: `AWSManagedRulesCommonRuleSet` (XSS, SQLi), `AWSManagedRulesAmazonIpReputationList`. Rate-based rules: block IPs sending > 2,000 requests/5 min. Log blocked requests to S3.', ['AWS WAF']),
        t('pr-o1','DevOps','Terraform modules for full AWS stack','Modules: `vpc`, `ecs-service`, `rds`, `elasticache`, `alb`, `waf`, `ecr`. Separate `terraform/staging` and `terraform/production` workspaces. Store state in S3 with DynamoDB locking.', ['Terraform','AWS ECS']),
        t('pr-o2','DevOps','Blue-Green deployments via ECS','ECS with two target groups (blue + green). GitHub Actions builds, pushes image, updates task definition, triggers CodeDeploy blue-green. Zero-downtime. Auto-rollback on unhealthy health checks.', ['AWS ECS','GitHub Actions']),
        t('pr-t1','Testing','80%+ coverage + Playwright E2E','Jest unit tests per service. Playwright E2E for auth, billing, and core flows. Run E2E against staging on every merge to main. Publish Playwright HTML reports as CI artifacts. Block release on E2E failure.', ['Jest','Playwright']),
      ],
      nodes: [
        { id: 'n1', position: { x: 250, y: 0   }, data: { label: 'Web Client (Turborepo MFE)' } },
        { id: 'n2', position: { x: 250, y: 150 }, data: { label: 'NestJS API Gateway' } },
        { id: 'n3', position: { x: 80,  y: 300 }, data: { label: 'Auth + Billing Services' } },
        { id: 'n4', position: { x: 420, y: 300 }, data: { label: 'Orders + Notification Services' } },
        { id: 'n5', position: { x: 250, y: 450 }, data: { label: 'RabbitMQ Event Bus' } },
        { id: 'n6', position: { x: 80,  y: 600 }, data: { label: 'PostgreSQL HA + Redis' } },
        { id: 'n7', position: { x: 420, y: 600 }, data: { label: 'Meilisearch + S3 + SES' } },
        { id: 'n8', position: { x: 250, y: 750 }, data: { label: 'Grafana + Prometheus + Loki' } },
      ],
      edges: [
        { id: 'e1', source: 'n1', target: 'n2' },
        { id: 'e2', source: 'n2', target: 'n3' },
        { id: 'e3', source: 'n2', target: 'n4' },
        { id: 'e4', source: 'n3', target: 'n5' },
        { id: 'e5', source: 'n4', target: 'n5' },
        { id: 'e6', source: 'n3', target: 'n6' },
        { id: 'e7', source: 'n4', target: 'n7' },
        { id: 'e8', source: 'n5', target: 'n8' },
      ],
    };

    // ──────────────────────────────────────────────────────────────
    // Enterprise  ·  500k+ users  ·  Global scale, compliance
    // ──────────────────────────────────────────────────────────────
    const Enterprise = {
      techStack: [
        s('React MFE',           'react',            'Micro-frontend shell. Each squad owns and deploys their MFE independently.',      'Frontend'),
        s('TypeScript',          'typescript',       'Strict contracts across all MFEs, packages, and backend services.',               'Frontend'),
        s('Storybook',           'storybook',        'Shared design system. Every component documented, tested, and versioned.',        'Frontend'),
        s('Vault + SSO',         'vault',            'Vault-issued tokens. SAML SSO via Okta/Azure AD. Zero-trust identity.',          'Auth'),
        s('OPA',                 'openpolicyagent',  'Open Policy Agent — centralized policy engine for fine-grained authz.',          'Auth'),
        s('Spring Boot',         'springboot',       'Enterprise Java — DDD, CQRS, event sourcing. Battle-tested in finance.',         'Backend'),
        s('Go',                  'go',               'High-throughput workers. Goroutines handle millions of concurrent events.',       'Backend'),
        s('gRPC + Protobuf',     'grpc',             'Strict binary contracts between all services. 10× faster than REST/JSON.',       'Backend'),
        s('PostgreSQL',          'postgresql',       'Core transactional store. Multi-region Patroni HA cluster.',                     'Database'),
        s('Cassandra',           'apachecassandra',  'Multi-region NoSQL. Petabyte-scale write-heavy time-series telemetry.',          'Database'),
        s('Elasticsearch',       'elasticsearch',    'Full-text search + audit log aggregation across all services.',                  'Database'),
        s('Apache Kafka',        'apachekafka',      'Event streaming: replay domain events, CQRS read models, outbox pattern.',       'Queue'),
        s('Stripe + Paddle',     'stripe',           'Stripe for US/EU. Paddle as MoR for global compliance and VAT handling.',        'Payment'),
        s('AWS SES',             'amazonaws',        'Millions of emails/day at sub-cent cost. Dedicated IPs for deliverability.',     'Email'),
        s('S3 Multi-region',     'amazons3',         'Cross-region replication for DR. S3 Object Lock for compliance retention.',      'Storage'),
        s('Elasticsearch',       'elasticsearch',    'Cluster across 3 AZs for product search, log search, and compliance queries.',   'Search'),
        s('OpenAI API',          'openai',           'GPT-4 for intelligent features — summarization, classification, copilot.',       'AI'),
        s('LangChain',           'langchain',        'Orchestrate multi-step AI chains, RAG pipelines, and tool calling.',             'AI'),
        s('Pinecone',            'pinecone',         'Vector DB for semantic search and RAG — find relevant docs by meaning.',         'AI'),
        s('Datadog',             'datadog',          'APM, logs, metrics, traces — unified platform. SLO tracking built-in.',          'Observability'),
        s('OpenTelemetry',       'opentelemetry',    'Instrument all services once. Export traces to Datadog, Jaeger, or Tempo.',      'Observability'),
        s('Istio',               'istio',            'Service mesh — mTLS between all pods, traffic policies, circuit breaking.',     'Security'),
        s('HashiCorp Vault',     'vault',            'Dynamic secrets: DB creds rotate every hour. API keys auto-expire.',             'Security'),
        s('Kubernetes (EKS)',    'kubernetes',        'Container orchestration: auto-scaling, self-healing, zero-downtime deploys.',   'DevOps'),
        s('Terraform',           'terraform',        'Every AWS resource as code — EKS, MSK, RDS, Cassandra, Vault, IAM.',            'DevOps'),
        s('ArgoCD',              'argo',             'GitOps: cluster state always mirrors your Git repo. Automatic sync on merge.',  'DevOps'),
        s('Helm',                'helm',             'Package manager for K8s. One chart per service, env-specific value files.',     'DevOps'),
        s('JUnit 5',             'junit5',           'Spring Boot tests (@WebMvcTest, @DataJpaTest) with Testcontainers. 85%+.',      'Testing'),
        s('Playwright',          'playwright',       'E2E across all MFE apps. Multi-browser, visual regression, accessibility.',     'Testing'),
        s('k6',                  'k6',               'Load tests against staging before every release. SLOs enforced in CI.',         'Testing'),
      ],
      checklist: [
        t('en-f1','Frontend','MFE shell + shared Storybook design system','Build the host shell. Extract all UI into `@design-system` package. Document every component in Storybook with axe-core accessibility checks. Enforce Storybook tests in CI. Publish to GitHub Packages.', ['React MFE','Storybook','TypeScript']),
        t('en-f2','Frontend','Multi-tenant white-labeling','Read tenant from subdomain. Fetch tenant theme (colors, logo, feature flags) from a config API at load time. All pages must render per tenant without code duplication. Test with tenant fixture datasets.', ['React MFE','TypeScript']),
        t('en-f3','Frontend','WCAG 2.1 AA accessibility audit','Run axe-core in Playwright on every page. Fix all critical and serious violations. Generate a VPAT for enterprise sales. Required for government, healthcare, and financial sector customers.', ['Playwright','Storybook']),
        t('en-a1','Auth','Zero-trust identity with Vault + OPA','Every service authenticates with a Vault AppRole. OPA evaluates every authorization request against a central policy store. No service trusts another without a valid Vault-issued token. Audit all policy decisions to Elasticsearch.', ['Vault + SSO','OPA','Istio']),
        t('en-a2','Auth','Enterprise SSO + SCIM provisioning','Support SAML 2.0 and OIDC for customer IdPs (Okta, Azure AD, Ping). Implement SCIM 2.0 so enterprise IT can provision/deprovision users from their directory. Required for 500+ seat enterprise contracts.', ['OPA']),
        t('en-b1','Backend','Spring Boot DDD bounded contexts','Structure as bounded contexts: Identity, Billing, Orders, Inventory, Notifications. Each is a separate Spring Boot module with its own DB schema. Contexts communicate only via Kafka domain events — no shared DB.', ['Spring Boot','gRPC + Protobuf']),
        t('en-b2','Backend','Go workers for high-throughput ingestion','Go services ingesting millions of telemetry events per day. Use goroutines + buffered channels. Expose gRPC endpoints with Protobuf contracts from a shared `proto/` repo. Benchmark with `go test -bench`.', ['Go','gRPC + Protobuf']),
        t('en-b3','Backend','CQRS + Transactional Outbox Pattern','Separate write models (commands) from read models (queries). Outbox Pattern: write events to an `outbox` table atomically with the business transaction. Debezium CDC relays the outbox to Kafka. Guarantees exactly-once delivery.', ['Apache Kafka','Spring Boot']),
        t('en-d1','Database','Multi-region PostgreSQL with Patroni HA','Deploy Patroni-managed PostgreSQL across 2+ AWS regions. Patroni handles automatic leader election on primary failure. Test failover manually: kill primary → replica promotes in < 30s. Document runbook.', ['PostgreSQL']),
        t('en-d2','Database','Multi-region Cassandra ring','Cassandra with `NetworkTopologyStrategy` across 3 regions. RF=3 per region. Use `LOCAL_QUORUM` for writes. Schedule anti-entropy repairs with Cassandra Reaper weekly. Monitor with Instaclustr or Cassandra Reaper UI.', ['Cassandra']),
        t('en-d3','Database','Elasticsearch for search + audit logs','Deploy Elastic Cloud. Index all domain events for SOC2 audit trail. Use ILM to move old indexes to cold storage after 90 days. Build Kibana dashboards for compliance officers. Ingest logs via Fluentd/Logstash.', ['Elasticsearch']),
        t('en-q1','Queue','Kafka on AWS MSK','Terraform to provision AWS MSK (3-broker across 3 AZs). Topic naming: `domain.entity.event` (e.g. `billing.subscription.cancelled`). TLS encryption and IAM auth. Retention: 7 days for event replay. Monitor consumer lag.', ['Apache Kafka','Terraform']),
        t('en-q2','Queue','Schema Registry + backward compatibility','Deploy Confluent Schema Registry. All Kafka messages use Avro schemas. Enforce backward-compatibility rule in CI — new schemas must be readable by old consumers. Block the release if schema breaks compatibility.', ['Apache Kafka']),
        t('en-ai1','AI','RAG pipeline with LangChain + Pinecone','Embed product docs + user data into Pinecone. On user query, retrieve top-k chunks, inject into GPT-4 prompt, stream the response. Cache identical queries in Redis (TTL 1h). Log all AI calls for cost tracking and audit.', ['OpenAI API','LangChain','Pinecone']),
        t('en-ai2','AI','AI classification & summarization','OpenAI API for: auto-classify support tickets, summarize long reports, suggest tags. Rate-limit AI calls per org. Fallback gracefully if OpenAI API is unavailable. Track AI costs per org in the billing system.', ['OpenAI API','LangChain']),
        t('en-ob1','Observability','Full-stack distributed tracing','Datadog Agent as K8s DaemonSet. Instrument Spring Boot with `dd-java-agent`, Go with `dd-trace-go`. OpenTelemetry propagates trace context. A single trace follows a request through 10+ services end-to-end. Alert on p99 regression.', ['Datadog','OpenTelemetry']),
        t('en-ob2','Observability','SLOs + burn rate alerts','Define SLOs in Datadog: API availability > 99.95%, p99 < 200ms. Burn rate alerts: page on-call if 1-hour burn rate > 14.4× budget. Monthly SLO review. Error budget tracked in a shared team dashboard.', ['Datadog']),
        t('en-sc1','Security','Istio mTLS for all pod traffic','Install Istio with `PeerAuthentication` in `STRICT` mode across all namespaces. Zero unencrypted pod-to-pod traffic. `AuthorizationPolicy` restricts which services can call which endpoints. Visualize in Kiali.', ['Istio','Kubernetes (EKS)']),
        t('en-sc2','Security','HashiCorp Vault dynamic credentials','Vault database secrets engine generates unique PostgreSQL credentials per service request with 1-hour TTL. Vault Agent Injector delivers credentials as pod annotations. Credentials auto-rotate. Humans never see DB passwords.', ['HashiCorp Vault','Kubernetes (EKS)']),
        t('en-sc3','Security','SOC2 Type II + GDPR compliance','K8s audit logging to CloudWatch. Elasticsearch audit index stores every data access event. GDPR "right to erasure" as a Kafka event triggering deletion across all services. Prepare evidence for SOC2 auditors.', ['Kubernetes (EKS)','Elasticsearch']),
        t('en-o1','DevOps','EKS cluster with Terraform (multi-AZ)','Terraform EKS module: managed node groups across 3 AZs, IRSA for pod-level IAM, VPC CNI, cluster autoscaler, Karpenter for spot nodes. Mix on-demand (critical) + Spot (batch workers) for 40% cost savings.', ['Kubernetes (EKS)','Terraform']),
        t('en-o2','DevOps','Helm charts + ArgoCD GitOps','Helm chart per service. ArgoCD Application per chart. Auto-sync on merge to `main`. Argo Rollouts for canary: shift 5% → 25% → 100% traffic with auto-rollback on error spike. No manual kubectl in production.', ['ArgoCD','Helm','Kubernetes (EKS)']),
        t('en-o3','DevOps','Chaos engineering with AWS FIS','Use AWS Fault Injection Simulator: kill random pods, inject latency, simulate AZ outage. Run monthly. Document runbooks per failure mode. Measure MTTR. Required for enterprise SLAs of 99.99% uptime and ISO 27001.', ['Kubernetes (EKS)']),
        t('en-t1','Testing','85%+ coverage with Testcontainers','JUnit 5 + Spring Boot Test slice annotations. Testcontainers for real PostgreSQL, Kafka, Redis in CI. Enforce 85% coverage with JaCoCo. Block PRs that drop coverage. Mutation testing with PIT to find untested logic.', ['JUnit 5']),
        t('en-t2','Testing','k6 load tests before every release','k6 scripts simulating 10,000 concurrent users. SLOs: p99 < 200ms, error rate < 0.1%. Run in a dedicated CI job before every production release. Auto-block release if SLOs are violated. Publish results as CI artifacts.', ['k6','GitHub Actions']),
      ],
      nodes: [
        { id: 'n1',  position: { x: 250, y: 0   }, data: { label: 'CDN + WAF (CloudFront)' } },
        { id: 'n2',  position: { x: 80,  y: 150 }, data: { label: 'MFE Shell + Storybook DS' } },
        { id: 'n3',  position: { x: 420, y: 150 }, data: { label: 'MFE: Admin + Billing' } },
        { id: 'n4',  position: { x: 250, y: 300 }, data: { label: 'Spring API Gateway + OPA' } },
        { id: 'n5',  position: { x: 80,  y: 450 }, data: { label: 'Spring Domain Services' } },
        { id: 'n6',  position: { x: 420, y: 450 }, data: { label: 'Go Analytics + AI Workers' } },
        { id: 'n7',  position: { x: 250, y: 600 }, data: { label: 'Kafka (MSK) + Schema Registry' } },
        { id: 'n8',  position: { x: 80,  y: 750 }, data: { label: 'PostgreSQL Patroni + Cassandra' } },
        { id: 'n9',  position: { x: 420, y: 750 }, data: { label: 'Elasticsearch + Pinecone' } },
        { id: 'n10', position: { x: 250, y: 900 }, data: { label: 'Datadog + Vault + Istio' } },
      ],
      edges: [
        { id: 'e1',  source: 'n1',  target: 'n2'  },
        { id: 'e2',  source: 'n1',  target: 'n3'  },
        { id: 'e3',  source: 'n2',  target: 'n4'  },
        { id: 'e4',  source: 'n3',  target: 'n4'  },
        { id: 'e5',  source: 'n4',  target: 'n5'  },
        { id: 'e6',  source: 'n4',  target: 'n6'  },
        { id: 'e7',  source: 'n5',  target: 'n7'  },
        { id: 'e8',  source: 'n6',  target: 'n7'  },
        { id: 'e9',  source: 'n5',  target: 'n8'  },
        { id: 'e10', source: 'n6',  target: 'n9'  },
        { id: 'e11', source: 'n7',  target: 'n10' },
      ],
    };

    const blueprints: Record<string, any> = { MVP, Startup, Professional, Enterprise };
    return blueprints[level] || blueprints['MVP'];
  }
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
