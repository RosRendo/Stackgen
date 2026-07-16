'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckSquare, ChevronDown, ChevronRight, Settings, FolderTree, Database, Globe, Shield, Terminal, Check, Code, TestTubes, CheckCircle2, Circle, Clock } from 'lucide-react';
import { TECH_ENCYCLOPEDIA } from '@/data/tech-stack-data';

const MASTER_CHECKLIST = [
  {
    id: "phase-3",
    title: "PART 1 \u2014 DESIGN & SETUP *(BEFORE WRITING CODE)*",
    iconName: "Settings",
    minLevel: 1,
    sections: [
      {
        title: "\ud83c\udfa8 Design (UI/UX)",
        items: [
          {
            required: true,
            optional: false,
            label: "Create Figma wireframes (free tier)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Define color system + typography",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Design responsive breakpoints (mobile-first)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Component library in Figma",
            desc: ""
          },
        ]
      },
      {
        title: "\u2699\ufe0f Frontend \u2014 Framework Choice",
        items: [
          {
            required: true,
            optional: false,
            label: "Choose: Next.js (recommended) / Remix / Vite+React",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: ": Vue 3 + Nuxt / SvelteKit / Astro",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Init project: `npx create-next-app@latest`",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Set up Tailwind CSS + shadcn/ui",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "ESLint + Prettier config",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "`npm run lint` \u2014 pass before any feature",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83d\uddc4\ufe0f Backend \u2014 BaaS (MVP approach)",
        items: [
          {
            required: true,
            optional: false,
            label: "Supabase: init project, get ANON key + URL",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Or: Firebase (Firestore + Auth)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Set up env vars (`.env.local`)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Define DB schema in Supabase table editor",
            desc: ""
          },
        ]
      },
    ]
  },
  {
    id: "phase-4",
    title: "PART 2 \u2014 CORE FEATURES *(AUTHENTICATION, DATA, UI)*",
    iconName: "Shield",
    minLevel: 1,
    sections: [
      {
        title: "\ud83d\udd10 Auth",
        items: [
          {
            required: true,
            optional: false,
            label: "Supabase Auth: email/password + OAuth (Google)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Protected routes (Next.js middleware)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Session handling + refresh tokens",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Magic link login",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Auth.js (NextAuth) if custom backend",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83d\udcbb Frontend Build",
        items: [
          {
            required: true,
            optional: false,
            label: "Pages: home, dashboard, profile, 404",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "API calls via React Query / SWR / fetch",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Form validation: Zod + react-hook-form",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Toast notifications: sonner or react-hot-toast",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Framer Motion (animations)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Radix UI / Headless UI",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "`npm run build` \u2014 must pass",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83d\uddc4\ufe0f Database",
        items: [
          {
            required: true,
            optional: false,
            label: "Supabase: Row Level Security (RLS) policies",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Create indexes on queried columns",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Prisma ORM (if adding custom API)",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83d\udcb3 Payments",
        items: [
          {
            required: false,
            optional: true,
            label: "Stripe: create account, get test keys",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Stripe Checkout or Stripe Elements",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Webhook: `stripe listen --forward-to localhost`",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Alt: Paddle / Dodo Payments / LemonSqueezy",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Alt: PayPal SDK",
            desc: ""
          },
        ]
      },
    ]
  },
  {
    id: "phase-5",
    title: "PART 3 \u2014 QUALITY & THIRD-PARTY *(MONITORING, STORAGE, EMAIL)*",
    iconName: "CheckSquare",
    minLevel: 1,
    sections: [
      {
        title: "\ud83d\udcc1 File Storage",
        items: [
          {
            required: true,
            optional: false,
            label: "Supabase Storage (images, docs) \u2014 free 1GB",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Cloudinary (image transforms, CDN)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Uploadthing (easy file uploads)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "AWS S3 + CloudFront",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83d\udce7 Email",
        items: [
          {
            required: true,
            optional: false,
            label: "Resend (free 3k/mo) or SendGrid",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Transactional emails: welcome, reset, receipt",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Loops / Mailchimp (marketing)",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83d\udcca Monitoring & Logs",
        items: [
          {
            required: true,
            optional: false,
            label: "Sentry (free tier): error tracking",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Vercel Analytics (free): page views, vitals",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "PostHog (events, funnels, replays)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Logflare / Axiom for log drain",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83e\uddea Testing",
        items: [
          {
            required: true,
            optional: false,
            label: "Vitest: unit tests for utils + logic",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "React Testing Library: component tests",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Playwright E2E (critical flows)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "`npm run test` \u2014 all pass before deploy",
            desc: ""
          },
        ]
      },
    ]
  },
  {
    id: "phase-6",
    title: "PART 4 \u2014 DEPLOY & LAUNCH *(CI/CD, SEO, COMPLIANCE)*",
    iconName: "Terminal",
    minLevel: 1,
    sections: [
      {
        title: "\ud83d\ude80 CI/CD",
        items: [
          {
            required: true,
            optional: false,
            label: "Vercel: connect GitHub repo, auto-deploy on push",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Preview deployments per PR",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "GitHub Actions: lint + test on PR",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Railway / Render (if Node backend)",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83c\udf10 DNS & CDN",
        items: [
          {
            required: true,
            optional: false,
            label: "Buy domain (Namecheap / Cloudflare)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Point DNS to Vercel",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "SSL auto-provisioned by Vercel",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Cloudflare CDN in front (DDoS, cache)",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83d\udd12 Security & Compliance",
        items: [
          {
            required: true,
            optional: false,
            label: "HTTPS only \u2014 enforce redirect",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Content Security Policy headers",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Privacy policy page ( by law)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Terms of service page",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Cookie consent banner (GDPR if EU)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "CORS: allowlist your domains in Supabase",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Rate limiting (Upstash Ratelimit)",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83d\udd0d SEO",
        items: [
          {
            required: true,
            optional: false,
            label: "Next.js Metadata API (title, description, OG)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "sitemap.xml + robots.txt",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "next-seo library",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Structured data (JSON-LD)",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83d\udcf1 Mobile",
        items: [
          {
            required: false,
            optional: true,
            label: "React Native + Expo (cross-platform app)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Capacitor (wrap web app)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "PWA (next-pwa manifest)",
            desc: ""
          },
        ]
      },
    ]
  },
  {
    id: "phase-8",
    title: "PART 1 \u2014 ARCHITECTURE & DESIGN *(SCHEMA-FIRST, ROLES FIRST)*",
    iconName: "Settings",
    minLevel: 2,
    sections: [
      {
        title: "\ud83c\udfd7\ufe0f Architecture Decisions",
        items: [
          {
            required: true,
            optional: false,
            label: "Define user roles (admin / user / provider / guest)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Draw ERD: tables, relations, FK constraints",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Decide: Supabase vs Firebase (Firestore=noSQL, Supabase=Postgres)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Plan realtime needs (chat, notifications, live data)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Multi-tenancy (org/workspace model)",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83c\udfa8 Design System",
        items: [
          {
            required: true,
            optional: false,
            label: "Figma: full component library (atoms \u2192 organisms)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Design token export to CSS vars / Tailwind config",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Dark mode design variants",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Storybook component docs",
            desc: ""
          },
        ]
      },
      {
        title: "\u2699\ufe0f Project Setup",
        items: [
          {
            required: false,
            optional: true,
            label: "Monorepo: Turborepo (web + app + shared pkg)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Or: single Next.js app (simpler to start)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "pnpm workspaces setup",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "TypeScript strict mode enabled",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "ESLint + Prettier + Husky pre-commit hooks",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "`npm run lint && npm run build` \u2014 pipeline step",
            desc: ""
          },
        ]
      },
    ]
  },
  {
    id: "phase-9",
    title: "PART 2 \u2014 BACKEND & DATA *(SUPABASE CONFIG, RLS, EDGE FUNCTIONS)*",
    iconName: "Database",
    minLevel: 2,
    sections: [
      {
        title: "\ud83d\uddc4\ufe0f Database (Supabase)",
        items: [
          {
            required: true,
            optional: false,
            label: "Tables: users, profiles, [domain tables]",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "RLS policy for every table (never skip!)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "DB migrations via Supabase CLI (`supabase db diff`)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Seed data for local dev",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Generated TypeScript types (`supabase gen types`)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "pg_cron for scheduled jobs",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "pgvector for AI/search features",
            desc: ""
          },
        ]
      },
      {
        title: "\u26a1 Edge Functions / Backend",
        items: [
          {
            required: true,
            optional: false,
            label: "Supabase Edge Functions (Deno) for webhooks, stripe",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Or: Next.js API routes (App Router route handlers)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Or: separate Node.js + Express / Fastify API",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Zod schema validation on all API inputs",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Error handling middleware",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "tRPC (end-to-end type-safe API)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "GraphQL with Pothos / Hasura",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83d\udd04 Realtime",
        items: [
          {
            required: true,
            optional: false,
            label: "Supabase Realtime: subscribe to table changes",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Presence (show online users)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Broadcast (push notifications via websocket)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Ably / Pusher (more scalable)",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83d\udcbe Cache Layer",
        items: [
          {
            required: true,
            optional: false,
            label: "Upstash Redis (serverless Redis, pay-per-request)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Cache: session data, rate limits, API responses",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "TTL strategy per data type",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Vercel KV (built-in Redis)",
            desc: ""
          },
        ]
      },
    ]
  },
  {
    id: "phase-10",
    title: "PART 3 \u2014 THIRD-PARTY INTEGRATIONS *(ALL THE SERVICES THAT COST MONEY)*",
    iconName: "CheckSquare",
    minLevel: 2,
    sections: [
      {
        title: "\ud83d\udcb3 Payments",
        items: [
          {
            required: true,
            optional: false,
            label: "Stripe: products, prices, subscriptions",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Stripe Customer Portal (self-serve billing)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Webhook: `/api/stripe/webhook` handler",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Test all scenarios: upgrade, downgrade, cancel, refund",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Paddle (handles global VAT/tax)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Dodo Payments (emerging markets)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "PayPal SDK / Braintree",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Razorpay (India focus)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Xendit (SEA markets)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Midtrans (Indonesia)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "2C2P (Thailand / Malaysia)",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83d\udd0d Search",
        items: [
          {
            required: true,
            optional: false,
            label: "Supabase Full Text Search (pg_trgm) \u2014 free",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Elasticsearch / OpenSearch (complex queries)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Algolia (hosted, great UX)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Typesense (self-host, affordable)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Meilisearch (open source)",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83d\udcc1 Storage & Media",
        items: [
          {
            required: true,
            optional: false,
            label: "Supabase Storage with bucket policies",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Cloudinary (transforms, crop, resize)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "ImageKit (alternative to Cloudinary)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "AWS S3 + CloudFront CDN",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Bunny.net CDN (cheap video/file CDN)",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83d\udce7 Email & Notifications",
        items: [
          {
            required: true,
            optional: false,
            label: "Resend (transactional) + React Email templates",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Brevo / Mailchimp (marketing campaigns)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "OneSignal (push notifications \u2014 web/mobile)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Twilio (SMS, WhatsApp)",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83e\udd16 AI / ML",
        items: [
          {
            required: false,
            optional: true,
            label: "OpenAI API (GPT-4, embeddings)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Anthropic Claude API",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Vercel AI SDK (streaming, hooks)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "LangChain / LlamaIndex (RAG)",
            desc: ""
          },
        ]
      },
    ]
  },
  {
    id: "phase-11",
    title: "PART 4 \u2014 OPS, SECURITY, PERFORMANCE *(BEFORE YOU CALL IT PRODUCTION)*",
    iconName: "Terminal",
    minLevel: 2,
    sections: [
      {
        title: "\ud83d\udcca Monitoring & Observability",
        items: [
          {
            required: true,
            optional: false,
            label: "Sentry: errors + performance tracing",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Winston (Node.js) or Pino logger",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Logflare / Axiom: log aggregation",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Supabase Dashboard: DB metrics, slow queries",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Uptime monitor: BetterUptime / UptimeRobot",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Datadog / New Relic (full APM)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Grafana + Prometheus (self-hosted)",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83d\udd12 Security",
        items: [
          {
            required: true,
            optional: false,
            label: "All secrets in `.env` \u2014 never committed",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Doppler / Vault for secrets management",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "OWASP top 10 checklist",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Input sanitization + SQL injection prevention",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Rate limiting: Upstash Ratelimit",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "CORS config: allowlist origins only",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "helmet.js (Node.js HTTP security headers)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Privacy policy, ToS, cookie consent",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "GDPR: data deletion endpoint",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Snyk / Dependabot (dependency scan)",
            desc: ""
          },
        ]
      },
      {
        title: "\u26a1 Performance",
        items: [
          {
            required: true,
            optional: false,
            label: "Lighthouse score >85 (`npx lighthouse`)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Core Web Vitals: LCP <2.5s, CLS <0.1, INP <200ms",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Image optimization: next/image or sharp",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "`npm run build` (Next.js shows bundle size)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "@next/bundle-analyzer",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Lazy load heavy components (dynamic import)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "DB: explain analyze on slow queries",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83d\udd04 CI/CD",
        items: [
          {
            required: true,
            optional: false,
            label: "GitHub Actions: lint \u2192 test \u2192 build \u2192 deploy",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Vercel: auto-deploy on main push",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Preview URL per pull request",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Supabase CLI: migration check in CI",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Playwright E2E in CI",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Chromatic (visual regression Storybook)",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83e\uddea Testing",
        items: [
          {
            required: true,
            optional: false,
            label: "Unit: Vitest (utils, hooks, business logic)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Integration: supertest (API routes)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "E2E: Playwright (signup, pay, core flow)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "`npm run test:coverage` \u2014 target >70%",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "MSW (mock service worker for API mocking)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Storybook interaction tests",
            desc: ""
          },
        ]
      },
    ]
  },
  {
    id: "phase-13",
    title: "PART 1 \u2014 ARCHITECTURE & INFRASTRUCTURE DESIGN *(DESIGN BEFORE CODE)*",
    iconName: "Settings",
    minLevel: 3,
    sections: [
      {
        title: "\ud83c\udfd7\ufe0f System Design",
        items: [
          {
            required: true,
            optional: false,
            label: "Architecture diagram: services, data flow, auth flow",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Choose API style: REST / GraphQL / tRPC / gRPC",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Decide: monolith or microservices (start monolith!)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "DB choice: PostgreSQL (recommended) / MySQL / MongoDB",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Cache strategy: Redis (sessions, hot data, queues)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Message queue: BullMQ / RabbitMQ (async jobs)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Event-driven (Kafka for high throughput)",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83c\udfa8 Frontend Architecture",
        items: [
          {
            required: true,
            optional: false,
            label: "Next.js App Router (SSR+RSC) \u2014 recommended",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Or: Remix / SvelteKit / Nuxt 3",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "State: Zustand / Jotai (global) + React Query (server)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Design system: custom Tailwind tokens",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Storybook for component isolation",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Nx / Turborepo monorepo",
            desc: ""
          },
        ]
      },
      {
        title: "\u2699\ufe0f Backend Framework",
        items: [
          {
            required: true,
            optional: false,
            label: "Node.js + Fastify (fast, schema-first) \u2014 recommended",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Or: Node.js + Express / Hono / NestJS",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Or: Python + FastAPI / Django",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Or: Go + Gin / Fiber (high performance)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Or: Elixir + Phoenix (realtime specialist)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "ORM: Drizzle (TS-first) or Prisma or Kysely",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Input validation: Zod (TS) or Pydantic (Python)",
            desc: ""
          },
        ]
      },
    ]
  },
  {
    id: "phase-14",
    title: "PART 2 \u2014 BACKEND & DATA LAYER *(API, DB, AUTH FROM SCRATCH)*",
    iconName: "Shield",
    minLevel: 3,
    sections: [
      {
        title: "\ud83d\udd10 Authentication (Custom)",
        items: [
          {
            required: true,
            optional: false,
            label: "JWT: access token (15min) + refresh token (7d)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Bcrypt password hashing (rounds: 12)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "OAuth 2.0: Google, GitHub providers",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Refresh token rotation + revocation",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "2FA: TOTP (speakeasy / otplib)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Passkey / WebAuthn (Simplewebauthn)",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83d\uddc4\ufe0f Database",
        items: [
          {
            required: true,
            optional: false,
            label: "PostgreSQL: schema + migrations (Drizzle/Prisma)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Indexes on all FK, search, sort columns",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Connection pooling: PgBouncer or Prisma Accelerate",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Read replicas for heavy read loads",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Backup: daily automated + point-in-time recovery",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Neon DB (serverless Postgres, branching)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "TimescaleDB (time-series data)",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83d\udcbe Cache & Queues",
        items: [
          {
            required: true,
            optional: false,
            label: "Redis (Upstash or self-hosted): session, cache, pub/sub",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "BullMQ: email queue, image resize, exports",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Job dashboard: Bull Board or Arena",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Dead letter queue + retry logic",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Kafka (Confluent) for event streaming",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83d\udd0d Search",
        items: [
          {
            required: true,
            optional: false,
            label: "Postgres FTS + pg_trgm for basic search",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Elasticsearch (self-hosted or Elastic Cloud)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "OpenSearch (AWS managed)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Meilisearch (easier self-hosted)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Algolia (hosted, instant search UI)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Typesense (open source, fast)",
            desc: ""
          },
        ]
      },
    ]
  },
  {
    id: "phase-15",
    title: "PART 3 \u2014 THIRD-PARTY & INTEGRATIONS *(PAYMENTS, MEDIA, EMAIL, MONITORING)*",
    iconName: "CheckSquare",
    minLevel: 3,
    sections: [
      {
        title: "\ud83d\udcb3 Payments",
        items: [
          {
            required: true,
            optional: false,
            label: "Stripe: full integration (one-time + subscriptions)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Stripe Connect (marketplace, split payments)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "PayPal REST SDK",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Paddle (EU VAT compliant)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Dodo Payments / Flutterwave (Africa/Asia)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Razorpay / PhonePe (India)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Xendit (SEA markets)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Midtrans (Indonesia)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "2C2P (Thailand/Malaysia)",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83d\udcc1 Media & CDN",
        items: [
          {
            required: true,
            optional: false,
            label: "AWS S3 (or Cloudflare R2 \u2014 cheaper): file storage",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "CloudFront CDN (or Cloudflare) for assets",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Cloudinary or Sharp (Node): image transforms",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Mux / Cloudflare Stream (video hosting)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Bunny.net (affordable CDN + storage)",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83d\udce7 Email",
        items: [
          {
            required: true,
            optional: false,
            label: "Resend or Postmark (transactional)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "React Email or MJML for templates",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Loops (lifecycle + marketing)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Customer.io / Brevo",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Twilio SMS / WhatsApp Business",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83d\udcca Monitoring (Required for Scratch)",
        items: [
          {
            required: true,
            optional: false,
            label: "Sentry: backend + frontend error tracking",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Winston or Pino: structured JSON logging",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Logflare / Axiom / Betterstack: log aggregation",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Prometheus + Grafana: metrics dashboards",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "OpenTelemetry: distributed tracing",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "PagerDuty / Opsgenie: on-call alerting",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Datadog (all-in-one APM, expensive)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "New Relic",
            desc: ""
          },
        ]
      },
    ]
  },
  {
    id: "phase-16",
    title: "PART 4 \u2014 DEVOPS, SECURITY, TESTING *(PRODUCTION HARDENING)*",
    iconName: "TestTubes",
    minLevel: 3,
    sections: [
      {
        title: "\ud83d\ude80 CI/CD & Deploy",
        items: [
          {
            required: true,
            optional: false,
            label: "Docker: Dockerfile + docker-compose.yml",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "GitHub Actions: test \u2192 build \u2192 push image \u2192 deploy",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Railway / Fly.io (easy) or AWS ECS / GCP Cloud Run",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Environment promotion: dev \u2192 staging \u2192 prod",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Zero-downtime deploy (rolling update)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Kubernetes (k8s) \u2014 only if scaling needs it",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Terraform / Pulumi (IaC)",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83d\udd12 Security Hardening",
        items: [
          {
            required: true,
            optional: false,
            label: "HTTPS everywhere, HSTS header",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "helmet.js + CSP policy",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "SQL injection: use ORM, never string concat",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "XSS: sanitize HTML output (DOMPurify)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "CSRF: tokens or SameSite cookie + origin check",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Rate limiting: per-user + per-IP (Upstash / nginx)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Secrets: Doppler / AWS Secrets Manager",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Dependency scan: Snyk or `npm audit` weekly",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Privacy policy, ToS, GDPR data deletion",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Cookie consent (EU )",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Penetration test (pre-launch)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "SOC 2 compliance (enterprise)",
            desc: ""
          },
        ]
      },
      {
        title: "\u26a1 Performance",
        items: [
          {
            required: true,
            optional: false,
            label: "`npm run build` \u2192 check bundle size",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "`npx lighthouse` \u2014 target 90+",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "k6 or Artillery: load test (1k concurrent users)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "DB: `EXPLAIN ANALYZE` all slow queries",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "APM: trace slow API endpoints",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "CDN: cache static assets 1yr, API 0-60s",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83e\uddea Testing Pyramid",
        items: [
          {
            required: true,
            optional: false,
            label: "Unit (Vitest/Jest): 60% coverage minimum",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Integration (supertest): all API routes",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "E2E (Playwright): top 5 critical user flows",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Contract tests: API schema validation",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "`npm run test:all` \u2014 must pass in CI",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "k6 performance regression tests",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Storybook visual regression (Chromatic)",
            desc: ""
          },
        ]
      },
    ]
  },
  {
    id: "phase-18",
    title: "PART 1 \u2014 PLATFORM DESIGN & GOVERNANCE *(MULTI-TEAM, CONTRACTS FIRST)*",
    iconName: "Settings",
    minLevel: 4,
    sections: [
      {
        title: "\ud83c\udfdb\ufe0f Architecture",
        items: [
          {
            required: true,
            optional: false,
            label: "Domain-driven design (DDD): bounded contexts",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Microservices or modular monolith decision",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "API Gateway: Kong / AWS API Gateway / Traefik",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Service mesh: Istio / Linkerd (mTLS, observability)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "gRPC for internal service communication",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Event sourcing + CQRS (if audit trail needed)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "ADR (Architecture Decision Records)",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83d\udc65 Multi-Tenancy",
        items: [
          {
            required: true,
            optional: false,
            label: "Tenant isolation strategy: schema-per-tenant or RLS",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Tenant onboarding automation",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Tenant-level billing + usage metering",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "White-label / custom domain per tenant",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "SAML SSO / OIDC (enterprise login)",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83d\udd10 Identity & Access (IAM)",
        items: [
          {
            required: true,
            optional: false,
            label: "Auth0 or WorkOS (enterprise SSO, SCIM)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Or: Keycloak (self-hosted, free)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "RBAC: roles + permissions matrix",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Attribute-based access control (ABAC) if complex",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Audit log: every user action stored",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "MFA enforced for all admin users",
            desc: ""
          },
        ]
      },
    ]
  },
  {
    id: "phase-19",
    title: "PART 2 \u2014 INFRASTRUCTURE & DATA PLATFORM *(CLOUD-NATIVE, HA, MULTI-REGION)*",
    iconName: "Database",
    minLevel: 4,
    sections: [
      {
        title: "\u2601\ufe0f Cloud Infra",
        items: [
          {
            required: true,
            optional: false,
            label: "IaC: Terraform / Pulumi / CDK",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Kubernetes (EKS / GKE / AKS)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Helm charts for service deployment",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Multi-AZ or multi-region setup",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Autoscaling: HPA + cluster autoscaler",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Service mesh for mTLS between services",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "GitOps: ArgoCD or Flux",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83d\uddc4\ufe0f Data Platform",
        items: [
          {
            required: true,
            optional: false,
            label: "Primary: PostgreSQL cluster (AWS Aurora / Google AlloyDB)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Read replicas in each region",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Redis Cluster (ElastiCache / Redis Cloud)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Data warehouse: Snowflake / BigQuery / Redshift",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "ETL / ELT: Airbyte / Fivetran \u2192 dbt transformations",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Kafka (Confluent Cloud) for event streaming",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Elasticsearch cluster for search",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "ClickHouse for analytics",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83c\udf10 Network & CDN",
        items: [
          {
            required: true,
            optional: false,
            label: "Cloudflare Enterprise (WAF, DDoS, zero trust)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "AWS CloudFront or Fastly for global CDN",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "VPC + private subnets for all DBs",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "VPN / bastion host for DB access",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "PrivateLink for inter-service (no public internet)",
            desc: ""
          },
        ]
      },
    ]
  },
  {
    id: "phase-20",
    title: "PART 3 \u2014 OBSERVABILITY & COMPLIANCE *(SLA, SLO, LEGAL, SECURITY)*",
    iconName: "Shield",
    minLevel: 4,
    sections: [
      {
        title: "\ud83d\udcca Observability Stack",
        items: [
          {
            required: true,
            optional: false,
            label: "Datadog or Dynatrace: full APM + logs + traces",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Or: Prometheus + Grafana + Loki + Tempo (LGTM)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "OpenTelemetry SDK in all services",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "SLO dashboards: availability, latency, error rate",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "PagerDuty: incident routing + escalation",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Runbooks for every alert",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Chaos engineering: Gremlin / LitmusChaos",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83d\udd12 Security & Compliance",
        items: [
          {
            required: true,
            optional: false,
            label: "SOC 2 Type II audit",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "ISO 27001 (if EU enterprise clients)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "GDPR: DPA, data map, deletion pipeline",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "HIPAA (if health data)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "PCI-DSS Level 1 (if storing card data)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Penetration test (annual)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "SAST/DAST: Snyk + OWASP ZAP in CI",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Secrets: HashiCorp Vault or AWS Secrets Manager",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Zero-trust network: Cloudflare Access / Tailscale",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83d\udccb Legal & Compliance Pages",
        items: [
          {
            required: true,
            optional: false,
            label: "Privacy policy (GDPR + CCPA compliant)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Terms of service + SLA document",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Cookie consent (OneTrust / Cookiebot)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Data Processing Agreement (DPA)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Bug bounty program (HackerOne / Bugcrowd)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "VPAT / accessibility audit (WCAG 2.1 AA)",
            desc: ""
          },
        ]
      },
    ]
  },
  {
    id: "phase-21",
    title: "PART 4 \u2014 TEAM PROCESSES & DELIVERY *(DEVEX, CI/CD, RELEASE MANAGEMENT)*",
    iconName: "CheckSquare",
    minLevel: 4,
    sections: [
      {
        title: "\ud83d\udd04 Advanced CI/CD",
        items: [
          {
            required: true,
            optional: false,
            label: "GitHub Actions + ArgoCD: full GitOps pipeline",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Blue/green or canary deployments",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Feature flags: LaunchDarkly / Unleash / Flagsmith",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Automated rollback on error rate spike",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Database migrations with zero downtime",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Release train schedule (bi-weekly)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Self-hosted GitHub Actions runners",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83e\uddea Testing at Scale",
        items: [
          {
            required: true,
            optional: false,
            label: "Unit tests: >80% coverage enforced in CI",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Contract testing: Pact (consumer-driven)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "E2E: Playwright in parallel (sharding)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Load testing: k6 Cloud (10k+ concurrent)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Visual regression: Chromatic or Percy",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Synthetic monitoring: Checkly (prod uptime)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "Cypress (legacy if already using it)",
            desc: ""
          },
        ]
      },
      {
        title: "\ud83e\udd16 Developer Experience",
        items: [
          {
            required: false,
            optional: true,
            label: "Internal dev portal: Backstage",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "API docs: OpenAPI + Swagger UI or Scalar",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Changelogs: automated (conventional commits)",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "On-call rotation + incident post-mortems",
            desc: ""
          },
          {
            required: true,
            optional: false,
            label: "Architecture decision records (ADRs)",
            desc: ""
          },
          {
            required: false,
            optional: true,
            label: "AI coding assistant (GitHub Copilot / Cursor)",
            desc: ""
          },
        ]
      },
    ]
  },
  {
    id: "phase-26",
    title: "\ud83d\udcf1 A. MOBILE APP (EXPO / REACT NATIVE) \u2014 DEEP DIVE",
    iconName: "CheckSquare",
    minLevel: 4,
    sections: [
      {
        title: "A1. App Configuration `soon`",
        items: [
          {
            required: false,
            optional: false,
            label: "Deep linking setup (`yourapp://booking/123` \u2192 opens correct screen)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Universal Links (iOS) + App Links (Android) for web \u2192 app handoff",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "App scheme defined in `app.json` under `scheme`",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Splash screen + app icon (all sizes generated)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Adaptive icon for Android (foreground + background layer)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Dark mode support (`useColorScheme()` + theme context)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Force-update prompt when breaking API changes ship",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "App version bump automation in CI (`eas build`)",
            desc: "Phase: Later"
          },
        ]
      },
      {
        title: "A2. Device Features `soon`",
        items: [
          {
            required: false,
            optional: false,
            label: "Biometric auth: Face ID / Touch ID (`expo-local-authentication`)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Camera access for profile photo upload",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Location permissions (precise vs approximate)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Background location (for real-time tracking features)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Contacts access (for inviting friends)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Calendar integration (add booking to calendar)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Haptic feedback on button presses (`expo-haptics`)",
            desc: "Phase: Soon"
          },
        ]
      },
      {
        title: "A3. Offline & Storage `soon`",
        items: [
          {
            required: false,
            optional: false,
            label: "Local data persistence: MMKV (fast) or AsyncStorage",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Offline mode: queue actions when no internet, sync when back",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Optimistic UI updates (show change immediately, rollback on fail)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Cache API responses locally (React Query `staleTime` + `gcTime`)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "SQLite for complex offline data (`expo-sqlite`)",
            desc: "Phase: Later"
          },
        ]
      },
      {
        title: "A4. Notifications (Full Setup) `soon`",
        items: [
          {
            required: false,
            optional: false,
            label: "APNs certificate setup (iOS push \u2014 requires Apple Dev account)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "FCM setup (Android push \u2014 requires Google project)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Expo Push Token: get on first launch, save to DB with user",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Notification permissions request with explanation dialog",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Handle notification tap \u2192 navigate to correct screen",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Notification preferences page (user toggles each type on/off)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Scheduled notifications (reminder 1hr before appointment)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Rich notifications (image + action buttons on iOS)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Silent push (background data sync)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "OneSignal / Expo Notifications / Firebase Cloud Messaging (FCM)",
            desc: "Phase: Soon"
          },
        ]
      },
      {
        title: "A5. App Store Optimization (ASO) `soon`",
        items: [
          {
            required: false,
            optional: false,
            label: "App name: include keyword (e.g., \u201cServiceFinder \u2014 Book Home Services\u201d)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Short description (80 chars): hook + keyword",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Long description: benefits-first, not features-first",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Screenshots: annotated, show value not just UI (all device sizes)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Preview video (30 sec): autoplay in store listing",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Keywords field (Apple \u2014 100 chars max, comma separated)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Ratings prompt: `expo-store-review` at right moment (after success)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Respond to every App Store review (boosts ranking)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Localized store listings (different language = separate listing)",
            desc: "Phase: Later"
          },
        ]
      },
      {
        title: "A6. Beta Testing `soon`",
        items: [
          {
            required: false,
            optional: false,
            label: "TestFlight (iOS): internal testing \u2192 external beta",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Google Play Internal Testing Track \u2192 Closed Testing \u2192 Production",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "EAS Update channels: `development` / `staging` / `production`",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Expo Dev Client: custom native build for testing native modules",
            desc: "Phase: Later"
          },
        ]
      },
    ]
  },
  {
    id: "phase-27",
    title: "\ud83c\udfea B. MARKETPLACE-SPECIFIC FEATURES",
    iconName: "CheckSquare",
    minLevel: 4,
    sections: [
      {
        title: "B1. Trust & Safety `soon`",
        items: [
          {
            required: false,
            optional: false,
            label: "Provider identity verification: Stripe Identity / Jumio / Onfido",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Document upload: business license, insurance certificate",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Background checks for workers/staff: Checkr API",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Manual verification workflow: admin reviews + approves provider",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Verified badge shown on provider profile",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Report button on every provider/listing",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Content moderation queue in admin panel",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Automated spam detection (rate of reports per provider)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Phone number verification (OTP via SMS)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Email verification before booking allowed",
            desc: "Phase: Soon"
          },
        ]
      },
      {
        title: "B2. Payments & Money Flow `soon`",
        items: [
          {
            required: false,
            optional: false,
            label: "Escrow system: hold customer payment until job marked complete",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Stripe Connect: marketplace split payments (you take platform fee automatically)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Payout schedule: weekly / bi-weekly to provider bank account",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Instant payout option (Stripe Instant Payouts, extra fee)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Stripe Connect onboarding flow for providers (bank account setup)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Platform fee configuration: admin sets % per category",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Refund policy enforcement: auto-refund within 24h, manual after",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Partial refunds (if job partially completed)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Dispute resolution: customer claims \u2192 hold payout \u2192 admin decides",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Stripe Radar: fraud detection rules",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Chargeback handling process (documentation + response templates)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Idempotency keys on all payment endpoints (prevent double charges)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Invoice PDF generation for every completed booking",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Receipt email with itemized breakdown",
            desc: "Phase: Soon"
          },
        ]
      },
      {
        title: "B3. Tax & Finance `later`",
        items: [
          {
            required: false,
            optional: false,
            label: "1099-K reporting for contractors earning >$600/yr (US)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "GST/VAT invoice generation (AU, EU, SG, MY)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Withholding tax logic per country",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Annual earnings statement for providers",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Financial reconciliation: Stripe payouts vs DB records",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Revenue recognition rules (when is revenue \u201cearned\u201d?)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Tax rate configuration per jurisdiction in admin",
            desc: "Phase: Later"
          },
        ]
      },
      {
        title: "B4. Booking Flow (Complete) `soon`",
        items: [
          {
            required: false,
            optional: false,
            label: "Real-time availability calendar for providers",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Time slot booking with buffer time between bookings",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Booking confirmation \u2192 email + push notification",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Booking reminder: 24h before + 1h before",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Cancellation flow: enforce policy (free cancel >24h, fee <24h)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Reschedule functionality",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Recurring bookings (weekly/monthly service)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Group bookings (multiple services in one order)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Waitlist (if provider is fully booked)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Booking notes (customer leaves instructions for provider)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Post-job checklist (provider marks tasks complete)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Photo evidence upload (before/after for cleaning, repair jobs)",
            desc: "Phase: Later"
          },
        ]
      },
      {
        title: "B5. Reviews & Reputation `soon`",
        items: [
          {
            required: false,
            optional: false,
            label: "Review prompt: appears 24h after job marked complete",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Two-way reviews: customer reviews provider AND provider reviews customer",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Review moderation: flag abusive reviews",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Response to review (provider can reply)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Review incentive: discount on next booking for leaving review",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Aggregate rating display: star average + breakdown per category",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Fake review detection (flag if reviewer never actually booked)",
            desc: "Phase: Soon"
          },
        ]
      },
      {
        title: "B6. Provider Tools `soon`",
        items: [
          {
            required: false,
            optional: false,
            label: "Provider onboarding wizard (step-by-step setup guide)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Service catalog management (add/edit/pause services)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Pricing management: base price + add-on options",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Availability calendar: block personal time off",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Coverage area map (draw service radius on Google Maps)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Staff management: assign bookings to team members",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Earnings dashboard: total, pending, paid, this month",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Performance metrics: response rate, completion rate, avg rating",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Lead response SLA tracker (reply within 1hr = higher ranking)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Custom booking page URL (`servicefinder.xyz/book/company-name`)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Embed widget (providers embed booking button on their own site)",
            desc: "Phase: Later"
          },
        ]
      },
    ]
  },
  {
    id: "phase-28",
    title: "\ud83d\udee1\ufe0f C. SECURITY \u2014 DEEP DIVE",
    iconName: "Shield",
    minLevel: 4,
    sections: [
      {
        title: "C1. API Security `soon`",
        items: [
          {
            required: false,
            optional: false,
            label: "API versioning: `/api/v1/`, `/api/v2/` (never break old app versions)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Graceful shutdown handler (SIGTERM \u2192 drain requests \u2192 stop)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Request ID header (`X-Request-ID`) for log tracing",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Request timeout: 30s max per API call",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Response envelope: always `{ data, error, meta }` structure",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Swagger / OpenAPI spec auto-generated from NestJS decorators",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Postman / Bruno collection for all API endpoints",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "API changelog (log breaking vs non-breaking changes)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "API deprecation notices in headers (`Sunset: date`)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Webhook signature verification (Stripe, GitHub, etc.)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Webhook retry idempotency (same event = same result)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Webhook delivery log (see which events were received)",
            desc: "Phase: Soon"
          },
        ]
      },
      {
        title: "C2. VPS / Server Hardening `soon`",
        items: [
          {
            required: false,
            optional: false,
            label: "Disable root SSH login (`PermitRootLogin no`)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "SSH key-only authentication (disable password SSH)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "`fail2ban`: auto-block IPs with failed SSH attempts",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "`ufw` firewall: allow only 22 (SSH), 80 (HTTP), 443 (HTTPS)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Automatic security updates: `unattended-upgrades`",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Change default SSH port (22 \u2192 custom port)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Nginx: disable server version header (`server_tokens off`)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Nginx: gzip compression for all responses",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Nginx: rate limit at reverse proxy level",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "SSL cert auto-renewal: Certbot + cron",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Log rotation: `/etc/logrotate.d/` config for Nginx + app logs",
            desc: "Phase: Soon"
          },
        ]
      },
      {
        title: "C3. Data & Privacy `soon`",
        items: [
          {
            required: true,
            optional: false,
            label: "GDPR: \u201cDownload my data\u201d button (data portability,  in EU)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "GDPR: data deletion pipeline (delete from all tables + queues)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "GDPR: data retention policy (auto-delete old booking data after 5yr)",
            desc: "Phase: Later"
          },
          {
            required: true,
            optional: false,
            label: "CCPA: \u201cDo Not Sell My Data\u201d toggle ( if US users)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Cookie consent: granular (analytics opt-in separate from essential)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Data minimization: only collect what you actually use",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "PII masking in logs (never log email/phone/card in plain text)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Data breach notification process (72hr GDPR window)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Privacy dashboard: user sees what data you hold about them",
            desc: "Phase: Later"
          },
        ]
      },
      {
        title: "C4. Dependency & Supply Chain Security `soon`",
        items: [
          {
            required: false,
            optional: false,
            label: "`npm audit` \u2014 run weekly, fix CRITICAL and HIGH",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Dependabot or Renovate: auto-PRs for dependency updates",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Snyk: deep vulnerability scan including transitive deps",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Lock file committed (`package-lock.json` or `pnpm-lock.yaml`)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Pin Docker base image versions (not `:latest`)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "SBOM (Software Bill of Materials) for enterprise clients",
            desc: "Phase: Later"
          },
        ]
      },
    ]
  },
  {
    id: "phase-29",
    title: "\u26a1 D. PERFORMANCE \u2014 DEEP DIVE",
    iconName: "Database",
    minLevel: 4,
    sections: [
      {
        title: "D1. Frontend Performance `soon`",
        items: [
          {
            required: false,
            optional: false,
            label: "Lighthouse CI: run in GitHub Actions, fail if score drops",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Core Web Vitals monitoring in Vercel Analytics / PostHog",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Image format: serve WebP (next/image does this automatically)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Image lazy loading: `loading=\"lazy\"` on below-fold images",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Font optimization: `font-display: swap`, subset fonts",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Preconnect to third-party domains in `<head>`",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Dynamic imports for heavy components (code splitting)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "`@next/bundle-analyzer`: find large chunks > 100KB",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Remove unused CSS (PurgeCSS / Tailwind JIT already does this)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Prefetch likely next routes (`<Link prefetch>`)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Service Worker: cache static assets (PWA approach)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Critical CSS inlining (above-the-fold styles inline)",
            desc: "Phase: Later"
          },
        ]
      },
      {
        title: "D2. Backend Performance `soon`",
        items: [
          {
            required: false,
            optional: false,
            label: "Response compression: gzip / brotli on all API responses",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "HTTP/2 enabled on Nginx (multiplexing, much faster)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Pagination on ALL list endpoints (never return >100 rows unbounded)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Cursor-based pagination for infinite scroll (better than offset)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "N+1 query detection: Prisma query logs in development",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Eager loading: `include` relations in single query vs multiple",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Redis cache warming on server start for hot data",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Background job for heavy operations (PDF gen, email, image resize)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Streaming responses for large data exports (CSV downloads)",
            desc: "Phase: Later"
          },
        ]
      },
      {
        title: "D3. Mobile Performance `soon`",
        items: [
          {
            required: false,
            optional: false,
            label: "FlatList vs ScrollView: use FlatList for lists >20 items",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "`useMemo` / `useCallback` on expensive computations",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Image caching: `expo-image` (already using, keep it)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Avoid re-renders: React DevTools profiler check",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Heavy screens: lazy load with `React.lazy` + Suspense",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "RAM usage: `pm2 monit` equivalent for React Native (Flipper)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Hermes JS engine enabled (already on \u2014 keep it)",
            desc: "Phase: Soon"
          },
        ]
      },
    ]
  },
  {
    id: "phase-30",
    title: "\ud83e\uddea E. TESTING \u2014 DEEP DIVE",
    iconName: "TestTubes",
    minLevel: 4,
    sections: [
      {
        title: "E1. Unit Testing `soon`",
        items: [
          {
            required: false,
            optional: false,
            label: "Test utilities and helpers (pure functions first)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Test all custom React hooks",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Test all Zod schemas (valid + invalid inputs)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Test business logic: booking price calculation, fee splitting",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Mocking: `vi.mock()` for API calls, external services",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Test factories: generate fake data with `@faker-js/faker`",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Coverage report: `npm run test:coverage` \u2192 check % per module",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Coverage gates in CI: fail if <60% on critical modules",
            desc: "Phase: Later"
          },
        ]
      },
      {
        title: "E2. Integration Testing `soon`",
        items: [
          {
            required: false,
            optional: false,
            label: "API integration tests: every route with valid + invalid payloads",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Auth flow tests: login, logout, token refresh, expired token",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Payment flow tests: use Stripe test mode, mock webhooks",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Database seed + teardown for each test suite",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "`supertest` (Node.js) or `httpx` (Python) for HTTP testing",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "MSW (Mock Service Worker): intercept and mock API calls in tests",
            desc: "Phase: Later"
          },
        ]
      },
      {
        title: "E3. E2E Testing `soon`",
        items: [
          {
            required: false,
            optional: false,
            label: "Playwright: install, configure, write first test",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Critical flows to test: signup \u2192 browse \u2192 book \u2192 pay \u2192 confirm",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Auth flows: login, logout, password reset",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Payment flow: checkout with test card \u2192 success page",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Mobile E2E: Maestro (simpler than Detox for Expo)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Visual regression: Playwright screenshots on each run",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Parallel test execution (sharding) for speed",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Test against staging (not production!)",
            desc: "Phase: Soon"
          },
        ]
      },
      {
        title: "E4. Load Testing `soon`",
        items: [
          {
            required: false,
            optional: false,
            label: "k6: write test script for top 3 most-used endpoints",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Artillery: alternative, easier YAML config",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Scenarios: ramp up 0 \u2192 100 \u2192 500 \u2192 1000 users",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Test: with Redis cache ON vs OFF (measure improvement)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Test: PM2 single instance vs cluster mode",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Stress test: find breaking point (what CCU causes errors?)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Soak test: 100 users for 30 minutes (memory leak detection)",
            desc: "Phase: Later"
          },
        ]
      },
      {
        title: "E5. Accessibility Testing `later`",
        items: [
          {
            required: false,
            optional: false,
            label: "axe-core: automated a11y scan on every page",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Screen reader testing: VoiceOver (iOS) + TalkBack (Android)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Keyboard navigation: tab through all interactive elements",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Color contrast: all text passes AA ratio (4.5:1 minimum)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "ARIA labels on icons, buttons without text",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Focus trap in modals (tab stays inside modal)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "`eslint-plugin-jsx-a11y` in lint config",
            desc: "Phase: Soon"
          },
        ]
      },
    ]
  },
  {
    id: "phase-31",
    title: "\ud83d\udcca F. OBSERVABILITY \u2014 DEEP DIVE",
    iconName: "CheckSquare",
    minLevel: 4,
    sections: [
      {
        title: "F1. Logging Strategy `soon`",
        items: [
          {
            required: false,
            optional: false,
            label: "Structured JSON logging (every log = parseable JSON object)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Log levels: `error` (alert), `warn` (investigate), `info` (normal), `debug` (dev only)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Request logger: log `method`, `path`, `statusCode`, `durationMs`, `userId`",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Never log: passwords, tokens, full credit card, PII",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Correlation ID: pass `X-Request-ID` through entire request chain",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Log aggregation: Axiom / BetterStack / Logflare (ship to central place)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Log search + alerting: set alert if `error` logs > 10/min",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Log retention: 30 days hot, 1yr cold (S3 archive)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Log rotation on VPS: delete files older than 14 days",
            desc: "Phase: Soon"
          },
        ]
      },
      {
        title: "F2. Metrics & Dashboards `soon`",
        items: [
          {
            required: false,
            optional: false,
            label: "Health check endpoint `/api/health` \u2014 returns DB + Redis status",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Business metrics endpoint (admin only): GMV, active users, bookings today",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "API response time p50 / p95 / p99 tracking",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Error rate per endpoint tracking",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "DB query time tracking (slow query log if >500ms)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Redis cache hit rate tracking",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Grafana dashboard (if self-hosting Prometheus)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Custom Sentry dashboard: top errors this week",
            desc: "Phase: Soon"
          },
        ]
      },
      {
        title: "F3. Alerting `soon`",
        items: [
          {
            required: false,
            optional: false,
            label: "Alert: server CPU > 80% for 5 min",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Alert: server RAM > 85%",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Alert: API error rate > 5% in 5 min",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Alert: DB connection pool exhausted",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Alert: Redis memory > 80%",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Alert: disk space > 80%",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Alert: failed payment rate > 10% in 1hr",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Alert: UptimeRobot detects downtime \u2192 email + Discord/Slack",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Sentry: new issue type alert (not just high volume)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "On-call rotation: who gets woken at 3am? (even solo = just you)",
            desc: "Phase: Later"
          },
        ]
      },
      {
        title: "F4. Incident Response `later`",
        items: [
          {
            required: false,
            optional: false,
            label: "Status page: statuspage.io or BetterStack (users see outage info)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Post-mortem template (5 Whys + timeline + action items)",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Rollback runbook: step-by-step to revert a bad deploy",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "DB restore runbook: test restore from backup monthly",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Communication plan: what to say to users during outage",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Chaos testing: kill Redis, DB, API \u2014 does app degrade gracefully?",
            desc: "Phase: Later"
          },
        ]
      },
    ]
  },
  {
    id: "phase-32",
    title: "\ud83d\ude80 G. CI/CD \u2014 DEEP DIVE",
    iconName: "CheckSquare",
    minLevel: 4,
    sections: [
      {
        title: "G1. GitHub Actions (Backend) `soon`",
        items: [
          {
            required: false,
            optional: false,
            label: "Trigger: `on: push: branches: [main]` + `on: pull_request`",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Step: checkout + set up Node.js with cache",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Step: `npm ci` (reproducible installs)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Step: `npm run lint` \u2014 fail on any warning",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Step: `npm run test` \u2014 fail on any test failure",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Step: `npm run build` \u2014 fail if compile error",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Step: SSH \u2192 VPS \u2192 `git pull` \u2192 `npm ci` \u2192 `prisma migrate deploy` \u2192 `pm2 reload`",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "GitHub Secrets: `VPS_SSH_KEY`, `VPS_HOST`, `VPS_USER`",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Matrix strategy: test on Node 20 + 22",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Concurrency: cancel in-progress runs on new push",
            desc: "Phase: Soon"
          },
        ]
      },
      {
        title: "G2. EAS Build (Mobile) `soon`",
        items: [
          {
            required: false,
            optional: false,
            label: "Auto-trigger on push to `main` \u2192 start EAS Android + iOS build",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "GitHub Secret: `EXPO_TOKEN` (from expo.dev)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "EAS secrets: inject `SENTRY_AUTH_TOKEN`, `STRIPE_PUBLIC_KEY` at build time",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Build profiles: `development` / `preview` / `production`",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Separate EAS project for each environment",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Notify Slack/Discord when build succeeds/fails",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Auto-submit to App Store after successful iOS build",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Auto-submit to Google Play after successful Android build",
            desc: "Phase: Later"
          },
        ]
      },
      {
        title: "G3. OTA Updates (Expo Updates) `soon`",
        items: [
          {
            required: false,
            optional: false,
            label: "EAS Update configured with channels matching build profiles",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Update strategy: `fingerprintMismatch: nativeUpdate` (re-install if native changed)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Push OTA: `eas update --channel production --message \"Fix booking bug\"`",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Rollback OTA: `eas update:rollback --channel production`",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "OTA update visible to users within 24h (next cold start)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Critical fix: force OTA check on launch (`Updates.checkForUpdateAsync()`)",
            desc: "Phase: Later"
          },
        ]
      },
      {
        title: "G4. Environment Strategy `soon`",
        items: [
          {
            required: false,
            optional: false,
            label: "Three environments: `development` / `staging` / `production`",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Staging = exact copy of production (real infra, fake data)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Every deploy goes to staging first, then production",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Staging URL: `staging-api.yourdomain.com`",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "DB: staging has its own separate database (never prod data)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Stripe: staging uses test keys, prod uses live keys",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Feature flags: roll out features to 10% \u2192 50% \u2192 100%",
            desc: "Phase: Later"
          },
        ]
      },
    ]
  },
  {
    id: "phase-33",
    title: "\ud83d\uddc4\ufe0f H. DATABASE \u2014 DEEP DIVE",
    iconName: "Database",
    minLevel: 4,
    sections: [
      {
        title: "H1. Schema Design `soon`",
        items: [
          {
            required: false,
            optional: false,
            label: "All tables have: `id` (UUID), `createdAt`, `updatedAt`, `deletedAt` (soft delete)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Soft delete pattern: `deletedAt IS NULL` filter on all queries",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "UUID vs autoincrement: UUID for user-facing IDs (not guessable)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Enum types defined in Prisma (not plain strings)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "All foreign keys have ON DELETE behavior defined",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Check constraints for business rules (e.g., `price > 0`)",
            desc: "Phase: Later"
          },
        ]
      },
      {
        title: "H2. Migrations `soon`",
        items: [
          {
            required: false,
            optional: false,
            label: "Never edit existing migrations \u2014 always create new ones",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "`npx prisma migrate dev` (development)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "`npx prisma migrate deploy` (production \u2014 no prompt, safe)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Run migrations BEFORE server restart in CI/CD",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Test: migrate \u2192 rollback \u2192 migrate again (verify idempotency)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Squash old migrations annually to keep list manageable",
            desc: "Phase: Later"
          },
          {
            required: false,
            optional: false,
            label: "Zero-downtime migrations: add column \u2192 deploy \u2192 backfill \u2192 add constraint",
            desc: "Phase: Later"
          },
        ]
      },
      {
        title: "H3. Indexing Strategy `soon`",
        items: [
          {
            required: false,
            optional: false,
            label: "Primary key index (automatic)",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Foreign key indexes: every FK column",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Search columns: `name`, `email`, `status`, `category`",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Sort columns: `createdAt DESC` on most list views",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Composite indexes for combined WHERE clauses",
            desc: "Phase: Soon"
          },
          {
            required: false,
            optional: false,
            label: "Partial inde",
            desc: ""
          },
        ]
      },
    ]
  },
];

const LEVEL_WEIGHTS: Record<string, number> = {
  "MVP": 1,
  "Startup": 2,
  "Professional": 3,
  "Enterprise": 4
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const IconComponents: Record<string, any> = {
  Settings,
  FolderTree,
  Database,
  Globe,
  Shield,
  Terminal,
  CheckCircle2,
  Circle,
  Clock,
  Check,
  Code,
  TestTubes,
  CheckSquare
};

// --- Category auto-detection from section titles ---
const FILTER_CATEGORIES = [
  { key: 'frontend', label: 'Frontend', color: 'text-pink-400 bg-pink-500/10 border-pink-500/30', keywords: ['frontend', 'ui', 'ux', 'design', 'css', 'tailwind', 'react', 'next', 'component', 'storybook'] },
  { key: 'backend', label: 'Backend', color: 'text-green-400 bg-green-500/10 border-green-500/30', keywords: ['backend', 'api', 'server', 'nest', 'fastify', 'express', 'auth', 'jwt', 'edge function', 'trpc', 'graphql'] },
  { key: 'database', label: 'Database', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', keywords: ['database', 'db', 'postgres', 'prisma', 'supabase', 'migration', 'schema', 'redis', 'cache', 'queue', 'indexing', 'rls'] },
  { key: 'devops', label: 'DevOps', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', keywords: ['devops', 'ci/cd', 'deploy', 'docker', 'kubernetes', 'k8s', 'github actions', 'eas', 'ota', 'environment', 'hosting', 'dns', 'cdn', 'infra', 'cloud', 'terraform', 'helm', 'gitops'] },
  { key: 'testing', label: 'Testing', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', keywords: ['testing', 'test', 'vitest', 'jest', 'playwright', 'e2e', 'unit', 'integration', 'load', 'coverage', 'qa', 'accessibility'] },
  { key: 'security', label: 'Security', color: 'text-red-400 bg-red-500/10 border-red-500/30', keywords: ['security', 'auth', 'owasp', 'gdpr', 'compliance', 'privacy', 'ssl', 'cors', 'rate limit', 'helmet', 'vulnerability', 'soc', 'penetration', 'encryption', 'hardening'] },
  { key: 'monitoring', label: 'Monitoring', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30', keywords: ['monitoring', 'observability', 'sentry', 'logging', 'metrics', 'alert', 'uptime', 'apm', 'grafana', 'prometheus', 'incident'] },
  { key: 'mobile', label: 'Mobile', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30', keywords: ['mobile', 'expo', 'react native', 'app store', 'testflight', 'push notification', 'biometric', 'offline', 'aso'] },
  { key: 'payments', label: 'Payments', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', keywords: ['payment', 'stripe', 'billing', 'invoice', 'tax', 'escrow', 'payout', 'refund'] },
] as const;

type FilterKey = typeof FILTER_CATEGORIES[number]['key'];

function detectSectionCategory(sectionTitle: string, phaseTitle: string): FilterKey[] {
  const combined = `${phaseTitle} ${sectionTitle}`.toLowerCase();
  const matches: FilterKey[] = [];
  for (const cat of FILTER_CATEGORIES) {
    if (cat.keywords.some(kw => combined.includes(kw))) {
      matches.push(cat.key);
    }
  }
  return matches; // strict matching without fallback
}

function itemHasCommand(label: string): boolean {
  return label.includes('`') || label.includes('npm ') || label.includes('npx ') || label.includes('docker') || label.includes('$ ');
}

import { useSearchParams } from 'next/navigation';

export function MasterChecklist({ aiChecklist, projectName, projectLevel = "MVP", techStack = [] }: { 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  aiChecklist: any[], projectName: string, projectLevel?: string, techStack?: any[] 
}) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') as FilterKey | null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [localAiChecklist, setLocalAiChecklist] = useState<any[]>(aiChecklist || []);

  const toggleAiTask = (taskId: string) => {
    setLocalAiChecklist(prev => {
      const task = prev.find(t => t.id === taskId);
      if (task) {
        // Automatically sync the filter based on the task checked!
        const catStr = (task.category || '').toLowerCase();
        const matchedFilter = FILTER_CATEGORIES.find(c => catStr.includes(c.key.toLowerCase()))?.key;
        
        if (matchedFilter) {
          // If we are checking the box, set the filter to ONLY this category
          // If unchecking, clear the filter
          if (task.status !== 'DONE') {
            setActiveCategories(new Set([matchedFilter]));
          } else {
            setActiveCategories(new Set());
          }
        }
      }
      return prev.map(t => t.id === taskId ? { ...t, status: t.status === 'DONE' ? 'TODO' : 'DONE' } : t);
    });
  };

  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({
    "phase-0": true,
    "phase-1": false,
    "phase-2": false,
  });

  const togglePhase = (id: string) => {
    setExpandedPhases(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const toggleItem = (key: string) => {
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // --- Filters ---
  const [activeCategories, setActiveCategories] = useState<Set<FilterKey>>(() => {
    const s = new Set<FilterKey>();
    if (initialCategory && FILTER_CATEGORIES.some(c => c.key === initialCategory)) {
      s.add(initialCategory);
    }
    return s;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showCommandsOnly, setShowCommandsOnly] = useState(false);
  const [showRequiredOnly, setShowRequiredOnly] = useState(false);
  const [showOptionalOnly, setShowOptionalOnly] = useState(false);

  const toggleCategory = (key: FilterKey) => {
    setActiveCategories(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const clearAllFilters = () => {
    setActiveCategories(new Set());
    setSearchQuery('');
    setShowCommandsOnly(false);
    setShowRequiredOnly(false);
    setShowOptionalOnly(false);
  };

  const hasAnyFilter = activeCategories.size > 0 || searchQuery || showCommandsOnly || showRequiredOnly || showOptionalOnly;

  // --- Base Filtered Data (Pruned by Level and Tech Stack, but BEFORE user interaction) ---
  const baseFilteredPhases = MASTER_CHECKLIST
    .filter(phase => (phase.minLevel || 1) <= (LEVEL_WEIGHTS[projectLevel] || 1))
    .map(phase => {
      const filteredSections = phase.sections
        .map(section => {
          const sectionCategories = detectSectionCategory(section.title, phase.title);

          // Strict Section-Level Tech Stack Pruning
          if (techStack && techStack.length > 0) {
            const techNames = techStack.map(t => t.name.toLowerCase());
            
            // 1. Mobile Filter
            const hasMobileTool = techNames.some(t => ['react native', 'expo', 'flutter', 'swift', 'kotlin', 'ios', 'android'].some(m => t.includes(m)));
            if (!hasMobileTool && sectionCategories.includes('mobile')) return null;

            // 2. CI/CD Filter
            const hasCICDTool = techNames.some(t => ['github actions', 'jenkins', 'gitlab', 'docker', 'kubernetes', 'circleci', 'travis', 'argocd', 'terraform'].some(c => t.includes(c)));
            const isCICDSection = section.title.toLowerCase().includes('ci/cd') || phase.title.toLowerCase().includes('ci/cd deep dive');
            if (!hasCICDTool && isCICDSection) return null;

            // 3. Database Filter
            const hasDatabase = techStack.some(t => (t.category || '').toLowerCase().includes('database') || ['sql', 'mongo', 'redis', 'prisma', 'supabase'].some(db => techNames.some(n => n.includes(db))));
            if (!hasDatabase && sectionCategories.includes('database')) return null;

            // 4. Testing Filter
            const hasTesting = techNames.some(t => ['jest', 'cypress', 'playwright', 'vitest', 'mocha', 'selenium', 'puppeteer'].some(test => t.includes(test)));
            if (!hasTesting && sectionCategories.includes('testing')) return null;

            // 5. Monitoring Filter
            const hasMonitoring = techNames.some(t => ['sentry', 'datadog', 'new relic', 'grafana', 'prometheus', 'log', 'analytics', 'posthog'].some(m => t.includes(m)));
            if (!hasMonitoring && sectionCategories.includes('monitoring')) return null;

            // 6. Payments Filter
            const hasPayments = techNames.some(t => ['stripe', 'paypal', 'braintree', 'razorpay', 'paddle'].some(p => t.includes(p)));
            if (!hasPayments && sectionCategories.includes('payments')) return null;
          }

          // Item-level tech check (without user search/type filters)
          const filteredItems = section.items.filter(item => {
            if (techStack && techStack.length > 0) {
              const userTechNames = techStack.map(t => t.name.toLowerCase());
              const itemText = (item.label + " " + item.desc).toLowerCase();
              
              let mentionsTech = false;
              let hasMatchingTech = false;

              for (const knownTech of TECH_ENCYCLOPEDIA) {
                const techName = knownTech.name.toLowerCase();
                if (techName.length <= 2) continue; 
                
                if (itemText.includes(techName)) {
                  mentionsTech = true;
                  if (userTechNames.includes(techName)) {
                    hasMatchingTech = true;
                  }
                }
              }

              if (mentionsTech && !hasMatchingTech) {
                return false;
              }
            }
            return true;
          });

          if (filteredItems.length === 0) return null;
          return { ...section, items: filteredItems, _categories: sectionCategories };
        })
        .filter(Boolean) as (typeof phase.sections[number] & { _categories: FilterKey[] })[];

      if (filteredSections.length === 0) return null;
      return { ...phase, sections: filteredSections };
    })
    .filter(Boolean) as (Omit<typeof MASTER_CHECKLIST[number], "sections"> & { sections: (typeof MASTER_CHECKLIST[number]["sections"][number] & { _categories: FilterKey[] })[] })[];

  // Compute Available Categories dynamically
  const availableCategories = new Set<FilterKey>();
  baseFilteredPhases.forEach(p => p.sections.forEach(s => s._categories.forEach(c => availableCategories.add(c))));

  // --- Final Filtered Data (After user clicks and searches) ---
  const finalFilteredPhases = baseFilteredPhases.map(phase => {
     const finalSections = phase.sections.map(section => {
        // Category filter (User clicks)
        if (activeCategories.size > 0 && !section._categories.some(c => activeCategories.has(c))) {
           return null;
        }

        // Search & Type Filters
        const finalItems = section.items.filter(item => {
           if (searchQuery) {
             const q = searchQuery.toLowerCase();
             if (!item.label.toLowerCase().includes(q) && !item.desc.toLowerCase().includes(q)) return false;
           }
           if (showCommandsOnly && !itemHasCommand(item.label)) return false;
           if (showRequiredOnly && !item.required) return false;
           if (showOptionalOnly && !item.optional) return false;
           return true;
        });

        if (finalItems.length === 0) return null;
        return { ...section, items: finalItems };
     }).filter(Boolean);

     if (finalSections.length === 0) return null;
     return { ...phase, sections: finalSections };
  }).filter(Boolean) as typeof baseFilteredPhases;


  // Count matched items
  const totalFilteredItems = finalFilteredPhases.reduce((acc, p) => acc + p.sections.reduce((a, s) => a + s.items.length, 0), 0);

  // Always show all AI tasks so the user can easily switch filters

  return (
    <Card className="bg-zinc-900 border-zinc-800 h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-orange-400" />
          <CardTitle className="text-xl">The Master Checklist</CardTitle>
        </div>
        <CardDescription>
          Combined AI Custom Checklist for {projectName} + The CTO Master Guide.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        
        {/* Top Section: AI Generated Tasks */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b border-zinc-800 pb-2 flex justify-between items-center">
            AI Generated Custom Tasks
            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">Project Specific</span>
          </h3>
          {localAiChecklist && localAiChecklist.length > 0 ? (
            <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-700">
              {Object.entries(
                localAiChecklist.reduce((acc: any, task: any) => {
                  const cat = task.category || 'Uncategorized';
                  if (!acc[cat]) acc[cat] = [];
                  acc[cat].push(task);
                  return acc;
                }, {})
              ).map(([category, tasks]: [string, any], catIdx) => (
                <div key={catIdx} className="space-y-3">
                  <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider pl-1">{category}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tasks.map((task: any, idx: number) => {
                      const catStr = (task.category || '').toLowerCase();
                      const matchedFilter = FILTER_CATEGORIES.find(c => catStr.includes(c.key.toLowerCase()))?.key;
                      
                      return (
                        <div key={task.id || idx} className="flex items-start gap-3 p-3 bg-zinc-950 rounded border border-zinc-800 hover:border-zinc-700 transition-colors">
                          <Checkbox 
                            checked={task.status === 'DONE'} 
                            onCheckedChange={() => task.id && toggleAiTask(task.id)}
                            className="mt-1 border-zinc-700 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 shrink-0"
                          />
                          <div className="flex flex-col gap-1 w-full pr-2">
                            <div className="flex items-start justify-between gap-4">
                              <button 
                                onClick={() => matchedFilter && toggleCategory(matchedFilter)}
                                className={`text-left w-fit px-1 -mx-1 rounded transition-colors ${
                                  matchedFilter && activeCategories.has(matchedFilter) 
                                    ? 'bg-purple-500/20 ring-1 ring-purple-500/50' 
                                    : 'hover:bg-purple-500/10'
                                }`}
                                title="Click to filter the Master Checklist below by this category"
                              >
                                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider hover:underline opacity-80">{task.category}</span>
                              </button>
                              
                              {task.relatedTech && task.relatedTech.length > 0 && (
                                <div className="flex items-center gap-1 flex-wrap justify-end mt-0.5">
                                  {task.relatedTech.map((tech: string, i: number) => (
                                    <span key={i} className="text-[9px] font-medium bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700 whitespace-nowrap">
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            
                            <span 
                              className={`text-sm font-semibold cursor-pointer hover:text-blue-400 transition-colors mt-1 ${task.status === 'DONE' ? 'line-through text-zinc-500' : 'text-zinc-200'}`}
                              onClick={() => setSearchQuery(task.title)}
                              title="Click to search for this task in the Master Checklist below"
                            >
                              {task.title}
                            </span>

                            {task.description && (
                              <p className={`text-xs leading-relaxed mt-1 ${task.status === 'DONE' ? 'text-zinc-600 line-through' : 'text-zinc-400'}`}>
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-zinc-500 text-sm italic py-4 bg-zinc-950/50 rounded-lg text-center border border-dashed border-zinc-800">
              No custom AI tasks generated for this project.
            </div>
          )}
        </div>

        {/* Filter Bar */}
        <div className="space-y-3 border border-zinc-800 rounded-xl p-3 bg-zinc-950/50">
          {/* Search */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search checklist items..."
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50"
            />
            {hasAnyFilter && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-zinc-500 hover:text-red-400 transition-colors whitespace-nowrap px-2 py-1"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-1.5">
            {FILTER_CATEGORIES.filter(cat => availableCategories.has(cat.key)).map(cat => {
              const isActive = activeCategories.has(cat.key);
              return (
                <button
                  key={cat.key}
                  onClick={() => toggleCategory(cat.key)}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all ${
                    isActive 
                      ? `${cat.color} border-current` 
                      : 'text-zinc-500 bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Type Filters */}
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-zinc-600 uppercase tracking-wider font-bold">Filter:</span>
            <button
              onClick={() => setShowCommandsOnly(!showCommandsOnly)}
              className={`px-2 py-0.5 rounded border transition-all ${showCommandsOnly ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' : 'text-zinc-500 border-zinc-800 hover:text-zinc-300'}`}
            >
              ⌘ Commands
            </button>
            <button
              onClick={() => { setShowRequiredOnly(!showRequiredOnly); if (showOptionalOnly) setShowOptionalOnly(false); }}
              className={`px-2 py-0.5 rounded border transition-all ${showRequiredOnly ? 'text-red-400 bg-red-500/10 border-red-500/30' : 'text-zinc-500 border-zinc-800 hover:text-zinc-300'}`}
            >
              Required
            </button>
            <button
              onClick={() => { setShowOptionalOnly(!showOptionalOnly); if (showRequiredOnly) setShowRequiredOnly(false); }}
              className={`px-2 py-0.5 rounded border transition-all ${showOptionalOnly ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' : 'text-zinc-500 border-zinc-800 hover:text-zinc-300'}`}
            >
              Optional
            </button>
            <span className="ml-auto text-zinc-600">{totalFilteredItems} items</span>
          </div>
        </div>

        {/* Bottom Section: CTO Foundation Tree */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <h3 className="font-semibold text-lg border-b border-zinc-800 pb-2 mb-4 flex justify-between items-center">
            CTO Master Foundation
            <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">900+ Standard Items</span>
          </h3>
          <ScrollArea className="flex-1 pr-4 bg-zinc-950/50 rounded-md border border-zinc-800">
            <div className="p-4 space-y-2">
              
              {finalFilteredPhases.length === 0 ? (
                <div className="text-center text-zinc-500 py-8 text-sm italic">
                  No items match your filters. Try adjusting categories or search.
                </div>
              ) : finalFilteredPhases.map((phase, phaseIdx) => {
                const Icon = IconComponents[phase.iconName] || CheckSquare;
                const isExpanded = expandedPhases[phase.id] || hasAnyFilter; // auto-expand when filtering
                
                // Clean the hardcoded "PART X — " from the title so we can dynamically number it
                const cleanTitle = phase.title.replace(/^PART \d+\s*[-—]\s*/i, '');
                
                return (
                  <div key={phase.id} className="border border-zinc-800 rounded-lg bg-zinc-900 overflow-hidden transition-all duration-200">
                    <button 
                      onClick={() => togglePhase(phase.id)}
                      className="w-full flex items-center gap-3 p-3 text-left hover:bg-zinc-800/50 focus:outline-none"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-zinc-500 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-zinc-500 flex-shrink-0" />
                      )}
                      <div className="p-1.5 bg-zinc-800 rounded-md">
                        <Icon className="w-4 h-4 text-orange-400" />
                      </div>
                      <span className="font-bold text-sm tracking-wide text-zinc-200">
                        PHASE {phaseIdx + 1} — {cleanTitle}
                      </span>
                      <span className="ml-auto text-[10px] text-zinc-600">{phase.sections.reduce((a, s) => a + s.items.length, 0)} items</span>
                    </button>
                    
                    {isExpanded && (
                      <div className="p-4 pt-0 border-t border-zinc-800/50 bg-zinc-900/50">
                        {phase.sections.map((section, sIdx) => (
                          <div key={sIdx} className="mt-4 first:mt-2">
                            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
                              {section.title}
                            </h4>
                            <div className="space-y-2 pl-2">
                              {section.items.map((item, iIdx) => {
                                const itemKey = `${phase.id}-${sIdx}-${iIdx}`;
                                const isChecked = checkedItems[itemKey];
                                const isCmd = itemHasCommand(item.label);
                                
                                return (
                                <div key={iIdx} className="flex gap-3 group">
                                  <div className="mt-0.5">
                                    <div 
                                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${isChecked ? 'bg-orange-500/20 border-orange-500' : 'bg-zinc-950 border-zinc-600 group-hover:border-orange-500/50'}`}
                                      onClick={() => toggleItem(itemKey)}
                                    >
                                      {isChecked && <Check className="w-3 h-3 text-orange-500" />}
                                    </div>
                                  </div>
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      {item.required && (
                                        <span className="text-[10px] font-bold bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded">
                                          REQ
                                        </span>
                                      )}
                                      {item.optional && (
                                        <span className="text-[10px] font-bold bg-yellow-500/10 text-yellow-400 px-1.5 py-0.5 rounded">
                                          OPT
                                        </span>
                                      )}
                                      {isCmd && (
                                        <span className="text-[10px] font-bold bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded">
                                          CMD
                                        </span>
                                      )}
                                      <span className={`text-sm font-medium ${isChecked ? 'text-zinc-600 line-through' : 'text-zinc-300'}`}>{item.label}</span>
                                    </div>
                                    {item.desc && (
                                      <span className={`text-xs mt-0.5 ${isChecked ? 'text-zinc-700 line-through' : 'text-zinc-500'}`}>{item.desc}</span>
                                    )}
                                  </div>
                                </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="p-4 text-center">
                {(LEVEL_WEIGHTS[projectLevel] || 1) < 4 ? (
                  <p className="text-xs text-zinc-500 italic">
                    + Upgrade project tier to see {projectLevel === "MVP" ? "Startup, " : ""}Professional, and Enterprise checklists.
                  </p>
                ) : (
                  <p className="text-xs text-zinc-500 italic">
                    All Enterprise items unlocked.
                  </p>
                )}
              </div>

            </div>
          </ScrollArea>
        </div>

      </CardContent>
    </Card>
  );
}

