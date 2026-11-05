# StackGen — Production Test Plan

Flows derived from the app's actual routes and endpoints. Cases: H = happy path, E = edge case, N = negative case.

## F01 — Auth: Signup / email verification
- F01-H1: Signup with valid email + password → account created, verification email sent (Resend)
- F01-H2: Clicking verification link → email verified, login works
- F01-N1: Signup with existing email → error, no duplicate account
- F01-N2: Password shorter than minimum → validation error
- F01-E1: 11+ auth attempts/min per IP → rate limited (429-style block)
- F01-E2: Verification link used twice → second attempt rejected

## F02 — Auth: Login / logout
- F02-H1: Correct credentials → session cookie set (HttpOnly, Secure, SameSite=None)
- F02-H2: Sign out → session destroyed, /dashboard redirects to /auth
- F02-N1: Wrong password → generic error, no user enumeration
- F02-N2: >10 login attempts/min → blocked by Better-Auth rate limiter

## F03 — Auth: OAuth (GitHub / Google) — MANUAL, needs real provider apps
- F03-H1: GitHub OAuth → account + session
- F03-H2: Google OAuth → account + session
- F03-N1: OAuth denial → back to /auth with error

## F04 — Blueprint generation (wizard)
- F04-H1: Logged-in free user, first project → blueprint generated, saved to /projects
- F04-N1: Free user with 1 existing project → 402 PAYMENT_REQUIRED
- F04-N2: Unauthenticated request → 401
- F04-N3: Empty/missing projectName → 400 (ValidationPipe)
- F04-E1: Unknown `model` id in body → falls back to first available provider
- F04-E2: All AI providers failing → mock blueprint returned, no 5xx

## F05 — Projects CRUD
- F05-H1: GET /projects returns only own projects (no second user's data)
- F05-H2: GET /projects/:id of another user → 404
- F05-N1: Unauthenticated → 401

## F06 — AI chat + model switching
- F06-H1: Chat panel opens, GET /ai/models returns available models
- F06-H2: Selecting model persists to localStorage and is sent as `model` in payload
- F06-H3: Reply rendered from selected provider
- F06-N1: Unauthenticated → 401 → panel shows "Please log in"
- F06-E1: Model's provider key missing → selector hides it (available=false)
- F06-E2: Paid user with 0 tokens → 402

## F07 — GitHub scanner
- F07-H1: Valid public repo URL → score + findings + graph rendered
- F07-N1: Unauthenticated → 401 → "Please log in" banner + link
- F07-N2: Non-github.com URL or path traversal → rejected (SSRF guard)
- F07-N3: repo not found (404 from raw.githubusercontent) → scan still returns with 'Not found' package context

## F08 — Cost estimate / docs / guide / zip
- F08-H1: Estimate cost (authed) → breakdown dialog
- F08-H2: Generate docs → README.md + ARCHITECTURE.md downloaded
- F08-H3: Generate zip (paid user) → boilerplate ZIP downloads
- F08-N1: Free user hits /ai/generate-zip → 402
- F08-N2: Unauthenticated on any → 401

## F09 — Lemon Squeezy checkout & webhooks
- F09-H1: Pricing → Startup → 302/redirect to hosted checkout URL
- F09-H2: order_created webhook (valid X-Signature) → user tier synced
- F09-H3: subscription_cancelled → tier downgraded to Free (only if no other active sub)
- F09-N1: Webhook without X-Signature → 401
- F09-N2: Webhook with invalid signature → 401
- F09-E1: Portal URL for user without subscription → 500 with clear message

## F10 — Admin
- F10-H1: Email in ADMIN_EMAILS → /projects/admin/all returns data, Admin link visible
- F10-N1: Other user → 401 from API and redirect away from /admin

## Not automatable here (manual pass needed)
- Real Resend email delivery (F01-H2), real OAuth (F03), real Lemon Squeezy hosted checkout + real webhook from LS servers (F09), real AI provider responses with live keys (F04/F06/F08), visual QA at mobile width.
