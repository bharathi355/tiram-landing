// Dynamic route for long-form SEO/GEO articles. One file serves every entry
// in `lib/articles.ts`. Adding a new article = (1) registry entry + (2) i18n
// namespace under `articles.<slug>` in messages/{en,en-IN,ta,ta-IN}.json.
//
// generateStaticParams is declared so Next can enumerate the matrix of
// (locale × slug) at build time. The parent layout already sets
// `dynamic = "force-dynamic"` (the country cookie needs per-request render),
// so generateStaticParams effectively just narrows TypeScript and tells
// crawlers which params are valid.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { ArticleShell } from "@/components/marketing/article/article-shell";
import { ArticleJsonLd } from "@/components/marketing/shared/json-ld";
import { ARTICLES, getArticle } from "@/lib/articles";
import { BRAND_NAME, SITE_URL as DEFAULT_SITE_URL } from "@/lib/brand.server";
import { resolveOrigin } from "@/lib/env-url";

const SITE_URL = resolveOrigin("NEXT_PUBLIC_SITE_URL", DEFAULT_SITE_URL);

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    ARTICLES.map((a) => ({ locale, slug: a.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) return {};
  if (!getArticle(slug)) return {};

  const t = await getTranslations({ locale, namespace: `articles.${slug}` });

  // hreflang map mirrors the root [locale]/page.tsx pattern — every URL
  // locale + en-IN/ta-IN aliases + x-default. India variants share their
  // base-locale URL because the India axis is cookie-driven, not URL-driven.
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((l) => [l, `${SITE_URL}/${l}/articles/${slug}`]),
  );
  languages["en-IN"] = `${SITE_URL}/en/articles/${slug}`;
  languages["ta-IN"] = `${SITE_URL}/ta/articles/${slug}`;
  languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}/articles/${slug}`;

  const canonical = `${SITE_URL}/${locale}/articles/${slug}`;
  const ogLocale = locale === "ta" ? "ta_IN" : "en_US";
  const article = getArticle(slug)!;

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    keywords: t("meta.keywords"),
    metadataBase: new URL(SITE_URL),
    alternates: { canonical, languages },
    openGraph: {
      type: "article",
      url: canonical,
      siteName: BRAND_NAME,
      title: t("meta.ogTitle"),
      description: t("meta.ogDescription"),
      locale: ogLocale,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: t("meta.ogTitle"),
      description: t("meta.ogDescription"),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) notFound();
  if (!getArticle(slug)) notFound();
  setRequestLocale(locale);

  return (
    <>
      <ArticleShell slug={slug} />
      <ArticleJsonLd locale={locale as Locale} siteUrl={SITE_URL} slug={slug} />
    </>
  );
}
