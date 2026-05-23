"use client";

import { useTranslations } from "next-intl";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./shell/motion";

type Item = { n: string; title: string; body: string };

export function WhyTiram() {
  const t = useTranslations("landing.whyTiram");
  const items = t.raw("items") as Item[];

  return (
    <section
      id="why-tiram"
      className="bg-slate-50/60 py-20 sm:py-28 dark:bg-slate-900/40"
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

        <StaggerContainer
          as="ol"
          className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.06}
        >
          {items.map((item, i) => (
            <StaggerItem
              key={i}
              as="li"
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <span
                aria-hidden
                className="bg-gradient-to-br from-accent-600 to-violet-600 bg-clip-text text-3xl font-semibold tracking-tight text-transparent dark:from-accent-400 dark:to-violet-400"
              >
                {item.n}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-50">
                {item.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                {item.body}
              </p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
