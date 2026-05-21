"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { FileCheck, QrCode, Languages, Printer, Warehouse } from "lucide-react";
import { Marquee } from "./motion";

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
 * Quiet trust strip rendered as an infinite marquee. The icon+label pairs
 * loop horizontally, pause on hover, and fade at the edges via the
 * `mask-fade-x` utility so items don't clip abruptly.
 */
export function TrustStrip() {
  const t = useTranslations("landing.trust");

  const items = [
    { Icon: FileCheck, label: t("items.tax") },
    { Icon: QrCode, label: t("items.upi") },
    { Icon: Languages, label: t("items.bilingual") },
    { Icon: Printer, label: t("items.thermal") },
    { Icon: Warehouse, label: t("items.warehouse") },
  ];

  return (
    <section
      aria-label={t("intro")}
      className="border-y border-slate-200 bg-slate-50/60 py-6 dark:border-slate-800 dark:bg-slate-900/40"
    >
      <p className="sr-only">{t("intro")}</p>
      <Marquee className="mask-fade-x" speedSeconds={36}>
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
        {items.map(({ Icon, label }, i) => (
          <span
            key={i}
            className="flex items-center gap-2 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300"
          >
            <Icon
              className="h-4 w-4 text-accent-600 dark:text-accent-400"
              aria-hidden
            />
            {label}
            <span
              aria-hidden
              className="ml-10 inline-block h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700"
            />
          </span>
        ))}
      </Marquee>
    </section>
  );
}
