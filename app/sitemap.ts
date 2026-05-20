import { statSync } from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL as DEFAULT_SITE_URL } from "@/lib/brand.server";
import { resolveOrigin } from "@/lib/env-url";

const SITE_URL = resolveOrigin("NEXT_PUBLIC_SITE_URL", DEFAULT_SITE_URL);

// lastModified comes from the per-locale messages file mtime — meaningful
// "content changed" signal, not just build time. Falls back to "now" if the
// file isn't readable at build (shouldn't happen, but safe).
function messagesMtime(locale: string): Date {
  try {
    return statSync(path.resolve(process.cwd(), `messages/${locale}.json`))
      .mtime;
  } catch {
    return new Date();
  }
}

/**
 * Public sitemap. Lists every locale variant of the landing root with
 * hreflang alternates so search engines and AI crawlers pick the right
 * language per visitor. Sign-in/up live on the app subdomain — not on this
 * origin — so they're omitted here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => {
    const alt: Record<string, string> = Object.fromEntries(
      routing.locales.map((l) => [l, `${SITE_URL}/${l}`]),
    );
    // India-targeted hreflang aliases share URLs with their base locale —
    // India variant is served via a country cookie, not a separate path.
    // Mirrors the `languages` map in app/[locale]/page.tsx::generateMetadata.
    alt["en-IN"] = `${SITE_URL}/en`;
    alt["ta-IN"] = `${SITE_URL}/ta`;
    alt["x-default"] = `${SITE_URL}/${routing.defaultLocale}`;
    return {
      url: `${SITE_URL}/${locale}`,
      lastModified: messagesMtime(locale),
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: { languages: alt },
    } as const;
  });
}
