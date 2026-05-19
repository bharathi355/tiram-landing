---
name: Tiram Landing Design System
project: tiram-landing
stack: Next.js 15, React 19, Tailwind CSS, next-intl, next-themes, Framer Motion
brand:
  name: Tiram
  nativeName: திறம்
  legalName: Tiram Technologies Private Limited
  domain: tiram.app
  supportEmail: hello@tiram.app
colors:
  background: '#f8fafc'
  foreground: '#0f172a'
  surface: '#ffffff'
  surface-muted: '#f8fafc'
  surface-band: '#f1f5f9'
  border: '#e2e8f0'
  border-strong: '#cbd5e1'
  text-primary: '#0f172a'
  text-secondary: '#475569'
  text-muted: '#64748b'
  accent-50: '#eef2ff'
  accent-100: '#e0e7ff'
  accent-200: '#c7d2fe'
  accent-300: '#a5b4fc'
  accent-400: '#818cf8'
  accent-500: '#6366f1'
  accent-600: '#4f46e5'
  accent-700: '#4338ca'
  accent-800: '#3730a3'
  accent-900: '#312e81'
  success: '#059669'
  warning: '#d97706'
  danger: '#dc2626'
  dark-background: '#020617'
  dark-surface: '#0f172a'
  dark-surface-soft: '#1e293b'
  dark-border: '#1e293b'
  dark-text-primary: '#f8fafc'
  dark-text-secondary: '#cbd5e1'
typography:
  latin: Inter
  tamil: Noto Sans Tamil
  baseSize: 14px
  sectionHeading: 30px mobile / 36px desktop, 600 weight
  heroHeading: 36px mobile / 48px tablet / 60px desktop, 600 weight
  body: 16px marketing body, 14px UI text
  small: 12px to 13px supporting text
rounded:
  control: 6px
  pill: 9999px
  card: 16px
  heroCard: 24px
  ctaPanel: 24px
spacing:
  page-x-mobile: 16px
  page-x-tablet: 24px
  page-x-desktop: 32px
  content-max-width: 1280px
  nav-height: 64px
  section-y-mobile: 80px
  section-y-desktop: 112px
---

# Tiram Landing Design System

This document describes the public marketing site in this repository. It is not
the authenticated billing app design system. The app may share brand values and
some tokens, but this workspace renders the anonymous landing experience at
`/{locale}` with localized content, SEO metadata, pricing controls, and links to
the product app.

## Product Positioning

Tiram is billing, invoicing, and warehouse inventory software for Indian small
businesses. The landing page should make that clear in the first viewport: GST,
UPI, bilingual Tamil + English support, thermal printing, and multi-warehouse
inventory are not secondary proof points; they are the reason the page exists.

The tone is confident, practical, and founder-friendly. It should feel like a
modern SaaS product built for real shops, distributors, and counters in India,
not like a generic finance template. Copy should stay concrete: invoices,
stock, dues, GST reports, UPI, receipts, warehouses, staff, and daily decisions.

## Repository Shape

The landing page is a localized Next.js route:

| Area | Files | Purpose |
| --- | --- | --- |
| Page shell | `app/[locale]/layout.tsx`, `app/[locale]/page.tsx` | Locale validation, providers, metadata, and section order. |
| Global styling | `app/globals.css`, `tailwind.config.ts` | Fonts, Tailwind accent scale, dark mode variables, animation utilities. |
| Marketing sections | `components/marketing/*.tsx` | Navigation, hero, proof, feature, pricing, FAQ, CTA, footer, JSON-LD. |
| Localization | `messages/en.json`, `messages/ta.json`, `i18n/routing.ts` | English/Tamil strings with always-prefixed locale routes. |
| Brand constants | `lib/brand.ts`, `lib/brand.server.ts` | Shared identity, domain, legal name, and support email. |
| App links | `lib/app-url.ts` | Sign-in/sign-up URLs into the product app. |

The implemented section order is fixed in `app/[locale]/page.tsx`:

1. Navigation
2. Hero
3. Trust strip
4. How it works
5. Outcomes
6. Features
7. Built for India
8. Testimonials
9. Pricing
10. FAQ
11. Final CTA
12. Footer
13. JSON-LD

