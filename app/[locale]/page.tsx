import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { Hero } from "@/components/marketing/hero";
import { TrustStrip } from "@/components/marketing/trust-strip";
import { Outcomes } from "@/components/marketing/outcomes";
import { Features } from "@/components/marketing/features";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { BuiltForRegion } from "@/components/marketing/built-for-region";
import { Testimonials } from "@/components/marketing/testimonials";
import { Pricing } from "@/components/marketing/pricing";
import { WhyTiram } from "@/components/marketing/why-tiram";
import { Faq } from "@/components/marketing/faq";
import { FinalCta } from "@/components/marketing/final-cta";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { JsonLd } from "@/components/marketing/json-ld";
import { BRAND_NAME, SITE_URL as DEFAULT_SITE_URL } from "@/lib/brand.server";
import { resolveOrigin } from "@/lib/env-url";

// SITE_URL prefers the env override (preview deploys, custom domains), falling
// back to the brand-derived public URL. resolveOrigin treats empty strings and
// malformed URLs as missing — otherwise `new URL(SITE_URL)` below would crash
// prerender with an opaque message.
const SITE_URL = resolveOrigin("NEXT_PUBLIC_SITE_URL", DEFAULT_SITE_URL);

// The page reads the `tiram-country` cookie in i18n/request.ts to pick India
// vs. global content. Static prerender would freeze in the global variant —
// force dynamic so each request gets server-rendered with its own cookie.
// Netlify's CDN caches the two variants separately via the `Vary` header set
// by middleware, so this is a per-cookie-value render, not per-request.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing.seo" });

  // hreflang map: every supported locale + an x-default that points to English.
  // en-IN and ta-IN re-use the same /en and /ta URLs — India is served via a
  // country cookie set in middleware, not a separate URL. This tells Google
  // and other search engines that those URLs answer India-targeted queries.
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((l) => [l, `${SITE_URL}/${l}`]),
  );
  languages["en-IN"] = `${SITE_URL}/en`;
  languages["ta-IN"] = `${SITE_URL}/ta`;
  languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}`;

  const canonical = `${SITE_URL}/${locale}`;
  const ogLocale = locale === "ta" ? "ta_IN" : "en_US";

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: BRAND_NAME,
      title: t("ogTitle"),
      description: t("ogDescription"),
      locale: ogLocale,
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("ogDescription"),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export default async function LocaleRoot({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Landing is anonymous-only. No Supabase check, no redirect. Signed-in users
  // who land here use the Sign in / Start free CTAs which route them to
  // app.<domain> where their cookie is honoured.
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <MarketingNav />
      <main id="main">
        <Hero />
        <TrustStrip />
        <HowItWorks />
        <Outcomes />
        <Features />
        <BuiltForRegion />
        <Testimonials />
        <Pricing />
        <WhyTiram />
        <Faq />
        <FinalCta />
      </main>
      <MarketingFooter />
      <JsonLd locale={locale as Locale} siteUrl={SITE_URL} />
    </div>
  );
}
