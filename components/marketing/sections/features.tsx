"use client";

import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { ScrollReveal, motion } from "../shell/motion";

type Feature = { title: string; tagline: string; bullets: string[] };

type MockRow = { label: string; value: string };

function buildMockRows(title: string, bullets: string[], index: number): MockRow[] {
  const textPool = [title, ...bullets].filter((text) => text.trim().length > 0);

  return Array.from({ length: 4 }).map((_, rowIndex) => {
    const raw = textPool[rowIndex % Math.max(1, textPool.length)] ?? title;
    const label =
      raw.length > 34 ? `${raw.slice(0, 33).trimEnd()}...` : raw;

    const valuePatterns = [
      `+${(index + 1) * (rowIndex + 2)}%`,
      `${index + rowIndex + 2}.${(index * 3 + rowIndex) % 10}x`,
      `${(index + 1) * 12 + rowIndex}/${(rowIndex + 1) * 10}`,
      `#${index + 1}${rowIndex + 1}`,
    ];

    return { label, value: valuePatterns[rowIndex] };
  });
}

export function Features() {
  const t = useTranslations("landing.features");
  const items = t.raw("items") as Feature[];

  return (
    <section
      id="features"
      className="border-t border-slate-200 bg-white py-20 sm:py-28 dark:border-slate-800 dark:bg-slate-950"
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

        <div className="mt-16 space-y-16 lg:mt-24 lg:space-y-28">
          {items.map((f, i) => {
            const flip = i % 2 === 1;
            return (
              <article
                key={i}
                className="grid items-center gap-10 lg:grid-cols-2"
              >
                <ScrollReveal
                  direction={flip ? "right" : "left"}
                  className={flip ? "lg:order-2" : undefined}
                >
                  <h3 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
                    {f.tagline}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {f.bullets.map((b, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200"
                      >
                        <Check
                          className="mt-0.5 h-4 w-4 flex-none text-accent-600 dark:text-accent-400"
                          aria-hidden
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </ScrollReveal>
                <ScrollReveal
                  direction={flip ? "left" : "right"}
                  delay={0.1}
                  className={flip ? "lg:order-1" : undefined}
                >
                  <FeatureMock index={i} title={f.title} bullets={f.bullets} />
                </ScrollReveal>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * Lightweight HTML/CSS mock — avoids heavy image assets and themes naturally.
 * The visual differs subtly per feature index so the page does not feel
 * repetitive when scrolling through six rows. The accent blob pulses gently
 * on a 4s loop to add life without distracting from the copy.
 */
function FeatureMock({
  index,
  title,
  bullets,
}: {
  index: number;
  title: string;
  bullets: string[];
}) {
  const tones = [
    "from-accent-500 to-violet-500",
    "from-sky-500 to-accent-500",
    "from-emerald-500 to-teal-500",
    "from-amber-500 to-rose-500",
    "from-fuchsia-500 to-accent-500",
    "from-indigo-500 to-cyan-500",
  ];
  const tone = tones[index % tones.length];
  const rows = buildMockRows(title, bullets, index);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
      <motion.div
        aria-hidden
        className={`absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br ${tone} blur-3xl`}
        initial={{ opacity: 0.15 }}
        animate={{ opacity: [0.15, 0.32, 0.15] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative space-y-3">
        <div className="h-2 w-12 rounded-full bg-accent-500/70" />
        <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
          {title}
        </p>
        <div className="space-y-2">
          {rows.map((row, k) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: k * 0.06, duration: 0.4 }}
              className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-xs dark:bg-slate-800"
            >
              <span className="max-w-[70%] truncate text-slate-700 dark:text-slate-200">
                {row.label}
              </span>
              <span className="font-medium text-slate-500 dark:text-slate-400">
                {row.value}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
