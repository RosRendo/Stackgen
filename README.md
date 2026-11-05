# ? StackGen AI � AI CTO & Full-Stack Architecture Generator

> Visual drag-and-drop system topology designer, Google Gemini boilerplate generator, production readiness scanner, and instant ZIP export.

---

## ? Overview
**StackGen AI** acts as an AI Chief Technology Officer for software teams and indie founders. Users can describe their application requirements in natural language or visually wire system components on an interactive node canvas. StackGen generates fully typed TypeScript boilerplates, database schemas, Docker configurations, and authentication pipelines in seconds.

---

## ??? Architecture Topology
- **Frontend Builder**: Next.js 16, React 19, Tailwind CSS 4, @xyflow/react, Better-Auth Client (Port 3005)

- **Backend Generator Engine**: NestJS 11, Multi-provider AI gateway (Google Gemini, OpenAI, Anthropic, Groq, DeepSeek, OpenRouter — with model switching + auto-fallback), Prisma 6, JSZip / FileSaver (Port 3001)
- **Database & Storage**: Supabase (PostgreSQL) with Prisma ORM
- **Payments & Subscriptions**: Lemon Squeezy gateway integration (hosted checkout + webhooks)

---

## ?? Key Modules
1. **Visual Node Canvas**: Wire frontend, backend, database, cache, and auth nodes via @xyflow/react and @hello-pangea/dnd.
2. **AI Code Synthesis**: Google Gemini AI writes production-grade boilerplates tailored to selected framework combinations.
3. **Instant Code Bundle Export**: Generates clean, downloadable .zip archives with Docker Compose and environment configs.
4. **Production Readiness Checklist**: Audits architecture against 50+ enterprise standards (security headers, rate limiting, ORM migrations).

---

## ??? Quick Start

### Backend (NestJS)
`ash
cd backend
npm install
npm run start:dev
`

### Frontend (Next.js)
`ash
cd frontend
npm install
npm run dev -- -p 3005
`

---

## ?? License
Private & Proprietary � Ros Rendo
