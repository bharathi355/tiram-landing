"use client";

import { useTranslations } from "next-intl";
import {
  FileCheck,
  Globe,
  Calculator,
  Sliders,
  Banknote,
  Languages,
} from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "../shell/motion";

type Item = { title: string; body: string };

const ICONS = [FileCheck, Globe, Calculator, Sliders, Banknote, Languages];

export function BuiltForRegion() {
  const t = useTranslations("landing.region");
  const items = t.raw("items") as Item[];

  return (
    <section
      id="region"
      className="relative overflow-hidden bg-slate-950 py-20 text-slate-100 sm:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.25),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.20),transparent_55%)]"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("heading")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            {t("intro")}
          </p>
        </ScrollReveal>
        <StaggerContainer
          as="ul"
          className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.08}
        >
          {items.map((it, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <StaggerItem
                key={i}
                as="li"
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-accent-400 to-violet-400 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-25"
                />
                <div className="relative">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-accent-500/20 to-violet-500/20 ring-1 ring-white/10">
                    <Icon
                      className="h-5 w-5 text-accent-300"
                      aria-hidden
                    />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-white">
                    {it.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    {it.body}
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
