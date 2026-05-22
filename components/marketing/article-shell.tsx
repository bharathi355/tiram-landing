"use client";

// Article shell — renders the visible content of a single long-form article.
// Reads from the `articles.<slug>` i18n namespace; structure parity across
// locales is enforced by scripts/check-i18n.mjs at build time.
//
// This is a client component because the existing test framework
// (renderWithProviders) wraps in NextIntlClientProvider, and a client shell
// composes naturally with that. The JSON-LD emitter and metadata stay on the
// server route. The trade-off — slightly larger client bundle for the
// article text — is acceptable for two articles; revisit if total article
// payload becomes large.

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { MarketingNav } from "./marketing-nav";
import { MarketingFooter } from "./marketing-footer";
import { ArticleProse } from "./article-prose";
import { MiniMd } from "@/lib/mini-md";
import { appUrl } from "@/lib/app-url";

interface Section {
  heading: string;
  body: string;
}
interface QA {
  q: string;
  a: string;
}
interface ComparisonTable {
  caption?: string;
  headers: string[];
  // Rows are a 2-D array of plain cells. Markdown inline (**bold**, _em_) is
  // honoured inside cells via MiniMd-flavoured rendering, but kept light to
  // avoid pulling MiniMd's block parser into a table cell.
  rows: string[][];
}
interface RelatedLink {
  slug: string;
  label: string;
}

interface Props {
  slug: string;
}

export function ArticleShell({ slug }: Props) {
  const locale = useLocale();
  const t = useTranslations(`articles.${slug}`);
  const sections = t.raw("sections") as Section[];
  const geoCallouts = t.raw("geoCallouts") as QA[];
  const faq = t.raw("faq") as QA[];
  // Optional structured comparison table — Article A uses it; Article B
  // doesn't. Wrapped in try because `t.raw` throws on missing keys.
  let comparison: ComparisonTable | null = null;
  try {
    comparison = t.raw("comparisonTable") as ComparisonTable;
  } catch {
    comparison = null;
  }
  let related: RelatedLink[] = [];
  try {
    related = t.raw("related") as RelatedLink[];
  } catch {
    related = [];
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <MarketingNav />
      <main
        id="main"
        className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
      >
        <nav
          aria-label="Breadcrumb"
          className="text-sm text-slate-500 dark:text-slate-400"
        >
          <Link
            href={`/${locale}`}
            className="hover:text-accent-600 dark:hover:text-accent-400"
          >
            {t("breadcrumbHome")}
          </Link>
          <span className="mx-2" aria-hidden>
            /
          </span>
          <span className="text-slate-700 dark:text-slate-300">
            {t("breadcrumbCurrent")}
          </span>
        </nav>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
          {t("h1")}
        </h1>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-6 dark:border-slate-800 dark:bg-slate-900/40">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t("quickAnswerLabel")}
          </p>
          <p className="mt-2 text-base font-medium leading-relaxed text-slate-800 dark:text-slate-200">
            {t("lede")}
          </p>
        </div>

        {/* Comparison table renders BEFORE the prose sections so the
            scannable executive summary sits high on the page — AI engines
            and humans both reward that flow (answer → summary table → deep
            prose). Optional: omit `comparisonTable` from an article's i18n
            block and this section won't render. */}
        {comparison ? (
          <section
            aria-labelledby="comparison"
            className="mt-10 overflow-x-auto"
          >
            <h2
              id="comparison"
              className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
            >
              {t("comparisonHeading")}
            </h2>
            <table className="mt-6 w-full border-collapse text-left text-sm">
              {comparison.caption ? (
                <caption className="mb-3 text-left text-sm text-slate-600 dark:text-slate-400">
                  {comparison.caption}
                </caption>
              ) : null}
              <thead>
                <tr>
                  {comparison.headers.map((h, i) => (
                    <th
                      key={i}
                      scope="col"
                      className="border-b border-slate-200 px-3 py-2 font-semibold text-slate-900 dark:border-slate-800 dark:text-slate-100"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.rows.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-100 last:border-b-0 dark:border-slate-800/60"
                  >
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className="px-3 py-2 align-top text-slate-700 dark:text-slate-300"
                      >
                        <MiniMd source={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ) : null}

        <div className="mt-12 space-y-12">
          {sections.map((s, i) => (
            <section key={i} aria-labelledby={`section-${i}`}>
              <h2
                id={`section-${i}`}
                className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
              >
                {s.heading}
              </h2>
              <ArticleProse className="mt-4">
                <MiniMd source={s.body} />
              </ArticleProse>
            </section>
          ))}
        </div>

        {geoCallouts && geoCallouts.length > 0 ? (
          <section aria-labelledby="quick-answers" className="mt-16">
            <h2
              id="quick-answers"
              className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
            >
              {t("quickAnswersHeading")}
            </h2>
            <dl className="mt-6 space-y-6">
              {geoCallouts.map((g, i) => (
                <div key={i}>
                  <dt className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    {g.q}
                  </dt>
                  <dd className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-300">
                    {g.a}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        <section aria-labelledby="faq" className="mt-16">
          <h2
            id="faq"
            className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
          >
            {t("faqHeading")}
          </h2>
          <dl className="mt-6 space-y-6">
            {faq.map((it, i) => (
              <div key={i}>
                <dt className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {it.q}
                </dt>
                <dd className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {it.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {related && related.length > 0 ? (
          <section aria-labelledby="related" className="mt-16">
            <h2
              id="related"
              className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
            >
              {t("relatedHeading")}
            </h2>
            <ul className="mt-6 space-y-2">
              {related.map((r, i) => (
                <li key={i}>
                  <Link
                    href={`/${locale}/articles/${r.slug}`}
                    className="text-base font-medium text-accent-600 underline-offset-2 hover:text-accent-500 hover:underline dark:text-accent-400"
                  >
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="mt-16 rounded-2xl border border-accent-200 bg-accent-50/60 p-8 dark:border-accent-900/40 dark:bg-accent-950/30">
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            {t("cta.heading")}
          </p>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
            {t("cta.body")}
          </p>
          <a
            href={appUrl(locale, "/onboarding")}
            data-testid="article-cta-primary"
            className="mt-6 inline-flex items-center rounded-xl bg-accent-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-500"
          >
            {t("cta.button")}
          </a>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
