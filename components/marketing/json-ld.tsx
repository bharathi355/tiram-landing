import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { BRAND_NAME, SUPPORT_EMAIL } from "@/lib/brand.server";

interface Props {
  locale: Locale;
  siteUrl: string;
}

/**
 * Renders structured data for AI search and traditional SEO.
 *
 * The FAQPage entries pull from the SAME translation keys as the visible
 * accordion in `<Faq />` — keeping them in sync (single source of truth) and
 * preventing the "schema lies about the page" anti-pattern that hurts E-E-A-T.
 */
export async function JsonLd({ locale, siteUrl }: Props) {
  const t = await getTranslations({ locale, namespace: "landing" });
  const faqItems = t.raw("faq.items") as Array<{ q: string; a: string }>;

  const canonical = `${siteUrl}/${locale}`;

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: t("seo.orgName"),
    url: siteUrl,
    description: t("seo.orgDescription"),
    logo: `${siteUrl}/icon.svg`,
    contactPoint: {
      "@type": "ContactPoint",
      email: SUPPORT_EMAIL,
      contactType: "customer support",
      availableLanguage: ["English", "Tamil"],
    },
  };

  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: t("seo.appName"),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: t("seo.description"),
    url: canonical,
    inLanguage: ["en-IN", "ta-IN"],
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
      "GST invoicing",
      "Multi-warehouse inventory",
      "UPI payment recording",
      "Tamil and English UI",
      "Browser and thermal printing",
      "Role-based multi-org access",
      "Daily revenue and margin reports",
    ],
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
        // JSON.stringify produces strict JSON — safe to inline.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplication) }}
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
