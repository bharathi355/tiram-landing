"use client";

import { useTranslations } from "next-intl";
import { Clock, Zap, ShieldCheck, TrendingUp } from "lucide-react";
import { CountUp, ScrollReveal, StaggerContainer, StaggerItem } from "./motion";

type Item = { metric: string; label: string };

/**
 * Parse the i18n metric string (e.g. "30s", "10×", "0", "Daily") into a
 * shape the CountUp primitive can animate. Non-numeric strings render as a
 * static fallback.
 */
function parseMetric(metric: string): {
  value: number | null;
  suffix: string;
} {
  const match = metric.match(/^(\d+)(.*)$/);
  if (!match) return { value: null, suffix: "" };
  return { value: Number(match[1]), suffix: match[2] };
}

const ICONS = [Clock, Zap, ShieldCheck, TrendingUp];

export function Outcomes() {
  const t = useTranslations("landing.outcomes");
  const items = t.raw("items") as Item[];

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
            {t("heading")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            {t("intro")}
          </p>
        </ScrollReveal>
        <StaggerContainer
          as="ul"
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.1}
        >
          {items.map((item, i) => {
            const { value, suffix } = parseMetric(item.metric);
            const Icon = ICONS[i % ICONS.length];
            return (
              <StaggerItem
                key={i}
                as="li"
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent-300 hover:shadow-xl hover:shadow-accent-500/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-accent-700"
              >
                {/* Subtle accent corner glow on hover */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-accent-400 to-violet-400 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30"
                />
                <div className="relative">
                  <Icon
                    className="h-5 w-5 text-accent-600 dark:text-accent-400"
                    aria-hidden
                  />
                  <p className="mt-4 bg-gradient-to-br from-accent-600 to-violet-600 bg-clip-text text-4xl font-semibold tracking-tight text-transparent dark:from-accent-400 dark:to-violet-400">
                    <CountUp value={value} suffix={suffix} fallback={item.metric} />
                  </p>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                    {item.label}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
