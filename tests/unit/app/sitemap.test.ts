/**
 * Tests the sitemap enumerates the landing roots AND every article in the
 * registry across all URL locales, each with the right hreflang alternates
 * (including `x-default`). The check is structural — if a new article is
 * added to `lib/articles.ts` and the sitemap omits it, this test fails.
 *
 * Article URLs ship with `lastModified = registry.updatedAt` rather than the
 * messages-file mtime (the landing root uses mtime). Bumping `updatedAt` is
 * an intentional "I updated this article" act, which is why we test it
 * specifically — accidental drift would silently advertise stale freshness.
 */
import { describe, expect, it, vi } from "vitest";

// `lib/brand.server.ts` imports the `server-only` marker, which is a Next.js
// build-time guard with no Vitest equivalent. Short-circuit the import to
// the plain `lib/brand.ts` (same values, no marker) so Vitest can load the
// sitemap module's transitive dependency chain.
vi.mock("@/lib/brand.server", () => import("@/lib/brand"));

import sitemap from "@/app/sitemap";
import { ARTICLES } from "@/lib/articles";

// Mirror the default in `lib/brand.ts`. resolveOrigin falls back to this when
// NEXT_PUBLIC_SITE_URL isn't set in the test process — which it isn't.
const SITE_URL = "https://tiram.co.in";

describe("sitemap", () => {
  const entries = sitemap();

  it("emits the two landing-root entries (one per URL locale)", () => {
    const roots = entries.filter(
      (e) => e.url === `${SITE_URL}/en` || e.url === `${SITE_URL}/ta`,
    );
    expect(roots).toHaveLength(2);
  });

  it("emits one entry per article × URL locale", () => {
    // 2 articles × 2 locales = 4 article entries.
    const articleEntries = entries.filter((e) =>
      e.url.includes("/articles/"),
    );
    expect(articleEntries).toHaveLength(ARTICLES.length * 2);
  });

  it("every article URL appears at /{locale}/articles/{slug} for both locales", () => {
    for (const a of ARTICLES) {
      const enUrl = `${SITE_URL}/en/articles/${a.slug}`;
      const taUrl = `${SITE_URL}/ta/articles/${a.slug}`;
      expect(entries.map((e) => e.url)).toContain(enUrl);
      expect(entries.map((e) => e.url)).toContain(taUrl);
    }
  });

  it("every entry declares hreflang for en, ta, en-IN, ta-IN, and x-default", () => {
    for (const e of entries) {
      const langs = e.alternates?.languages ?? {};
      expect(Object.keys(langs)).toEqual(
        expect.arrayContaining(["en", "ta", "en-IN", "ta-IN", "x-default"]),
      );
    }
  });

  it("hreflang x-default points to the English URL of the same resource", () => {
    for (const e of entries) {
      const langs = e.alternates?.languages ?? {};
      const xDefault = langs["x-default"];
      const enUrl = langs.en;
      expect(xDefault).toBe(enUrl);
    }
  });

  it("article entries use the registry's updatedAt as lastModified (not build time)", () => {
    for (const a of ARTICLES) {
      const enUrl = `${SITE_URL}/en/articles/${a.slug}`;
      const entry = entries.find((e) => e.url === enUrl);
      expect(entry).toBeDefined();
      const lm = entry!.lastModified;
      // lastModified is typed as Date | string | undefined; we set Date.
      expect(lm).toBeInstanceOf(Date);
      expect((lm as Date).toISOString().slice(0, 10)).toBe(a.updatedAt);
    }
  });
});