## Brand Assets

The navigation uses `/logo.png` through `next/image` at 32 x 32. The logo is
always paired with the localized `common.appName` wordmark. Alt text must come
from `common.logoAlt` and must not be hardcoded in JSX.

Brand constants live in `lib/brand.ts` and the server-safe mirror in
`lib/brand.server.ts`. Keep the two files aligned on rebrand:

| Token | Current value |
| --- | --- |
| Brand name | Tiram |
| Native brand name | திறம் |
| Legal name | Tiram Technologies Private Limited |
| Domain | tiram.app |
| Support email | hello@tiram.app |

## Color System

The palette is neutral-first with indigo as the primary action and recognition
color. Slate carries structure and legibility; accent indigo carries CTAs,
icons, focus, and important proof highlights.

### Light Mode

- Page background: white or Slate-50 depending on section rhythm.
- Primary text: Slate-900.
- Secondary text: Slate-600 and Slate-500.
- Borders: Slate-200, with Slate-300 for stronger control outlines.
- Primary action: Accent-600 (`#4f46e5`) with Accent-700 hover.
- Accent surfaces: Accent-50 through Accent-200.
- Positive proof: Emerald used sparingly for payment/verified states.
- Warning: Amber used for low-stock/product mocks.

### Dark Mode

Dark mode is class-based via `next-themes` and applies to the marketing site.
The root `.dark` variables in `app/globals.css` set the background to Slate-950
and foreground to Slate-200. Components use Tailwind `dark:` classes directly.

Dark surfaces should use Slate-950, Slate-900, and Slate-800. Borders should be
Slate-800 or translucent white on the dark India band. Accent colors shift up to
Accent-300/400 for readability.

### Gradients

Gradients are part of the current landing identity, but they should support the
message rather than become decorative noise.

- Hero backdrop: restrained `from-accent-50 via-white to-white` in light mode.
- Hero halo: soft blurred Accent-200 / Accent-900 motion element.
- Feature mocks: small per-card gradients, blurred and contained.
- Built for India: dark Slate-950 band with radial accent overlays.
- Final CTA: Accent-600 to violet with slow `gradient-shift` animation.

Do not turn the whole page into a single purple gradient theme. Keep most
sections neutral so the product proof and CTAs remain scannable.

## Typography

Inter is loaded with `next/font/google` in the locale layout. Noto Sans Tamil is
vendored in `public/fonts/` and declared in `app/globals.css` so Tamil text does
not depend on runtime Google Fonts requests. The Tailwind `font-sans` stack is:

`Inter`, system UI, `Noto Sans Tamil`, sans-serif.

Use the existing type rhythm:

| Use | Classes |
| --- | --- |
| Hero H1 | `text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight` |
| Section H2 | `text-3xl sm:text-4xl font-semibold tracking-tight` |
| Feature H3 | `text-2xl sm:text-3xl font-semibold tracking-tight` |
| Card title | `text-base` or `text-lg font-semibold` |
| Marketing body | `text-base leading-relaxed` |
| UI/body copy | `text-sm` |
| Fine print | `text-xs` |
| Numbers | `tabular-nums` |

Tamil content should be allowed to wrap naturally. Avoid forced uppercase for
translated user-visible strings unless the string is decorative and already
short, such as a badge.

## Layout

The page is centered on a `max-w-7xl` content rail with responsive horizontal
padding:

- Mobile: `px-4`
- Small/tablet: `sm:px-6`
- Desktop: `lg:px-8`

Section vertical rhythm is intentionally generous:

- Standard sections: `py-20 sm:py-28`
- Hero: `pt-24 pb-16 sm:pt-32 sm:pb-24`
- Final CTA wrapper: `py-20 sm:py-28`

Primary section layouts:

- Hero: two-column grid at `lg`, copy on left and invoice mock on right.
- Trust strip: full-width marquee band with border top and bottom.
- How it works: four-step ordered grid at `md`, stacked with vertical arrows on
  mobile.
