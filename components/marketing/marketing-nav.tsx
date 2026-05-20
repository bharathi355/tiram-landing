"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { appUrl } from "@/lib/app-url";
import { cn } from "@/lib/utils";
import { MarketingLanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";
import { AnimatePresence, motion } from "./motion";

// Ordered to mirror the section order on app/[locale]/page.tsx so the topbar
// reads the same way users scroll. Outcomes and Testimonials are intentionally
// omitted (no id, kept curated to a 6-item nav).
const ANCHORS = [
  { id: "how-it-works", labelKey: "howItWorks" },
  { id: "features", labelKey: "features" },
  { id: "region", labelKey: "region" },
  { id: "pricing", labelKey: "pricing" },
  { id: "why-tiram", labelKey: "whyTiram" },
  { id: "faq", labelKey: "faq" },
] as const;

export function MarketingNav() {
  const t = useTranslations("landing.nav");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors",
        scrolled
          ? "border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/80"
          : "bg-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:text-slate-900 focus:shadow dark:focus:bg-slate-900 dark:focus:text-slate-100"
      >
        {t("skipToContent")}
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href={`/${locale}`}
          className="flex items-center gap-2 text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50"
        >
          <Image
            src="/logo.png"
            alt={tCommon("logoAlt")}
            width={32}
            height={32}
            priority
            className="h-8 w-8 flex-shrink-0"
          />
          <span>{tCommon("appName")}</span>
        </a>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {ANCHORS.map((a) => (
            <a
              key={a.id}
              href={`#${a.id}`}
              className="text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50"
            >
              {t(a.labelKey)}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <MarketingLanguageSwitcher />
          <ThemeToggle />
          <a
            href={appUrl(locale, "/sign-in")}
            className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50"
          >
            {t("signIn")}
          </a>
          <a
            href={appUrl(locale, "/sign-up")}
            className="inline-flex h-9 items-center rounded-full bg-accent-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-700"
          >
            {t("startFree")}
          </a>
        </div>

        <button
          type="button"
          aria-label={t("features")}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 md:hidden"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {mobileOpen ? (
          <motion.div
            key="mobile-drawer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 md:hidden"
          >
            <div className="px-4 py-4">
              <nav className="flex flex-col gap-3" aria-label="Mobile">
                {ANCHORS.map((a, i) => (
                  <motion.a
                    key={a.id}
                    href={`#${a.id}`}
                    onClick={() => setMobileOpen(false)}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.25 }}
                    className="text-sm text-slate-700 dark:text-slate-200"
                  >
                    {t(a.labelKey)}
                  </motion.a>
                ))}
              </nav>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MarketingLanguageSwitcher />
                  <ThemeToggle />
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={appUrl(locale, "/sign-in")}
                    className="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    {t("signIn")}
                  </a>
                  <a
                    href={appUrl(locale, "/sign-up")}
                    className="inline-flex h-9 items-center rounded-full bg-accent-600 px-4 text-sm font-medium text-white"
                  >
                    {t("startFree")}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
