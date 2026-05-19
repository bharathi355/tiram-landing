import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL as DEFAULT_SITE_URL } from "@/lib/brand.server";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL
).replace(/\/$/, "");

/**
 * Public sitemap. Lists every locale variant of the landing root with
 * hreflang alternates so search engines and AI crawlers pick the right
 * language per visitor. Sign-in/up live on the app subdomain — not on this
 * origin — so they're omitted here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routing.locales.map((locale) => {
    const alt: Record<string, string> = Object.fromEntries(
      routing.locales.map((l) => [l, `${SITE_URL}/${l}`]),
    );
    alt["x-default"] = `${SITE_URL}/${routing.defaultLocale}`;
    return {
      url: `${SITE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: { languages: alt },
    } as const;
  });
}
