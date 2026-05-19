"use client";

import { useLocale, useTranslations } from "next-intl";
import { appUrl } from "@/lib/app-url";
import { MarketingLanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";
import { ScrollReveal } from "./motion";

export function MarketingFooter() {
  const t = useTranslations("landing.footer");
  const tNav = useTranslations("landing.nav");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const year = new Date().getFullYear();
  const supportEmail = tCommon("supportEmail");

  return (
    <ScrollReveal
      direction="up"
      as="footer"
      className="border-t border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
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
                  href={appUrl(locale, "/sign-up")}
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
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t("rights", { year })}
          </p>
          <div className="flex items-center gap-3">
            <MarketingLanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
