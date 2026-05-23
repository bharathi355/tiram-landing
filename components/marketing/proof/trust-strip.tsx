"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { CssMarquee } from "../shell/motion-css";

const integrations = [
  {
    key: "razorpay",
    src: "/integrations/razorpay.svg",
    width: 92,
  },
  {
    key: "supabase",
    src: "/integrations/supabase.svg",
    width: 104,
  },
];

/**
 * Quiet trust strip: proof label + integration logos only.
 * Feature chips were removed — the hero mock already shows them within
 * the same viewport, making the chip list a direct duplicate.
 */
export function TrustStrip() {
  const t = useTranslations("landing.trust");

  return (
    <section
      aria-label={t("intro")}
      className="border-y border-slate-200 bg-slate-50/60 py-6 dark:border-slate-800 dark:bg-slate-900/40"
    >
      <p className="sr-only">{t("intro")}</p>
      <CssMarquee className="mask-fade-x" speedSeconds={36}>
        <span className="flex items-center gap-3 whitespace-nowrap text-sm font-semibold text-slate-800 dark:text-slate-100">
          {t("proofLabel")}
          <span
            aria-hidden
            className="ml-7 inline-block h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700"
          />
        </span>
        {integrations.map(({ key, src, width }) => (
          <span
            key={key}
            className="flex h-9 items-center rounded-full border border-slate-200 bg-white/85 px-4 shadow-sm dark:border-slate-700 dark:bg-slate-950/80"
          >
            <Image
              src={src}
              alt={t(`integrations.${key}.alt`)}
              width={width}
              height={24}
              className="h-5 w-auto"
            />
            <span className="sr-only">{t(`integrations.${key}.label`)}</span>
          </span>
        ))}
      </CssMarquee>
    </section>
  );
}
