# tiram-landing — Project instructions

This repo is the **marketing landing site** for Tiram (deployed to `tiram.co.in`). It is a sibling, not a sub-tree, of the main product repo.

- **Sibling repo:** `../stocksflow/` — the authenticated product (Django + Next.js dashboard + Electron desktop builds). Its `CLAUDE.md` is the source of truth for the product itself; this file is the source of truth for the marketing surface.
- **Hand-off:** primary CTAs link to `${NEXT_PUBLIC_APP_ORIGIN}/[locale]/onboarding`. The dashboard's `/sign-up` route is a thin server-side redirect to `/onboarding` that preserves locale + query string — **do not change either side of that contract without coordinating both repos.** See "Hand-off contract" below.

## 0. Solo developer / maintenance-free first (non-negotiable)

> Built and operated by one person. Every change must minimise the ongoing manual work it creates. If a feature works only because a human will remember to flip a flag, clean a table, rotate a token, or coordinate a multi-deploy rollout, the design is wrong — fix the design.

Concretely for the landing site:

- **No silent ongoing work.** No cron, no background worker, no scheduled job. The site is static-ish — pages render server-side from `next-intl` messages + a country cookie. If you find yourself reaching for a queue, stop and ask why.
- **No new infra without a forcing function.** No analytics SDK, A/B framework, CMS, headless backend, or feature-flag service unless the alternative is materially worse. Each one is a failure mode one person now owns. The current substrate is **only** Next.js + next-intl + Tailwind + framer-motion + the country middleware. Defend that minimalism.
- **No long-lived feature flags.** This is a static marketing site; flag-driven UX divergence is a code smell here. Ship the change or don't.
- **Defaults that work.** Every env var must have a safe dev default. `NEXT_PUBLIC_APP_ORIGIN` defaults to `http://localhost:3005` so a contributor running both repos locally sees CTAs hit their own dashboard dev server.
- **Loud failure.** No `try/catch` swallowing build errors. `npm run build` runs `check:env` and `check:i18n` first; a missing env var or i18n key blocks the deploy. That's intentional.
- **Docs stay aligned.** When the routing, locale set, hand-off contract, or shared brand-voice copy changes, update this file in the same change. Stale instructions become bugs the solo dev pays for.

## 1. Hand-off contract with stocksflow (read before changing CTAs)

The landing site **states the promise**; the dashboard's onboarding flow **honours it**. The two surfaces must agree.

- **CTA target:** `${APP_ORIGIN}/${locale}/onboarding` via [`lib/app-url.ts`](lib/app-url.ts) → `appUrl(locale, "/onboarding")`. Never hard-code `/sign-up` in a CTA — the dashboard route is a redirect today, but the canonical destination is `/onboarding`.
- **Locale passthrough:** the locale segment (`en` or `ta`) must survive the cross-domain jump. The dashboard's `app/[locale]/...` segment accepts whatever the landing emits. Adding a third locale (e.g. `hi`, `kn`) requires landing AND `stocksflow/frontend/i18n/routing.ts` to add it in the same change.
- **Query-string passthrough:** the dashboard's `/sign-up → /onboarding` redirect preserves query strings (see `stocksflow/frontend/app/[locale]/(auth)/sign-up/page.tsx`). Landing CTAs may attach `?next=/some/path` or campaign UTM params; both must survive.
- **`/sign-up` is a redirect, not a form.** Don't link directly to `/sign-up` from landing — it works today, but it's an extra HTTP hop. Link to `/onboarding` directly.
- **Cross-domain auth:** the landing has **no** backend, no Supabase client, no JWT handling. Anything that requires the user to be authenticated lives in stocksflow. If a landing page needs to know whether the visitor is signed in, the answer is almost always "design it so it doesn't".

### Parity rule (mirror in the same change)

Any change to these surfaces requires a matching change in `../stocksflow/`:

- The onboarding URL contract (path, query-param shape, locale segment).
- The locale set.
- **Brand voice fragments** that appear on both sides. Canonical example: `"30-day free trial · No card needed"`. These live in landing's messages (the authoritative source) and are mirrored verbatim in the dashboard's onboarding strings. If you change the marketing wording, update `stocksflow/frontend/messages/{en,ta}.json` in the same PR — or tag both copies with a `// PARITY: stocksflow` / `// PARITY: tiram-landing` comment so a grep finds them.
- Pricing strings, plan names, claimed numbers ("save 30%", trial duration). Marketing must not assert what the product doesn't deliver.

## 2. Tech stack & layout

| Layer | Stack |
|-------|-------|
| Framework | Next.js 15 (App Router), React 19, TypeScript strict |
| i18n | `next-intl` 4 |
| Styling | Tailwind 3, framer-motion 12, `next-themes` |
| Build | Docker standalone (`Dockerfile`), bakes `NEXT_PUBLIC_*` at build time via `ARG` |
| Tests | Vitest + Testing Library, jsdom; no e2e in this repo |
| Lint | ESLint (next/core-web-vitals) |
| Deploy | `tiram.co.in` (apex); dashboard lives at `app.tiram.co.in` |
| Dev port | 3006 (dashboard is 3005 — keep them distinct so both run side-by-side) |

