"use client";

import { useTranslations } from "next-intl";
import {
  Package,
  Receipt,
  Wallet,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";
import { ScrollReveal, motion } from "../shell/motion";

type Step = { title: string; body: string };

// Icon per step — order matches the steps array in landing.howItWorks.steps.
// Falls back to Package if i18n ever returns a longer array than expected.
const STEP_ICONS: readonly LucideIcon[] = [
  Package,
  Receipt,
  Wallet,
  LayoutDashboard,
];

export function HowItWorks() {
  const t = useTranslations("landing.howItWorks");
  const steps = t.raw("steps") as Step[];

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-slate-50/60 py-20 sm:py-28 dark:bg-slate-900/40"
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

        <div className="relative mt-14">
          <ol className="relative grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-6">
            {steps.map((step, i) => {
              const Icon = STEP_ICONS[i] ?? Package;
              const isLast = i === steps.length - 1;
              return (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.55,
                    delay: 0.08 * i,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative flex flex-col"
                >
                  {/* Mobile down-arrow above every step except the first.
                      Hidden on md+ where DashedRightArrow takes over. */}
                  {i > 0 ? (
                    <div
                      aria-hidden
                      className="-mt-2 mb-3 flex justify-center md:hidden"
                    >
                      <DashedDownArrow />
                    </div>
                  ) : null}

                  <div className="group relative flex flex-1 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{
                        type: "spring",
                        stiffness: 240,
                        damping: 18,
                        delay: 0.15 + 0.08 * i,
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent-600 to-violet-600 text-white shadow-sm"
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </motion.div>

                    <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {step.body}
                    </p>

                    <div className="mt-5 flex-1">
                      <StepMock index={i} />
                    </div>
                  </div>

                  {/* Desktop arrow pointing to the next card. Sits in the grid
                      gap, vertically aligned with the icon row. Skipped after
                      the last card. aria-hidden — order is conveyed by <ol>. */}
                  {!isLast ? <DashedRightArrow index={i} /> : null}
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

/**
 * Desktop horizontal connector with a dashed shaft + solid chevron head.
 * Animates the shaft in via `pathLength`; the arrowhead fades in at the
 * tail end of the animation so the visual feels like the arrow is drawn
 * and then "lands". One-shot per scroll-into-view.
 */
function DashedRightArrow({ index }: { index: number }) {
  const baseDelay = 0.25 + index * 0.12;
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 44 12"
      width="44"
      height="12"
      className="pointer-events-none absolute right-0 top-10 hidden translate-x-1/2 text-accent-500/60 md:block dark:text-accent-400/50"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: baseDelay, duration: 0.3 }}
    >
      <motion.path
        d="M 2 6 H 34"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          delay: baseDelay + 0.05,
          duration: 0.7,
          ease: "easeOut",
        }}
      />
      <motion.path
        d="M 32 2 L 40 6 L 32 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: baseDelay + 0.65, duration: 0.25 }}
      />
    </motion.svg>
  );
}

/** Mobile vertical connector — sits between stacked cards. */
function DashedDownArrow() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 32"
      width="12"
      height="32"
      className="text-accent-500/60 dark:text-accent-400/50"
    >
      <path
        d="M 6 2 V 22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 2 20 L 6 28 L 10 20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

// =========================================================================
// Per-step product mocks — small, real-looking UI fragments that mirror
// surfaces that actually exist in the app (products list, quick-bill invoice,
// receivables-aging report, dashboard priority cards). Every value below
// describes a shipped capability; nothing aspirational. Static markup, no
// translatable strings — only universal symbols (₹, %, ✓, INV-, HSN).
// =========================================================================

function StepMock({ index }: { index: number }) {
  if (index === 0) return <ProductMock />;
  if (index === 1) return <InvoiceMock />;
  if (index === 2) return <AgingMock />;
  return <DashboardMock />;
}

function ProductMock() {
  const products = [
    { name: "Cement 50kg", hsn: "2523", stock: 124, low: false },
    { name: "TMT 12mm", hsn: "7214", stock: 18, low: true },
    { name: "GI Pipe 1″", hsn: "7306", stock: 56, low: false },
  ];
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50/60 p-3 dark:border-slate-700 dark:bg-slate-950/30">
      <div className="space-y-1.5">
        {products.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: 0.12 * i, duration: 0.35 }}
            className="flex items-center justify-between rounded-md bg-white px-2.5 py-1.5 text-[11px] dark:bg-slate-800"
          >
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <span className="truncate text-slate-700 dark:text-slate-200">
                {p.name}
              </span>
              <span className="shrink-0 rounded bg-slate-100 px-1 py-0.5 text-[9px] text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                HSN {p.hsn}
              </span>
            </div>
            {p.low ? (
              <span className="ml-2 shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                ↓ {p.stock}
              </span>
            ) : (
              <span className="ml-2 shrink-0 text-[10px] tabular-nums text-slate-500 dark:text-slate-400">
                {p.stock}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function InvoiceMock() {
  const lines = [
    { name: "Cement 50kg", qty: 12, amt: "₹ 1,080" },
    { name: "TMT 12mm", qty: 8, amt: "₹ 4,800" },
  ];
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50/60 p-3 dark:border-slate-700 dark:bg-slate-950/30">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-semibold uppercase tracking-wide text-accent-600 dark:text-accent-400">
          GST Invoice
        </span>
        <span className="text-[9px] tabular-nums text-slate-500 dark:text-slate-400">
          #INV-2451
        </span>
      </div>
      <div className="mt-2 space-y-1">
        {lines.map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: 0.12 * i, duration: 0.35 }}
            className="flex items-center justify-between rounded-md bg-white px-2.5 py-1 text-[11px] dark:bg-slate-800"
          >
            <span className="min-w-0 flex-1 truncate text-slate-700 dark:text-slate-200">
              {l.name}
            </span>
            <div className="ml-2 flex shrink-0 items-center gap-2">
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                ×{l.qty}
              </span>
              <span className="text-[11px] tabular-nums text-slate-900 dark:text-slate-100">
                {l.amt}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-2 flex items-baseline justify-between border-t border-dashed border-slate-200 pt-2 dark:border-slate-700">
        <span className="text-[10px] text-slate-500 dark:text-slate-400">
          Total + 18% GST
        </span>
        <span className="text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-50">
          ₹ 6,938
        </span>
      </div>
    </div>
  );
}

function AgingMock() {
  const buckets = [
    { label: "0–30 d", value: "₹ 42K", pct: 62, alert: false },
    { label: "31–60 d", value: "₹ 18K", pct: 36, alert: false },
    { label: "60+ d", value: "₹ 9K", pct: 22, alert: true },
  ];
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50/60 p-3 dark:border-slate-700 dark:bg-slate-950/30">
      <div className="space-y-2">
        {buckets.map((b, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                {b.label}
                {b.alert ? (
                  <span className="rounded bg-rose-100 px-1 py-0.5 text-[9px] font-medium text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                    defaulter
                  </span>
                ) : null}
              </span>
              <span className="tabular-nums text-slate-700 dark:text-slate-200">
                {b.value}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${b.pct}%` }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.7,
                  delay: 0.12 * i,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={
                  b.alert
                    ? "h-full bg-gradient-to-r from-rose-500 to-orange-500"
                    : "h-full bg-gradient-to-r from-accent-500 to-violet-500"
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardMock() {
  const kpis = [
    { label: "Today", value: "₹ 28K" },
    { label: "Receivable", value: "₹ 1.4L" },
  ];
  const priority: { label: string; tone: "warn" | "rose" }[] = [
    { label: "GSTR-1 due in 3 days", tone: "warn" },
    { label: "4 customers overdue", tone: "rose" },
  ];
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50/60 p-3 dark:border-slate-700 dark:bg-slate-950/30">
      <div className="grid grid-cols-2 gap-1.5">
        {kpis.map((k, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: 0.08 * i, duration: 0.35 }}
            className="rounded-md bg-white p-2 dark:bg-slate-800"
          >
            <p className="text-[8px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {k.label}
            </p>
            <p className="mt-0.5 text-xs font-semibold tabular-nums text-slate-900 dark:text-slate-50">
              {k.value}
            </p>
          </motion.div>
        ))}
      </div>
      <div className="mt-2 space-y-1">
        {priority.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: 0.2 + 0.08 * i, duration: 0.35 }}
            className={
              p.tone === "warn"
                ? "flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-1 text-[10px] text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                : "flex items-center gap-1.5 rounded-md bg-rose-50 px-2 py-1 text-[10px] text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
            }
          >
            <span
              className={
                p.tone === "warn"
                  ? "h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500"
                  : "h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500"
              }
            />
            <span className="truncate">{p.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
