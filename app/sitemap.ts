import { statSync } from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { ARTICLES } from "@/lib/articles";
import { SITE_URL as DEFAULT_SITE_URL } from "@/lib/brand.server";
import { resolveOrigin } from "@/lib/env-url";

const SITE_URL = resolveOrigin("NEXT_PUBLIC_SITE_URL", DEFAULT_SITE_URL);

// lastModified for the landing root comes from the per-locale messages file
// mtime — meaningful "content changed" signal, not just build time. Falls
// back to "now" if the file isn't readable at build (shouldn't happen).
// Article entries instead read `updatedAt` from the registry so a content
// edit on the same day reflects only when the contributor explicitly bumps
// the date (treats "I updated this article" as an intentional act).
function messagesMtime(locale: string): Date {
  try {
    return statSync(path.resolve(process.cwd(), `messages/${locale}.json`))
      .mtime;
  } catch {
    return new Date();
  }
}

// Reused for every URL we emit — hreflang map covers each URL locale, the
// India-cookie aliases, and x-default. India variants share their base-locale
// path (the India axis is cookie-driven, not URL-driven).
function languagesFor(pathSuffix: string): Record<string, string> {
  const alt: Record<string, string> = Object.fromEntries(
    routing.locales.map((l) => [l, `${SITE_URL}/${l}${pathSuffix}`]),
  );
  alt["en-IN"] = `${SITE_URL}/en${pathSuffix}`;
  alt["ta-IN"] = `${SITE_URL}/ta${pathSuffix}`;
  alt["x-default"] = `${SITE_URL}/${routing.defaultLocale}${pathSuffix}`;
  return alt;
}

/**
 * Public sitemap. Lists every locale variant of the landing root plus every
 * locale variant of every article in the registry, with hreflang alternates
 * so search engines and AI crawlers pick the right language per visitor.
 * Sign-in/up live on the app subdomain — not on this origin — so they're
 * omitted here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const rootEntries: MetadataRoute.Sitemap = routing.locales.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified: messagesMtime(locale),
    changeFrequency: "weekly",
    priority: 1.0,
    alternates: { languages: languagesFor("") },
  }));

  const articleEntries: MetadataRoute.Sitemap = routing.locales.flatMap(
    (locale) =>
      ARTICLES.map((article) => ({
        url: `${SITE_URL}/${locale}/articles/${article.slug}`,
        lastModified: new Date(article.updatedAt),
        // Articles change less often than the landing — `monthly` is the
        // honest signal for evergreen long-form content. Bump per-article
        // updatedAt in lib/articles.ts on substantive edits.
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: {
          languages: languagesFor(`/articles/${article.slug}`),
        },
      })),
  );

  return [...rootEntries, ...articleEntries];
}