```
app/
  [locale]/        → Locale-routed pages (en, ta)
    page.tsx       → Landing page
    layout.tsx
    opengraph-image.tsx
    twitter-image.tsx
  globals.css
  icon.png / apple-icon.png
  robots.ts / sitemap.ts
components/
  marketing/       → Landing-specific composites (hero, pricing, FAQ, etc.)
  debug/           → Dev-only inspector tools (not bundled in prod)
i18n/
  routing.ts       → locales: ["en", "ta"], defaultLocale: "en", localePrefix: "always"
  request.ts       → Loads {locale}.json, deep-merges {locale}-IN.json if cookie=IN
  navigation.ts    → next-intl Link / redirect / useRouter wrappers
lib/
  app-url.ts       → appUrl(locale, path) — cross-domain CTA helper
  brand.ts         → BRAND_NAME, BRAND_TAGLINE, SUPPORT_EMAIL, DOMAIN, SITE_URL
  brand.server.ts  → "server-only" re-export of brand for JSON-LD / sitemap / robots
  country.ts       → COUNTRY_COOKIE name, detectCountryWithSource(req)
  env-url.ts       → resolveOrigin(envVar, devFallback)
  utils.ts         → cn() + small helpers
messages/
  en.json / en-IN.json
  ta.json / ta-IN.json
middleware.ts      → next-intl middleware + country cookie writer
scripts/
  check-env.mjs    → Fails build if a required NEXT_PUBLIC_* is missing
  check-i18n.mjs   → Fails build on missing leaf keys across locale files
tests/
  framework/       → renderWithProviders, shared setup
  unit/            → Vitest unit tests, mirrored layout
```

## 3. i18n (4 message files, 2 axes)

There are **two orthogonal axes**:

1. **URL locale** (`en`, `ta`) — picked from the `/[locale]/...` URL segment, resolved by next-intl middleware. This is the user-visible language.
2. **Country variant** (default, `IN`) — picked from the `tiram_country` cookie that `middleware.ts` writes from CDN headers / Accept-Language. **Orthogonal to locale**: an `en` user in India sees `en.json` deep-merged with `en-IN.json`; a `ta` user outside India sees only `ta.json`.

Rules:

- **All user-facing strings go through `next-intl`.** No hardcoded English (or Tamil) in JSX, toasts, alt text, or aria-labels.
- **Keys exist in all 4 files** for the base locales: `en.json` and `ta.json`. The `-IN` files are **enrichment overlays** — they may be partial (any missing key falls back to the base file via the deep-merge in `i18n/request.ts`). If you add a key, it must exist in `en.json` and `ta.json`; the `-IN` variants are optional.
- **`npm run check:i18n` enforces parity** between `en.json` and `ta.json` at build time. Run it locally before committing.
- **Use `i18n/navigation.ts` helpers** (`Link`, `redirect`, `useRouter`), not bare `next/navigation` — bare navigation drops the locale segment.
- **Deep-merge semantics:** plain objects merge recursively; arrays and primitives are *replaced*. An India variant can override an entire `items: [...]` block cleanly. See `i18n/request.ts` for the exact rule.
- **No country axis on the URL.** We don't ship `/en-IN/...` URLs — the country axis is cookie-driven only. Don't try to extend `localePrefix` to encode country; the deep-merge model is intentional.

## 4. Code & component reuse

- Marketing composites live in `components/marketing/` (hero, features grid, pricing table, FAQ, testimonials, footer, etc.). Reuse them across landing pages; don't fork.
- No `components/ui/` primitive layer in this repo — the surface is small enough that page-level Tailwind composes directly. If you find yourself building the same chrome in three pages, extract to `components/marketing/`.
- `lib/` is for small, framework-y helpers (URL builders, brand constants, country detection). No business logic — there's no business logic to put here.
- `framer-motion` is the only animation tool — no GSAP, no Lottie. Heavy animations dynamically imported.

## 5. Performance & UX bar

- **Compelling on first sight.** A first-time visitor should understand what Tiram is and want to start a trial within 5 seconds of landing. No clutter, no half-finished sections, no "Coming soon" tiles.
- **Static-first.** Pages are Server Components by default. `"use client"` only for genuinely interactive surfaces (animation triggers, theme toggle, debug inspector).
- **Images via `next/image`.** Apex domain serves them; don't reach into the dashboard's S3.
- **Lighthouse non-negotiables:** LCP < 2.5s on 4G, CLS < 0.1, no render-blocking JS bigger than the framework chunk. If a framer-motion intro pushes LCP, defer it.
- **No tracking pixels without an explicit decision.** Adding Google Analytics, Meta Pixel, Mixpanel, or any other tag is a *forcing function* decision (see §0). Default is none.

