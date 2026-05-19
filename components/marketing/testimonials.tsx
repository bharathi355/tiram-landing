"use client";

import { useTranslations } from "next-intl";
import { Building2 } from "lucide-react";
import { Marquee, ScrollReveal } from "./motion";

type Item = { quote: string; name: string; role: string };

export function Testimonials() {
  const t = useTranslations("landing.testimonials");
  const items = t.raw("items") as Item[];

  return (
    <section className="overflow-hidden py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
            {t("heading")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            {t("intro")}
          </p>
        </ScrollReveal>
      </div>

      {/* Auto-scrolling marquee — duplicated by the Marquee primitive so the
          loop is seamless. Pauses on hover and freezes under
          prefers-reduced-motion. Edge fade prevents abrupt clipping. */}
      <div className="mt-14">
        <Marquee className="mask-fade-x" speedSeconds={60}>
          {items.map((it, i) => (
            <TestimonialCard key={i} item={it} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}

function TestimonialCard({ item }: { item: Item }) {
  return (
    <article className="flex w-[340px] shrink-0 flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:w-[400px] dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent-50 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300">
          <Building2 className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            {item.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {item.role}
          </p>
        </div>
      </div>
      <p className="mt-5 flex-1 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
        {item.quote}
      </p>
    </article>
  );
}
