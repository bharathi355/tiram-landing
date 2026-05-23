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
import { MarketingNav } from "../shell/marketing-nav";
import { MarketingFooter } from "../shell/marketing-footer";
import { ArticleProse } from "./article-prose";
import { MiniMd } from "@/lib/mini-md";
import { appUrl } from "@/lib/contracts/app-url";

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
  const shellT = useTranslations("articleShell");
  const sections = t.raw("sections") as Section[];
  const geoCallouts = t.raw("geoCallouts") as QA[];
  const faq = t.raw("faq") as QA[];
  // Optional structured comparison table — Article A uses it; Article B
  // doesn't. Wrapped in try because `t.raw` throws on missing keys.
  let comparison: ComparisonTable | null = null;
  if (t.has("comparisonTable")) {
    const rawComparison = t.raw("comparisonTable") as
      | ComparisonTable
      | undefined;
    comparison = rawComparison?.headers?.length && rawComparison?.rows?.length
      ? rawComparison
      : null;
  }
  let related: RelatedLink[] = [];
  try {
    related = t.raw("related") as RelatedLink[];
  } catch {
    related = [];
  }
  const onboardingHref = appUrl(locale, "/onboarding");
  const workflowSteps = [
    shellT("workflowSteps.purchase"),
    shellT("workflowSteps.billing"),
    shellT("workflowSteps.insights"),
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <MarketingNav />
      <main
        id="main"
        className="mx-auto max-w-3xl px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:px-8"
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

        <section className="relative left-1/2 mt-6 w-screen -translate-x-1/2 overflow-hidden border-y border-slate-200 bg-[radial-gradient(circle_at_20%_20%,rgba(20,184,166,0.16),transparent_34%),linear-gradient(135deg,#f8fafc_0%,#ecfeff_48%,#fff7ed_100%)] dark:border-slate-800 dark:bg-[radial-gradient(circle_at_20%_20%,rgba(20,184,166,0.16),transparent_34%),linear-gradient(135deg,#020617_0%,#0f172a_52%,#172554_100%)]">
          <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.75fr)] lg:px-8">
            <div>
              <p className="inline-flex rounded-full border border-teal-200 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700 shadow-sm dark:border-teal-500/30 dark:bg-slate-900/70 dark:text-teal-200">
                {shellT("heroKicker")}
              </p>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl dark:text-slate-50">
                {t("h1")}
              </h1>
              <div className="mt-7 rounded-3xl border border-white/80 bg-white/85 p-6 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/80 dark:shadow-black/20">
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
                  {t("quickAnswerLabel")}
                </p>
                <p className="mt-3 text-lg font-medium leading-8 text-slate-800 dark:text-slate-100">
                  {t("lede")}
                </p>
              </div>
            </div>

            <aside
              aria-label={shellT("valueLabel")}
              className="rounded-3xl border border-slate-200/80 bg-slate-950 p-5 text-white shadow-2xl shadow-slate-900/20 dark:border-slate-700 dark:bg-white dark:text-slate-950"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-300 dark:text-teal-700">
                {shellT("valueLabel")}
              </p>
              <p className="mt-3 text-xl font-semibold leading-7">
                {shellT("value")}
              </p>
              <ul className="mt-6 grid gap-3" aria-label={shellT("stepsLabel")}>
                {workflowSteps.map((step, index) => (
                  <li
                    key={step}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium dark:border-slate-200 dark:bg-slate-50"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-400 text-xs font-bold text-slate-950 dark:bg-teal-100 dark:text-teal-800">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        <section
          aria-labelledby="article-inline-cta"
          className="mt-8 rounded-3xl border border-teal-200 bg-teal-50/80 p-5 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-6 dark:border-teal-900/50 dark:bg-teal-950/25"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
              {shellT("inlineCtaEyebrow")}
            </p>
            <h2
              id="article-inline-cta"
              className="mt-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-50"
            >
              {t("cta.heading")}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
              {t("cta.body")}
            </p>
          </div>
          <div className="mt-5 shrink-0 sm:mt-0 sm:text-right">
            <a
              href={onboardingHref}
              data-testid="article-cta-primary"
              className="inline-flex items-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:bg-teal-300 dark:text-slate-950 dark:hover:bg-teal-200 dark:focus:ring-offset-slate-950"
            >
              {shellT("inlineCtaButton")}
            </a>
            <p className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              {shellT("inlineCtaTrust")}
            </p>
          </div>
        </section>

        {/* Comparison table renders BEFORE the prose sections so the
            scannable executive summary sits high on the page — AI engines
            and humans both reward that flow (answer → summary table → deep
            prose). Optional: omit `comparisonTable` from an article's i18n
            block and this section won't render. */}
        {comparison ? (
          <section
            aria-labelledby="comparison"
            className="relative left-1/2 mt-12 w-screen -translate-x-1/2 px-4 sm:px-6 lg:px-8"
          >
            <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/5 sm:p-6 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-black/20">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
                    {shellT("comparisonEyebrow")}
                  </p>
                  <h2
                    id="comparison"
                    className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50"
                  >
                    {t("comparisonHeading")}
                  </h2>
                </div>
              </div>
              <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                  {comparison.caption ? (
                    <caption className="caption-top bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-600 dark:bg-slate-950/60 dark:text-slate-400">
                      {comparison.caption}
                    </caption>
                  ) : null}
                  <thead>
                    <tr className="bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950">
                      {comparison.headers.map((h, i) => (
                        <th
                          key={i}
                          scope="col"
                          className="px-4 py-3 font-semibold first:rounded-tl-2xl last:rounded-tr-2xl"
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
                        className="border-b border-slate-100 odd:bg-teal-50/45 last:border-b-0 dark:border-slate-800/80 dark:odd:bg-teal-950/20"
                      >
                        {row.map((cell, j) => (
                          <td
                            key={j}
                            className="px-4 py-3 align-top text-slate-700 first:font-medium first:text-slate-950 dark:text-slate-300 dark:first:text-slate-100"
                          >
                            <MiniMd source={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        ) : null}

        <div className="mt-12 space-y-6">
          {sections.map((s, i) => (
            <section
              key={i}
              aria-labelledby={`section-${i}`}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/45 dark:shadow-black/10"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-sm font-bold text-teal-800 dark:bg-teal-900/50 dark:text-teal-200">
                  {i + 1}
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {shellT("sectionEyebrow")}
                  </p>
                  <h2
                    id={`section-${i}`}
                    className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50"
                  >
                    {s.heading}
                  </h2>
                </div>
              </div>
              <ArticleProse className="mt-5">
                <MiniMd source={s.body} />
              </ArticleProse>
            </section>
          ))}
        </div>

        {geoCallouts && geoCallouts.length > 0 ? (
          <section aria-labelledby="quick-answers" className="mt-16">
            <h2
              id="quick-answers"
              className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50"
            >
              {t("quickAnswersHeading")}
            </h2>
            <dl className="mt-6 grid gap-4">
              {geoCallouts.map((g, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-900/40"
                >
                  <dt className="text-base font-semibold text-slate-950 dark:text-slate-100">
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
            className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50"
          >
            {t("faqHeading")}
          </h2>
          <dl className="mt-6 grid gap-4">
            {faq.map((it, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/35"
              >
                <dt className="text-base font-semibold text-slate-950 dark:text-slate-100">
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
              className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50"
            >
              {t("relatedHeading")}
            </h2>
            <ul className="mt-6 grid gap-3">
              {related.map((r, i) => (
                <li key={i}>
                  <Link
                    href={`/${locale}/articles/${r.slug}`}
                    className="block rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-base font-medium text-accent-700 underline-offset-2 transition-colors hover:border-accent-200 hover:bg-accent-50 hover:text-accent-600 hover:underline dark:border-slate-800 dark:bg-slate-900/35 dark:text-accent-300 dark:hover:border-accent-900/50 dark:hover:bg-accent-950/30"
                  >
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="mt-16 rounded-3xl border border-accent-200 bg-accent-50/70 p-8 dark:border-accent-900/40 dark:bg-accent-950/30">
          <p className="text-lg font-semibold text-slate-950 dark:text-slate-50">
            {t("cta.heading")}
          </p>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
            {t("cta.body")}
          </p>
          <a
            href={onboardingHref}
            data-testid="article-cta-final"
            className="mt-6 inline-flex items-center rounded-xl bg-accent-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
          >
            {t("cta.button")}
          </a>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
