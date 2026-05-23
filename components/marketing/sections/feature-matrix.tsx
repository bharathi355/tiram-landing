"use client";

import { useTranslations } from "next-intl";
import {
  BarChart3,
  Boxes,
  CheckCircle2,
  CreditCard,
  ReceiptText,
  ShoppingCart,
} from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "../shell/motion";

type Pillar = { title: string; items: string[] };

const ICONS = [ShoppingCart, Boxes, ReceiptText, CreditCard, BarChart3];

export function FeatureMatrix() {
  const t = useTranslations("landing.featureMatrix");
  const pillars = t.raw("pillars") as Pillar[];

  return (
    <section
      id="feature-matrix"
      className="border-t border-slate-200 bg-slate-50 py-20 sm:py-28 dark:border-slate-800 dark:bg-slate-900/60"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
            {t("heading")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            {t("intro")}
          </p>
        </ScrollReveal>

        <StaggerContainer
          as="div"
          className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5"
          stagger={0.08}
        >
          {pillars.map((pillar, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <StaggerItem
                key={pillar.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-50 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                    {pillar.title}
                  </h3>
                </div>
                <ul className="mt-5 space-y-3">
                  {pillar.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-200"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 flex-none text-emerald-600 dark:text-emerald-400"
                        aria-hidden
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