- Outcomes: four KPI cards, one column mobile, two at `sm`, four at `lg`.
- Features: alternating two-column editorial rows at `lg`.
- Built for India: dark three-column card grid.
- Testimonials: horizontal marquee cards.
- Pricing: centered controls and two-column plan grid at `md`.
- Final CTA: contained rounded gradient panel.

## Navigation

`MarketingNav` is fixed to the top with a 64px internal height. It starts
transparent and switches after 8px of scroll to:

- Light: white at 80% opacity, Slate-200 border, backdrop blur.
- Dark: Slate-950 at 80% opacity, Slate-800 border, backdrop blur.

Desktop navigation shows section anchors, language switcher, theme toggle, sign
in, and Start free. Mobile collapses to a 36px square menu button and animated
drawer using Framer Motion height/opacity transitions.

Maintain the current anchor set unless the page structure changes:

- `#features`
- `#how-it-works`
- `#india`
- `#pricing`
- `#faq`

The skip link must remain first inside the header and point to `#main`.

## Components

### Buttons and Links

Primary CTAs are pill-shaped, 40-48px tall, accent-filled, and often pair text
with a Lucide `ArrowRight`. Secondary CTAs are white/dark-surface pills with a
Slate border. The product app routes are generated with `appUrl(locale, path)`.

Use buttons only for local UI state, such as theme toggle, menu toggle, billing
cycle, and seat steppers. Use anchors for navigation and product app links.

### Cards

Marketing cards use `rounded-2xl`, Slate-200 borders, white surfaces, and subtle
shadows. Dark cards use Slate-900 with Slate-800 borders. Hover states can lift
by `-translate-y-1` and add a restrained accent shadow, as seen in Outcomes and
Built for India.

Do not nest decorative cards inside larger decorative cards. Product mocks are
allowed because they represent UI fragments, not generic containers.

### Product Mocks

The landing page uses HTML/CSS mocks instead of screenshots:

- Hero invoice mock: invoice status, line items, GST/UPI hints.
- Feature mocks: generated rows based on feature copy.
- How-it-works mocks: product list, invoice, receivables, dashboard fragments.

Mocks should look believable, data-dense, and related to the copy beside them.
Keep text short enough to avoid wrapping inside tiny rows. Use `tabular-nums`
for amounts, counts, and percentages.

### Pricing Controls

Pricing is interactive client UI:

- Monthly/yearly segmented control with `role="radiogroup"`.
- Annual discount calculated from two waived months.
- Seat stepper from 1 to 50 users.
- Live total rendered with `aria-live="polite"`.

The mirrored marketing price is `249` INR per seat per month. Checkout remains
the source of truth in the backend; this site should avoid implying pricing is
authoritative beyond the marketing display.

### Language and Theme Controls

The language switcher changes between English and Tamil locale-prefixed routes.
The theme toggle uses `next-themes`, renders both icons on the server to avoid
hydration mismatch, and switches based on `resolvedTheme` after mount.

Icon buttons are 36 x 36, `rounded-md`, bordered, and use Lucide icons at 16px.

## Motion

Motion uses Framer Motion through `components/marketing/motion.tsx` primitives:

- `ScrollReveal`
- `StaggerContainer`
- `StaggerItem`
- `CountUp`
- `Marquee`
- re-exported `motion` and `AnimatePresence`

Animations should be one-shot on scroll with `viewport/useInView({ once: true })`.
The primitives respect `prefers-reduced-motion`; keep new section animation on
these primitives unless there is a strong reason not to.

Global CSS keyframes:

| Animation | Use |
| --- | --- |
| `float` | Hero invoice mock. |
| `marquee` | Trust strip and testimonials. |
| `shimmer` | Pricing placeholders if needed. |
| `gradient-shift` | Final CTA gradient drift. |
| `pulse-ring` | Available for idle CTA emphasis. |

`prefers-reduced-motion: reduce` disables marquee, shimmer, gradient shift, and
pulse-ring utilities in CSS. Framer Motion primitives also render their final
state under reduced motion.

## Iconography

Use Lucide icons for all interface and feature icons. The site currently uses
icons such as `Receipt`, `FileCheck`, `QrCode`, `Languages`, `Printer`,
`Warehouse`, `Package`, `Wallet`, `LayoutDashboard`, `Clock`, `Zap`,
`ShieldCheck`, `TrendingUp`, `Star`, `Quote`, `Sun`, `Moon`, `Menu`, and `X`.

