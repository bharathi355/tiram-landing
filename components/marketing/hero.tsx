"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  ArrowRight,
  Sparkles,
  Receipt,
  CheckCircle2,
} from "lucide-react";
import { appUrl } from "@/lib/app-url";
import {
  StaggerContainer,
  StaggerItem,
  ScrollReveal,
  motion,
} from "./motion";

export function Hero() {
  const t = useTranslations("landing.hero");
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24">
      {/* Soft accent gradient backdrop — restrained, not gimmicky */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-accent-50 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950"
      />
      {/* Slow-pulsing accent halo behind the hero content */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-accent-200/40 blur-3xl dark:bg-accent-900/20"
        animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <StaggerContainer
          className="flex flex-col justify-center"
          stagger={0.09}
          amount={0.1}
        >
          <StaggerItem>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-accent-200 bg-accent-50 px-3 py-1 text-xs font-medium text-accent-700 dark:border-accent-800/60 dark:bg-accent-900/30 dark:text-accent-300">
              <Sparkles className="h-3 w-3" aria-hidden />
              {t("eyebrow")}
            </span>
          </StaggerItem>
          <StaggerItem>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-slate-50">
              {t("h1")}
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              {t("subhead")}
            </p>
          </StaggerItem>
          <StaggerItem>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={appUrl(locale, "/sign-up")}
                className="group inline-flex h-11 items-center gap-2 rounded-full bg-accent-600 px-6 text-sm font-medium text-white shadow-lg shadow-accent-600/25 transition-all hover:scale-[1.02] hover:bg-accent-700 hover:shadow-xl hover:shadow-accent-600/30"
              >
                {t("ctaPrimary")}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex h-11 items-center rounded-full border border-slate-300 bg-white px-6 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                {t("ctaSecondary")}
              </a>
            </div>
          </StaggerItem>
          <StaggerItem>
            <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
              {t("microTrust")}
            </p>
          </StaggerItem>
        </StaggerContainer>

        {/* Right column — invoice mock built in HTML/SVG so it themes naturally
            and stays cheap to render. Locale-aware copy via the t() calls. */}
        <ScrollReveal
          direction="left"
          delay={0.25}
          className="relative hidden lg:block"
        >
          <InvoiceMock />
        </ScrollReveal>
      </div>

      {/* Show a smaller mock below the hero copy on smaller screens */}
      <ScrollReveal
        direction="up"
        delay={0.15}
        className="mt-12 px-4 sm:px-6 lg:hidden"
      >
        <InvoiceMock />
      </ScrollReveal>
    </section>
  );
}

function InvoiceMock() {
  const t = useTranslations("landing.hero");
  return (
    <div className="motion-safe:animate-[float_8s_ease-in-out_infinite] mx-auto w-full max-w-sm rotate-[-1.5deg] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-900/10 dark:border-slate-700/60 dark:bg-slate-900 dark:shadow-black/40">
      {/* Accent top bar */}
      <div className="h-1 w-full bg-gradient-to-r from-accent-500 via-accent-400 to-emerald-400" />

      <div className="px-5 pt-5 pb-5">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-accent-50 dark:bg-accent-900/30">
              <Receipt className="h-3.5 w-3.5 text-accent-600 dark:text-accent-400" aria-hidden />
            </div>
            <span className="text-xs font-medium text-slate-900 dark:text-slate-100">
              #INV-2024-001
            </span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            <CheckCircle2 className="h-2.5 w-2.5" aria-hidden />
            {t("mockPaidStatus")}
          </span>
        </div>

        {/* Line items — minimal, spacious */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between rounded-lg bg-slate-50/80 px-3 py-2 dark:bg-slate-800/60">
            <span className="text-xs text-slate-600 dark:text-slate-300">{t("mockItem1")}</span>
            <span className="text-xs font-medium tabular-nums text-slate-900 dark:text-slate-100">₹3,800</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-slate-50/80 px-3 py-2 dark:bg-slate-800/60">
            <span className="text-xs text-slate-600 dark:text-slate-300">{t("mockItem2")}</span>
            <span className="text-xs font-medium tabular-nums text-slate-900 dark:text-slate-100">₹12,500</span>
          </div>
        </div>

        {/* Total */}
        <div className="mt-4 flex items-baseline justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {t("mockTotalLabel")}
          </span>
          <span className="text-lg font-semibold tabular-nums text-slate-900 dark:text-slate-50">
            ₹16,300
          </span>
        </div>

        {/* Minimal UPI indicator */}
        <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500">
          <UpiIcon />
          <span>UPI</span>
          <span className="mx-1">·</span>
          <span>GST</span>
          <span className="mx-1">·</span>
          <span>Tamil + EN</span>
        </div>
      </div>
    </div>
  );
}

function UpiIcon() {
  return (
    <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" aria-hidden>
      <path
        d="M3 1l3 10M6 1l3 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
