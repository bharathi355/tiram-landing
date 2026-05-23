// Cross-domain CTA helper. This file is the landing site's explicit hand-off
// contract with the authenticated app in the sibling stocksflow repo.
//
// Contract invariants:
// - Landing emits app.<domain> URLs only via this helper.
// - Locale is carried in the path segment: /{locale}/...
// - CTAs target /onboarding directly; landing must not couple to /sign-up.
// - NEXT_PUBLIC_APP_ORIGIN is baked at build time (see Dockerfile).
import { resolveOrigin } from "@/lib/env-url";

export const APP_ORIGIN = resolveOrigin(
  "NEXT_PUBLIC_APP_ORIGIN",
  "https://app.tiram.co.in",
);

export function appUrl(locale: string, path: `/${string}` = "/"): string {
  return `${APP_ORIGIN}/${locale}${path === "/" ? "" : path}`;
}