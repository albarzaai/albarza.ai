# Albarza (البرزة) — Delivery Plan

Status legend: ✅ done in this pass · ⏳ next phase

| # | Requirement | Plan / decision | Status |
|---|---|---|---|
| 1 | Next.js 16 latest | Next 16.4.3 (current `latest`; Next has no LTS tag, so we pin the 16.x `latest` and track patch releases), React 19, Tailwind v4, Turbopack, `proxy.ts` | ✅ |
| 2 | Server-side validation only | Zod schemas inside Server Actions / Hono handlers. Forms use `noValidate`, no client-side rules. Every API re-validates input and output | ✅ forms/gallery API · ⏳ Hono |
| 3 | Secure APIs & code | CSP, HSTS, X-Frame-Options, nosniff, Permissions-Policy (done). Next: Argon2id hashing, httpOnly+SameSite cookies, CSRF tokens, rate limits (Cloudflare Rate Limiting + Durable Objects), Turnstile, signed R2 URLs, dependency audit in CI, secret scanning | partly ✅ |
| 4 | UAE law | PDPL (Decree-Law 45/2021) consent, access/erasure/export, data residency review (Cloudflare region + R2 jurisdiction), cybercrime-law content policy and moderation, 5% VAT invoices in AED, e-commerce disclosure, AI-content labelling, TDRA/IP clauses. Terms/Privacy are drafts and need review by a UAE-licensed lawyer | ✅ drafts · ⏳ legal |
| 5 | Google login, passwords, Resend | Auth on Hono: Google OAuth (PKCE), email+password with Argon2id, email verification and reset through Resend, sessions in D1/KV | ✅ UI · ⏳ backend |
| 6 | Features | Projects, text-to-image, image-to-video, lip-sync, upscale, text-to-voice, voice changer, gallery | ✅ UI (mock) |
| 7 | Simple UI/UX | Davinci layout and flow, own brand | ✅ |
| 8 | Homepage clone | Same structure: hero prompt bar, models grid, 3 steps, feature blocks, why section, plus pricing, FAQ, CTA. Own logo and placeholder media (no Davinci assets) | ✅ |
| 9 | Logged-in like Davinci | Sidebar app shell with credits, upgrade, language switch | ✅ |
| 10 | All UI, no backend | Dashboard, projects, 6 tools, gallery, billing, settings, auth | ✅ |
| 11 | Hono + Cloudflare | Hono Worker (`/api/*`), D1 (SQL), R2 (media), KV (cache/sessions), Queues, Durable Objects (credit counters, rate limits) | ⏳ |
| 12 | 10,000 req/min | ~170 req/s. Static pages from CDN, API on Workers (auto-scale), idempotent writes, per-user and per-IP rate limits, load test with k6 before launch | ⏳ |
| 13 | Queue engine | Cloudflare Queues: request is written to D1 and enqueued, with at-least-once delivery, retries with backoff, dead-letter queue, idempotency keys, status polling or SSE | ⏳ |
| 14 | CDN, cache, fastest render | SSG for all public pages (done), immutable cache headers on `/media` and `/brand` (done), Cloudflare CDN, `stale-while-revalidate` for API, `next/font` self-hosting (done) | partly ✅ |
| 15 | Load on scroll | Gallery uses IntersectionObserver with cursor pagination, 12 items per page (done). Same pattern for projects and history | ✅ |
| 16 | Media in public | `/public/media` served directly by CDN (done). User-generated media in R2 behind a CDN domain | ✅ static |
| 17 | Noto Kufi Arabic + AED | Noto Kufi Arabic (AR) and Inter (EN) via `next/font`; `Intl.NumberFormat` with AED | ✅ |
| 19 | Arabic first, EN | `/ar` default, `/en`, RTL/LTR via `dir`, logical Tailwind classes | ✅ |
| — | Palette from your logo | Gold `#BD9B5F`, cream `#F8E9CC`, on warm near-black; all are CSS tokens in `app/globals.css` | ✅ |

## Open decisions
1. AI providers per feature (fal.ai / Replicate / direct model APIs) and their cost per AED credit.
2. Payments in AED: Stripe (UAE), Telr, or Network International.
3. Data residency: confirm whether Cloudflare's EU jurisdiction is acceptable under PDPL, or an in-country region is required.
4. Final logo files (SVG) to replace the redrawn mark in `public/brand/logo.svg`.