Default icon sizes:

- Nav/theme/menu buttons: `h-4 w-4`
- Feature and KPI cards: `h-5 w-5`
- Small badges/status chips: `h-3 w-3` or `h-3.5 w-3.5`

Decorative icons must use `aria-hidden`. Icon-only controls must have localized
`aria-label` text.

## Localization

The site supports English and Tamil using `next-intl`.

- Supported locales: `en`, `ta`.
- Default locale: `en`.
- Locale prefix: always.
- All landing copy lives in `messages/en.json` and `messages/ta.json`.
- Components read content with `useTranslations` or `t.raw()` for arrays.

When adding or changing visible copy, update both locale files and run
`npm run check:i18n`. Do not hardcode English copy inside marketing components
unless it is non-user-facing mock data or an intentionally universal symbol.

Tamil strings may be longer than English. Design new controls with flexible
widths, wrapping copy, and no viewport-scaled font sizes.

## SEO, AEO, and Structured Data

The landing page generates locale-specific metadata in `app/[locale]/page.tsx`:

- Title, description, keywords, Open Graph, and Twitter metadata come from
  `landing.seo` messages.
- Canonical URL is `SITE_URL/{locale}`.
- `hreflang` includes every supported locale and `x-default` pointing to English.
- Open Graph locale is `ta_IN` for Tamil and `en_IN` for English.
- `SITE_URL` resolves from `NEXT_PUBLIC_SITE_URL`, falling back to brand config.

`JsonLd` renders structured data for the landing page. Keep SEO and AEO copy
answer-first: name the product category, audience, India-specific support, and
core use cases directly. Avoid vague claims without proof nearby.

Static crawler support lives in `app/sitemap.ts`, `app/robots.ts`,
`public/llms.txt`, and `public/llms-full.txt`.

## Accessibility

Baseline rules for this project:

- Preserve the skip link to `#main`.
- Use semantic sections and stable IDs for anchor navigation.
- Use anchors for navigation and buttons for state changes.
- Add `aria-label` to icon-only controls.
- Mark decorative icons, SVGs, and gradients with `aria-hidden`.
- Keep pricing totals and seat changes polite with `aria-live`.
- Respect reduced motion in new animations.
- Preserve keyboard focus rings; do not remove browser focus without replacing
  it with an accessible visible state.
- Maintain contrast in dark mode, especially on accent text and translucent
  cards.

## Responsive Behavior

The landing page must remain polished from 360px phones to wide desktop.

- Navigation switches to mobile drawer below `md`.
- Hero mock moves below copy on small screens and is hidden from the right column
  until `lg`.
- Four-step process becomes one-column with down arrows on mobile.
- Outcome cards move from 1 to 2 to 4 columns.
- Pricing cards move from one column to two at `md`.
- Marquee cards use fixed widths but sit inside overflow-hidden tracks with edge
  fade masks.

Avoid layouts that rely on a single long line fitting. Tamil, pricing labels,
and CTAs must wrap or flex without overlap.

## Implementation Rules

- Prefer existing marketing motion primitives over ad hoc Framer Motion blocks.
- Prefer existing Tailwind tokens and the `accent` scale over introducing new
  brand colors.
- Keep cards at `rounded-2xl` for marketing surfaces unless matching an existing
  control at `rounded-md` or a CTA at `rounded-full`.
- Use `cn` from `lib/utils.ts` for conditional class composition.
- Keep product claims synchronized across hero, features, built-for-India,
  pricing, FAQ, `llms` files, and SEO strings.
- Keep comments sparse and useful; the current code uses comments mainly to
  explain motion, SEO, pricing-source, and mock intent.

## Verification

Before shipping design or copy changes, run the checks that match the change:

```bash
npm run check:i18n
npm run typecheck
npm test
npm run build
```

For visual changes, run the dev server with `npm run dev` and review both
`/en` and `/ta` in light and dark themes. Check at least mobile width around
360px and desktop width around 1440px.
