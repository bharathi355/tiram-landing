"use client";

import { useMemo, useState, useId } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Check, Minus, Plus } from "lucide-react";
import { appUrl } from "@/lib/app-url";
import { ScrollReveal, motion } from "./shell/motion";

// Source of truth lives in the Django Plan row (services/web/apps/billing/models.py).
// Mirrored here for the marketing surface so the landing page renders without a
// backend round-trip; the checkout flow itself always re-reads from the API.
const MONTHLY_PER_SEAT_INR = 249;
const ANNUAL_DISCOUNT_MONTHS = 2;
const ANNUAL_MONTHS_CHARGED = 12 - ANNUAL_DISCOUNT_MONTHS;
// 2 months waived out of 12 → 16.66%. Rendered as "up to 17%".
const SAVINGS_PCT = Math.round((ANNUAL_DISCOUNT_MONTHS / 12) * 100);

const MIN_SEATS = 1;
const MAX_SEATS = 50;

// Contact channel for the offline desktop edition. mailto: keeps it
// dependency-free; switch to a WhatsApp deep-link (https://wa.me/<number>)
// once the support phone number is locked in.
const DESKTOP_CONTACT_HREF =
  "mailto:tiram.business@gmail.com?subject=Tiram%20Desktop%20edition%20enquiry&body=Hi%2C%20I%27d%20like%20to%20learn%20more%20about%20the%20offline%20desktop%20edition.";

type Cycle = "monthly" | "annual";

