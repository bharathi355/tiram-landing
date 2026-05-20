/**
 * Country variant detection for the marketing landing.
 *
 * Locale (en/ta) lives in the URL via next-intl. Country (IN vs OTHER) is a
 * separate axis resolved server-side from the deploy platform's geo header,
 * persisted in a cookie, and read by `i18n/request.ts` to merge India-variant
 * messages over the base locale.
 *
 * Production header source: Netlify's `x-nf-geo` (base64-encoded JSON with
 * `country.code`). Fallbacks cover Cloudflare, Vercel, CloudFront, and a
 * generic `x-country` so the same code works behind any sensible CDN — or in
 * a future move off Netlify — without a rewrite.
 *
 * Geo detection is best-effort. When nothing identifies the visitor, we fall
 * back to `OTHER` (global content), which is the safer default for SEO too
 * because Googlebot crawls primarily from US IPs.
 */

import type { NextRequest } from "next/server";

export const COUNTRY_COOKIE = "tiram-country";

export type CountryVariant = "IN" | "OTHER";

/** Where the variant decision came from — useful for debugging in dev. */
export type CountrySource =
  | "cookie-override"
  | "netlify-x-nf-geo"
  | "cloudflare-cf-ipcountry"
  | "vercel-x-vercel-ip-country"
  | "cloudfront-viewer-country"
  | "x-country"
  | "default-other";

export interface CountryDetection {
  variant: CountryVariant;
  source: CountrySource;
  /** The raw header / cookie value that produced the decision, if any. */
  raw: string | null;
}

/**
 * Edge-runtime-safe base64 → utf-8 decode. Avoids `Buffer` which isn't always
 * present in Next.js middleware. Returns `null` if the input is not valid
 * base64-JSON so callers can fall through to other header sources.
 */
function decodeNetlifyGeo(b64: string): unknown | null {
  try {
    // atob is available in the Edge runtime.
    const json = atob(b64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Internal: do the detection and report which signal won. Same logic as
 * `detectCountryFromRequest`, but returns the source too so a dev panel can
 * explain why a given visitor is seeing IN or OTHER content.
 */
export function detectCountryWithSource(req: NextRequest): CountryDetection {
  // Honour an existing cookie first — both for normal navigation (don't
  // re-do header parsing on every request) and as a manual local override.
  const cookied = req.cookies.get(COUNTRY_COOKIE)?.value;
  if (cookied === "IN" || cookied === "OTHER") {
    return { variant: cookied, source: "cookie-override", raw: cookied };
  }

  // Primary signal: Netlify Edge geo header (base64-JSON).
  const nfGeo = req.headers.get("x-nf-geo");
  if (nfGeo) {
    const decoded = decodeNetlifyGeo(nfGeo) as
      | { country?: { code?: string } }
      | null;
    const code = decoded?.country?.code;
    if (typeof code === "string") {
      return {
        variant: code.toUpperCase() === "IN" ? "IN" : "OTHER",
        source: "netlify-x-nf-geo",
        raw: code,
      };
    }
  }

  // Fallbacks for other CDNs that inject a flat two-letter country header.
  const fallbacks: ReadonlyArray<[string, CountrySource]> = [
    ["cf-ipcountry", "cloudflare-cf-ipcountry"],
    ["x-vercel-ip-country", "vercel-x-vercel-ip-country"],
    ["cloudfront-viewer-country", "cloudfront-viewer-country"],
    ["x-country", "x-country"],
  ];
  for (const [header, source] of fallbacks) {
    const v = req.headers.get(header);
    if (v) {
      return {
        variant: v.toUpperCase() === "IN" ? "IN" : "OTHER",
        source,
        raw: v,
      };
    }
  }

  return { variant: "OTHER", source: "default-other", raw: null };
}

/**
 * Inspect a request for the visitor's country. Used by middleware only.
 * Never throws.
 */
export function detectCountryFromRequest(req: NextRequest): CountryVariant {
  return detectCountryWithSource(req).variant;
}

/**
 * Server-component helper to read the country cookie that middleware set.
 * Pages, layouts, and server actions should call this — never re-do
 * geo detection. Kept async because Next 15's `cookies()` is async.
 */
export async function getCountryVariant(): Promise<CountryVariant> {
  // Lazy import so this module stays usable from the Edge runtime (middleware)
  // where `next/headers` is not available.
  const { cookies } = await import("next/headers");
  const value = (await cookies()).get(COUNTRY_COOKIE)?.value;
  return value === "IN" ? "IN" : "OTHER";
}
