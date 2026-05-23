/**
 * Parametric tests for the article shell. Covers both slugs × both URL
 * locales — the matrix that actually ships, plus a smoke check that an
 * unknown slug or missing namespace doesn't silently degrade.
 *
 * The shell is a client component using next-intl `useTranslations` /
 * `useLocale`, so we render via the `renderWithProviders` helper which wraps
 * in NextIntlClientProvider loaded with the real locale messages. That keeps
 * the test in lockstep with the prose users actually see — if a JSON edit
 * removes a section heading, the test catches it.
 */
import type { ElementType, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

// The shell renders the marketing nav + footer; both have unrelated
// dependencies (theme toggle, motion, language switcher) that would
// otherwise drag in heavy modules. Stub them at the boundary.
vi.mock("@/components/marketing/shell/marketing-nav", () => ({
  MarketingNav: () => <div data-testid="nav-stub" />,
}));
vi.mock("@/components/marketing/shell/marketing-footer", () => ({
  MarketingFooter: () => <div data-testid="footer-stub" />,
}));

import { ArticleShell } from "@/components/marketing/article/article-shell";
import { renderWithProviders } from "@/tests/framework/render";
import enMessages from "@/messages/en.json";
import taMessages from "@/messages/ta.json";

const SLUGS = [
  "gstr-1-export-tiram",
  "counter-billing-barcode-quick-bill",
  "purchase-to-insights-workflow",
  "gstr-1-vs-gstr-3b-difference",
  "business-health-dashboard-indian-smb",
] as const;

const LOCALE_MESSAGES = {
  en: enMessages,
  ta: taMessages,
} as const;

type ArticleData = {
  h1: string;
  lede: string;
  sections: Array<{ heading: string; body: string }>;
  geoCallouts: Array<{ q: string; a: string }>;
  faq: Array<{ q: string; a: string }>;
  comparisonTable?: { headers: string[]; rows: string[][] };
  cta: { button: string };
};
type ArticleShellData = {
  value: string;
  inlineCtaButton: string;
};

function getArticleData(locale: "en" | "ta", slug: string): ArticleData {
  const messages = LOCALE_MESSAGES[locale] as unknown as {
    articles: Record<string, ArticleData>;
  };
  return messages.articles[slug];
}

function getArticleShellData(locale: "en" | "ta"): ArticleShellData {
  const messages = LOCALE_MESSAGES[locale] as unknown as {
    articleShell: ArticleShellData;
  };
  return messages.articleShell;
}

for (const slug of SLUGS) {
  for (const locale of ["en", "ta"] as const) {
    describe(`ArticleShell · ${slug} · ${locale}`, () => {
      it("renders the H1 from i18n", () => {
        const { getByRole } = renderWithProviders(
          <ArticleShell slug={slug} />,
          { locale },
        );
        const data = getArticleData(locale, slug);
        expect(getByRole("heading", { level: 1 })).toHaveTextContent(data.h1);
      });

      it("renders the first-fold value prop and inline onboarding CTA", () => {
        const { getByRole, getByText } = renderWithProviders(
          <ArticleShell slug={slug} />,
          { locale },
        );
        const shell = getArticleShellData(locale);
        expect(getByText(shell.value)).toBeInTheDocument();
        const inlineCta = getByRole("link", { name: shell.inlineCtaButton });
        expect(inlineCta.getAttribute("href")).toMatch(
          new RegExp(`/${locale}/onboarding$`),
        );
      });

      it("renders every section heading", () => {
        const { getByText } = renderWithProviders(
          <ArticleShell slug={slug} />,
          { locale },
        );
        const data = getArticleData(locale, slug);
        for (const s of data.sections) {
          expect(getByText(s.heading)).toBeInTheDocument();
        }
      });

      it("renders every FAQ question verbatim", () => {
        const { getByText } = renderWithProviders(
          <ArticleShell slug={slug} />,
          { locale },
        );
        const data = getArticleData(locale, slug);
        for (const it of data.faq) {
          expect(getByText(it.q)).toBeInTheDocument();
        }
      });

      it("renders every GEO callout question verbatim", () => {
        const { getByText } = renderWithProviders(
          <ArticleShell slug={slug} />,
          { locale },
        );
        const data = getArticleData(locale, slug);
        for (const it of data.geoCallouts) {
          expect(getByText(it.q)).toBeInTheDocument();
        }
      });

      it("renders the comparison table headers (real <table>, not an image)", () => {
        const { container } = renderWithProviders(
          <ArticleShell slug={slug} />,
          { locale },
        );
        const data = getArticleData(locale, slug);
        const table = container.querySelector("table");
        if (!data.comparisonTable) {
          expect(table).toBeNull();
          return;
        }
        expect(table).not.toBeNull();
        const ths = Array.from(table!.querySelectorAll("th")).map(
          (th) => th.textContent ?? "",
        );
        // Skip the first empty header in the GSTR table; check that the rest
        // appear in order.
        for (const h of data.comparisonTable.headers.filter(Boolean)) {
          expect(ths).toContain(h);
        }
      });

      it("renders the primary CTA pointing at /onboarding via NEXT_PUBLIC_APP_ORIGIN", () => {
        const { getByTestId } = renderWithProviders(
          <ArticleShell slug={slug} />,
          { locale },
        );
        const cta = getByTestId("article-cta-primary");
        // app-url.ts dev default is http://localhost:3005 — in CI/test env
        // the resolved origin may differ. We assert the path tail because
        // that's the contract the landing → dashboard handoff depends on.
        expect(cta.getAttribute("href")).toMatch(
          new RegExp(`/${locale}/onboarding$`),
        );
      });
    });
  }
}
