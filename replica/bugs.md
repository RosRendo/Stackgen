# StackGen — Bug Report (pre-production test sprint, Nov 2026)

## Reproduced & fixed

### BUG-01 · S3 (a11y) — Wizard submit button has no accessible name
- **Steps:** Open `/dashboard` (logged in), inspect the icon-only arrow submit button in the wizard.
- **Expected:** Button announces "Generate architecture" to screen readers / has an accessible name.
- **Actual (before fix):** Icon-only `<motion.button>` with only an SVG — no name; the form could only be submitted via the undocumented Enter-key shortcut.
- **Evidence:** Playwright page snapshot showed the button as unnamed; locator by role/name failed.
- **Fix:** Added `aria-label="Generate architecture"` to `project-wizard.tsx`. Re-ran suite: 6/6 pass.

### BUG-02 · S1 (security) — 5 paid AI endpoints had no auth *(found in review, fixed earlier, now regression-tested)*
- **Steps:** `POST /ai/chat`, `/ai/generate-docs`, `/ai/scan-github`, `/ai/estimate-cost`, `/ai/generate-zip` without a session.
- **Expected:** 401.
- **Actual (before fix):** 200 — anonymous users could burn AI provider quota (cost exposure).
- **Evidence:** Backend e2e suite `backend/test/app.e2e-spec.ts` — all 8 `/ai/*` endpoints now assert 401 unauthenticated + 400 on non-whitelisted fields. 26/26 pass.

### BUG-03 · S2 (payments broken) — Paddle env mismatch *(found in review, removed with migration)*
- Code read `PADDLE_LIVE_API_KEY`; env defined `PADDLE_API_KEY` → Paddle client always initialized with an empty key; portal sessions could never work. Superseded by the Lemon Squeezy migration.

### BUG-04 · S2 (auth UX) — scanner/chat showed raw failure on 401 *(fixed)*
- Unauthenticated scanner/chat calls now show "Please log in" with a link instead of a silent/console-only failure. Covered by frontend e2e (6/6 pass).

## Known limitations (not bugs, deliberate / follow-ups)
- **Token metering is fake** (`ai.service.ts` returns constant usage: 1000/5000/100 per call, not real provider usage). Works for gating, wrong for accounting.
- **Silent mock fallback:** if all AI providers fail, blueprint/scan/zip return hardcoded mock data with only a `console.warn`. Users can receive fake results without a visible warning. Consider surfacing a banner.
- Chat panel only renders after a project exists (by design, verified in e2e).

## To check manually (needs real credentials/services — cannot be automated here)
- [ ] Resend: real verification email delivered and link verifies (F01-H2)
- [ ] GitHub + Google OAuth end-to-end with real provider apps (F03)
- [ ] Lemon Squeezy: hosted checkout payment → real webhook from LS servers → tier sync (F09)
- [ ] At least one real AI provider key: real generations across all models in the selector (F04/F06/F08)
- [ ] Supabase: `prisma db push` against the real project, login against pooled `DATABASE_URL`
- [ ] Visual pass at mobile width (375px) for dashboard/pricing