## 6. Accessibility

- Every interactive element has an accessible name. Decorative icons get `aria-hidden`.
- Focus states visible. Color is never the only signal.
- Marketing pages tend to use large hero text — ensure contrast against background images / gradients passes WCAG AA at the smallest size shown.
- Animations respect `prefers-reduced-motion`. framer-motion handles this if you wire it up — verify, don't assume.

## 7. Testing

- Unit tests under `tests/unit/` mirror the source layout (`components/marketing/hero.tsx` → `tests/unit/components/marketing/hero.test.tsx`). Tests are **never** co-located with source.
- `tests/framework/render.tsx` exports `renderWithProviders` (NextIntl + theme provider) for component tests. Use it.
- No Playwright in this repo; the marketing site has no auth flow to e2e. If you find yourself wanting one, the test probably belongs in stocksflow.
- `npm run test` runs Vitest once; `npm run test:watch` for dev. Run before committing.
- **i18n is dual-locale.** `check:i18n` enforces parity at build time. Don't ship a key that only exists in `en.json`.

## 8. Environment variables

- All env vars are `NEXT_PUBLIC_*` (this site has no server-side secrets). They are baked at build time via `Dockerfile` `ARG` → `ENV` and inlined into the client JS.
- `scripts/check-env.mjs` fails the build if a required var is missing. To add a required var: add it to the script, the Dockerfile ARGs, AND document its purpose here in §8 — in the same change.
- Current required vars:
  - `NEXT_PUBLIC_SITE_URL` — canonical apex URL (e.g. `https://tiram.co.in`). Used by sitemap, robots, OpenGraph, JSON-LD.
  - `NEXT_PUBLIC_APP_ORIGIN` — dashboard origin (e.g. `https://app.tiram.co.in`). Used by `lib/app-url.ts` for CTA targets. Dev default: `http://localhost:3005`.
- **Never** introduce a secret-bearing env var here. If something needs a secret, it belongs in stocksflow.

## 9. Country detection

- Middleware reads CDN headers (Netlify / CloudFront / Fly equivalents) and Accept-Language as fallback; writes `tiram_country` cookie with `IN` or `XX` (rest-of-world).
- Cookie is **not** `httpOnly` — a future client-side override toggle ("show me India content") may read it.
- `Vary: x-tiram-country, cookie` is set on every response so downstream caches partition correctly. If you add a new CDN, configure its edge-cache key to include both axes.
- Debug headers `x-tiram-country` and `x-tiram-country-source` are emitted on every response — useful in dev devtools and prod incident triage.

## 10. Definition of Done

A change is done when **all** of these are true:

- [ ] Solves the actual root cause; no symptom patches.
- [ ] Strings are i18n keys present in **both** `en.json` and `ta.json` (and `-IN` variants where the message genuinely differs).
- [ ] `npm run check:i18n` passes locally.
- [ ] `npm run check:env` passes locally.
- [ ] `npm run typecheck` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run test` passes.
- [ ] `npm run build` succeeds (it runs the checks above as a pre-step).
- [ ] Mirrored test file updated under `tests/unit/...` for every modified source file (or created if absent).
- [ ] Hand-off contract preserved: CTAs target `/[locale]/onboarding`, locale + query string pass through.
- [ ] Parity with `../stocksflow/` preserved (locale set, brand voice, pricing strings, onboarding URL). Cross-repo changes land in both in the same PR.
- [ ] No new env vars without a safe dev default and a `check-env.mjs` entry.
- [ ] No new infra (analytics, CMS, headless backend, etc.) without an explicit forcing function.
- [ ] Lighthouse not regressed (LCP, CLS, JS bundle size).
- [ ] Accessibility preserved (label, focus, contrast, reduced-motion).

## 11. Knowledge graph (graphify)

If you run `/graphify` from this repo, the output lives at `graphify-out/` (not checked in). The landing repo is small enough that the graph is mostly a sanity check; the interesting graph is in `../stocksflow/graphify-out/`.

## 12. Anti-patterns (refuse these)

- Hard-coding `/sign-up` as a CTA target instead of `/onboarding`.
- Hard-coding `http://localhost:3005` or `https://app.tiram.co.in` in a component — go through `lib/app-url.ts`.
- Reading the country cookie directly from a Server Component instead of using `i18n/request.ts`'s merged messages — the cookie is the implementation detail.
- Adding a new URL locale segment without updating `i18n/routing.ts` AND `stocksflow/frontend/i18n/routing.ts`.
- Adding an analytics SDK because "we'll need it eventually". You won't, until you do. Then it's a forcing function.
- Cross-repo claims that contradict the product. "Save 50% in 30 days" on the landing while onboarding promises nothing of the sort. Test the claim against reality before shipping it.
- `console.log` in committed code. Use the middleware's dev-only logging or remove the line.
- `fetch()` to the dashboard's API from a landing page. The landing has no business hitting `/api/v1/`. If you think it does, the feature belongs in stocksflow.
