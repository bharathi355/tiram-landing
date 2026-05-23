import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { BRAND_NAME, SUPPORT_EMAIL } from "@/lib/brand.server";
import {
  buildArticleFaqSchema,
  buildArticleSchema,
  getArticle,
} from "@/lib/articles";

interface Props {
  locale: Locale;
  siteUrl: string;
}

/**
 * Renders structured data for AI search and traditional SEO.
 *
 * The FAQPage and HowTo entries pull from the SAME translation keys as the
 * visible sections — single source of truth — so the schema can never drift
 * out of sync with what users actually see.
 */
export async function JsonLd({ locale, siteUrl }: Props) {
  const t = await getTranslations({ locale, namespace: "landing" });
  const faqItems = t.raw("faq.items") as Array<{ q: string; a: string }>;
  const howSteps = t.raw("howItWorks.steps") as Array<{
    title: string;
    body: string;
  }>;

  const canonical = `${siteUrl}/${locale}`;

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: t("seo.orgName"),
    url: siteUrl,
    description: t("seo.orgDescription"),
    logo: `${siteUrl}/logo.png`,
    // Country-level address signals Tiram as an India-incorporated company.
    // No streetAddress/locality on purpose — we'd rather have a thin-but-true
    // schema than fake a registered office. Extend when we publish one.
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    // Tiram serves Indian businesses first (where GST/UPI depth ships) and
    // global SMBs second (configurable tax engine). Listed in priority order.
    areaServed: [
      { "@type": "Country", name: "India" },
      { "@type": "Place", name: "Worldwide" },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: SUPPORT_EMAIL,
      contactType: "customer support",
      availableLanguage: ["English", "Tamil"],
      areaServed: ["IN", "Worldwide"],
    },
  };

  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: t("seo.appName"),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, Windows, macOS",
    description: t("seo.description"),
    url: canonical,
    inLanguage: ["en", "ta-IN"],
    areaServed: "Worldwide",
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Small, medium, and enterprise businesses",
    },
    availableOnDevice: ["Desktop", "Mobile web", "Windows", "macOS"],
    offers: {
      "@type": "Offer",
      price: "249",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "249",
        priceCurrency: "INR",
        unitText: "per user per month",
      },
    },
    featureList: [
      "Tax-compliant invoicing (GST, VAT, sales tax)",
      "Multi-warehouse inventory with stock transfers",
      "Payment recording (UPI, cash, card, bank, credit)",
      "Bilingual UI — English and Tamil",
      "Browser and ESC/POS thermal printing",
      "Role-based multi-organization access",
      "Daily revenue, margin, tax, and audit reports",
      "Cloud web app and offline desktop apps (Windows, macOS)",
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND_NAME,
    alternateName: "திறம்",
    url: siteUrl,
    inLanguage: ["en", "ta-IN"],
  };

  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: t("howItWorks.heading"),
    description: t("howItWorks.intro"),
    step: howSteps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.body,
    })),
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.a,
      },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: BRAND_NAME,
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("seo.appName"),
        item: canonical,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplication) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}

interface ArticleJsonLdProps {
  locale: Locale;
  siteUrl: string;
  slug: string;
}

/**
 * Per-article JSON-LD. Emits an `Article` schema and a scoped `FAQPage` that
 * mirrors the article's visible FAQ verbatim. The schema-building logic
 * itself lives as pure functions in `lib/articles.ts` so it's unit-testable
 * without rendering; this component is the thin RSC wrapper that fetches
 * translations and stringifies the result into <script> tags.
 *
 * Returning `null` for an unknown slug is deliberate: the page route also
 * calls `notFound()` so this would never execute, but defending here keeps
 * a future contributor from triggering a stack trace by typo'ing a slug.
 */
export async function ArticleJsonLd({
  locale,
  siteUrl,
  slug,
}: ArticleJsonLdProps) {
  const article = getArticle(slug);
  if (!article) return null;

  const t = await getTranslations({ locale, namespace: `articles.${slug}` });
  const faqItems = t.raw("faq") as Array<{ q: string; a: string }>;

  const articleSchema = buildArticleSchema({
    article,
    locale,
    siteUrl,
    headline: t("h1"),
    description: t("meta.description"),
  });
  const faqSchema = buildArticleFaqSchema(faqItems);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
