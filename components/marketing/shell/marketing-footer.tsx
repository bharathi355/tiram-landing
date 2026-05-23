"use client";

import { useLocale, useTranslations } from "next-intl";
import { appUrl } from "@/lib/contracts/app-url";
import { supportWhatsappUrl } from "@/lib/brand";
import { MarketingLanguageSwitcher } from "../shared/language-switcher";
import { ThemeToggle } from "../shared/theme-toggle";
import { ScrollReveal } from "./motion";

export function MarketingFooter() {
  const t = useTranslations("landing.footer");
  const tNav = useTranslations("landing.nav");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const year = new Date().getFullYear();
  const supportEmail = tCommon("supportEmail");
  const whatsappHref = supportWhatsappUrl(t("whatsappMessage"));

  return (
    <ScrollReveal
      direction="up"
      as="footer"
      className="border-t border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <p className="text-base font-semibold text-slate-900 dark:text-slate-50">
              {tCommon("appName")}
            </p>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              {t("tagline")}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {t("product")}
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href="#features"
                  className="text-slate-700 transition-colors hover:text-accent-600 dark:text-slate-300 dark:hover:text-accent-400"
                >
                  {t("linkFeatures")}
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-slate-700 transition-colors hover:text-accent-600 dark:text-slate-300 dark:hover:text-accent-400"
                >
                  {t("linkPricing")}
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-slate-700 transition-colors hover:text-accent-600 dark:text-slate-300 dark:hover:text-accent-400"
                >
                  {t("linkFaq")}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {t("resources")}
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href={`/${locale}/articles/gstr-1-vs-gstr-3b-difference`}
                  className="text-slate-700 transition-colors hover:text-accent-600 dark:text-slate-300 dark:hover:text-accent-400"
                >
                  {t("linkArticleGstr")}
                </a>
              </li>
              <li>
                <a
                  href={`/${locale}/articles/gstr-1-export-tiram`}
                  className="text-slate-700 transition-colors hover:text-accent-600 dark:text-slate-300 dark:hover:text-accent-400"
                >
                  {t("linkArticleGstr1Export")}
                </a>
              </li>
              <li>
                <a
                  href={`/${locale}/articles/counter-billing-barcode-quick-bill`}
                  className="text-slate-700 transition-colors hover:text-accent-600 dark:text-slate-300 dark:hover:text-accent-400"
                >
                  {t("linkArticleQuickBill")}
                </a>
              </li>
              <li>
                <a
                  href={`/${locale}/articles/purchase-to-insights-workflow`}
                  className="text-slate-700 transition-colors hover:text-accent-600 dark:text-slate-300 dark:hover:text-accent-400"
                >
                  {t("linkArticleWorkflow")}
                </a>
              </li>
              <li>
                <a
                  href={`/${locale}/articles/business-health-dashboard-indian-smb`}
                  className="text-slate-700 transition-colors hover:text-accent-600 dark:text-slate-300 dark:hover:text-accent-400"
                >
                  {t("linkArticleCockpit")}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {t("company")}
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href={appUrl(locale, "/sign-in")}
                  className="text-slate-700 transition-colors hover:text-accent-600 dark:text-slate-300 dark:hover:text-accent-400"
                >
                  {tNav("signIn")}
                </a>
              </li>
              <li>
                <a
                  href={appUrl(locale, "/onboarding")}
                  className="text-slate-700 transition-colors hover:text-accent-600 dark:text-slate-300 dark:hover:text-accent-400"
                >
                  {t("linkSignUp")}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {t("contact")}
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href={`mailto:${supportEmail}`}
                  className="text-slate-700 transition-colors hover:text-accent-600 dark:text-slate-300 dark:hover:text-accent-400"
                >
                  {supportEmail}
                </a>
              </li>
              <li>
                <a
                  data-testid="footer-whatsapp-cta"
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border border-emerald-500 bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm shadow-emerald-500/20 transition hover:bg-emerald-600 dark:border-emerald-400 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
                >
                  {t("linkWhatsapp")}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center dark:border-slate-800">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t("rights", { year })}
            </p>
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-200">
              {t("madeInIndia")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <MarketingLanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