function inr(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function Pricing() {
  const t = useTranslations("landing.pricing");
  const locale = useLocale();
  const [cycle, setCycle] = useState<Cycle>("annual");
  const [seats, setSeats] = useState(1);
  const stepperId = useId();

  const totals = useMemo(() => {
    const perSeatMonthly = MONTHLY_PER_SEAT_INR;
    const perSeatAnnual = MONTHLY_PER_SEAT_INR * ANNUAL_MONTHS_CHARGED;
    const monthlyTotal = perSeatMonthly * seats;
    const annualTotal = perSeatAnnual * seats;
    const annualListTotal = MONTHLY_PER_SEAT_INR * 12 * seats;
    return {
      now: cycle === "annual" ? annualTotal : monthlyTotal,
      original: cycle === "annual" ? annualListTotal : null,
      perSeatPerCycle: cycle === "annual" ? perSeatAnnual : perSeatMonthly,
      cycleSuffix:
        cycle === "annual"
          ? t("standard.totalSuffixAnnual")
          : t("standard.totalSuffixMonthly"),
    };
  }, [cycle, seats, t]);

  const seatUnitLabel = seats === 1 ? t("seats.unit") : t("seats.units");
  const features = t.raw("standard.features") as string[];
  const enterpriseFeatures = t.raw("enterprise.features") as string[];

  return (
    <section
      id="pricing"
      className="border-t border-slate-200 py-20 sm:py-28 dark:border-slate-800"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
            {t("heading")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            {t("intro")}
          </p>
        </ScrollReveal>

        {/* Cycle toggle — savings hint lives inline on the Yearly pill as a
            permanent green badge, so the affordance is always visible without
            a separate arrow / sub-text. */}
        <ScrollReveal
          direction="up"
          delay={0.05}
          className="mt-10 flex justify-center"
        >
          <div
            role="radiogroup"
            aria-label={t("billing.label")}
            className="relative inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <CycleButton
              checked={cycle === "monthly"}
              label={t("billing.monthly")}
              onSelect={() => setCycle("monthly")}
            />
            <CycleButton
              checked={cycle === "annual"}
              label={t("billing.annual")}
              badge={t("savings.badge", { pct: SAVINGS_PCT })}
              onSelect={() => setCycle("annual")}
            />
          </div>
        </ScrollReveal>

        {/* Plan grid — Standard + Enterprise, equal weight */}
        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2">
          {/* Standard */}
          <ScrollReveal direction="up" delay={0.1}>
            <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-accent-500 bg-white shadow-sm dark:border-accent-500/70 dark:bg-slate-900">
              <span
                aria-hidden
                className="absolute right-5 top-5 inline-flex items-center rounded-full bg-accent-600 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm"
              >
                {t("standard.popular")}
              </span>

              <div className="flex-1 p-6">
                <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                  {t("standard.name")}
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {t("standard.tagline")}
                </p>

                {/* Per-seat price — strikethrough list price on annual. */}
                <div className="mt-5">
                  <div className="flex items-baseline gap-2">
                    {cycle === "annual" ? (
                      <span
                        className="text-base text-slate-400 line-through decoration-2 dark:text-slate-500"
                        aria-label={t("standard.originalPriceA11y", {
                          price: inr(MONTHLY_PER_SEAT_INR * 12),
                        })}
                      >
                        {inr(MONTHLY_PER_SEAT_INR * 12)}
                      </span>
                    ) : null}
                    <span className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                      {inr(totals.perSeatPerCycle)}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {cycle === "annual"
                        ? t("standard.perUserPerYear")
                        : t("standard.perUserPerMonth")}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {cycle === "annual"
                      ? t("standard.billedAnnually")
                      : t("standard.cancelAnytime")}
                  </p>
                </div>

                {/* Inline seat stepper */}
                <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-800/50">
                  <label
                    htmlFor={stepperId}
                    className="text-xs font-medium text-slate-600 dark:text-slate-300"
                  >
                    {t("seats.label")}
                  </label>
                  <div
                    id={stepperId}
                    className="flex items-center gap-1"
                    role="group"
                    aria-label={t("seats.label")}
                  >
                    <button
                      type="button"
                      onClick={() => setSeats((s) => Math.max(MIN_SEATS, s - 1))}
                      disabled={seats <= MIN_SEATS}
                      aria-label={t("seats.decrease")}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <Minus className="h-3.5 w-3.5" aria-hidden />
                    </button>
                    <span
                      className="min-w-[4.5rem] text-center text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-50"
                      aria-live="polite"
                    >
                      {seats} {seatUnitLabel}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSeats((s) => Math.min(MAX_SEATS, s + 1))}
                      disabled={seats >= MAX_SEATS}
                      aria-label={t("seats.increase")}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </div>
                </div>

                {/* Live total */}
                <div
                  aria-live="polite"
                  className="mt-3 flex items-baseline justify-between text-sm"
                >
                  <span className="text-slate-500 dark:text-slate-400">
                    {t("standard.totalLabel")}
                  </span>
                  <span className="flex items-baseline gap-2">
                    {totals.original !== null ? (
                      <span className="text-xs text-slate-400 line-through dark:text-slate-500">
                        {inr(totals.original)}
                      </span>
                    ) : null}
                    <span className="text-base font-semibold tabular-nums text-slate-900 dark:text-slate-50">
                      {inr(totals.now)}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {totals.cycleSuffix}
                    </span>
                  </span>
                </div>

                {/* Features */}
                <ul className="mt-5 space-y-2">
                  {features.slice(0, 5).map((feat, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 flex-none text-accent-600 dark:text-accent-400"
                        aria-hidden
                      />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href={appUrl(locale, "/onboarding")}
                  className="group mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-accent-600 px-5 text-sm font-medium text-white shadow-sm transition-all hover:bg-accent-700"
                >
                  {t("standard.cta")}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </a>
                <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                  {t("standard.trustLine")}
                </p>
                {/* Offline desktop edition — surfaced inside the Standard card
                    rather than a separate platforms block, so the contact path
                    sits next to the cloud CTA instead of floating below. */}
                <p className="mt-3 border-t border-slate-100 pt-3 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  {t("platforms.desktop.description")}{" "}
                  <a
                    href={DESKTOP_CONTACT_HREF}
                    className="font-medium text-accent-700 underline-offset-2 hover:underline dark:text-accent-400"
                  >
                    {t("platforms.desktop.cta")}
                    <ArrowRight
                      className="ml-0.5 inline-block h-3 w-3 align-[-2px]"
                      aria-hidden
                    />
                  </a>
                </p>
              </div>
            </article>
          </ScrollReveal>

          {/* Enterprise */}
          <ScrollReveal direction="up" delay={0.15}>
            <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex-1 p-6">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                    {t("enterprise.name")}
                  </h3>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {t("enterprise.badge")}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {t("enterprise.tagline")}
                </p>

                <div className="mt-5">
                  <span className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                    {t("enterprise.price")}
                  </span>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {t("enterprise.priceHint")}
                  </p>
                </div>

                <ul className="mt-5 space-y-2">
                  {enterpriseFeatures.map((feat, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 flex-none text-slate-400 dark:text-slate-500"
                        aria-hidden
                      />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="mailto:tiram.business@gmail.com?subject=Enterprise%20plan%20enquiry"
                  className="mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {t("enterprise.cta")}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
                <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                  {t("enterprise.replyHint")}
                </p>
              </div>
            </article>
          </ScrollReveal>
        </div>

        <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
          {t("footnote")}
        </p>
      </div>
    </section>
  );
}

function CycleButton({
  checked,
  label,
  badge,
  onSelect,
}: {
  checked: boolean;
  label: string;
  badge?: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onSelect}
      className={`relative isolate inline-flex items-center gap-2 rounded-full px-5 py-1.5 text-sm font-semibold transition ${
        checked
          ? "text-white"
          : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50"
      }`}
    >
      {checked ? (
        <motion.span
          layoutId="cycle-active"
          aria-hidden
          className="absolute inset-0 -z-10 rounded-full bg-accent-600 shadow-sm"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      ) : null}
      <span>{label}</span>
      {badge ? (
        <span
          // Always-on savings hint on the Yearly pill. Emerald reads as "good
          // deal" regardless of whether the pill background is accent (checked)
          // or transparent (unchecked) — white text gives enough contrast on
          // both.
          className="inline-flex items-center rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white"
        >
          {badge}
        </span>
      ) : null}
    </button>
  );
}
