"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { appUrl } from "@/lib/app-url";
import { ScrollReveal } from "./motion";

export function FinalCta() {
  const t = useTranslations("landing.finalCta");
  const locale = useLocale();

  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <ScrollReveal
        direction="up"
        className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl"
      >
        {/* Animated gradient backdrop — slow drift via animate-gradient-shift
            keyframe in globals.css. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-accent-600 via-accent-600 to-violet-600 animate-gradient-shift"
        />
        {/* Decorative top-right radial highlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.25),transparent_50%)]"
        />
        <div className="relative px-8 py-16 text-center sm:px-12 sm:py-20">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t("heading")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/85">
            {t("subhead")}
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href={appUrl(locale, "/sign-up")}
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-accent-700 shadow-xl shadow-black/20 transition-all hover:scale-[1.03] hover:shadow-2xl"
            >
              {t("cta")}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </a>
          </div>
          <p className="mt-4 text-xs text-white/75">{t("fineprint")}</p>
        </div>
      </ScrollReveal>
    </section>
  );
}
