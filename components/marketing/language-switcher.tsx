"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * Marketing-specific language switcher.
 *
 * Differs from `components/app/language-switcher.tsx` in two ways:
 *  - Dark-mode aware (the marketing tree opts into class-based dark mode).
 *  - Does NOT PATCH `/me` because the visitor is unauthenticated by definition.
 */
export function MarketingLanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("landing.nav");
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const [pending, startTransition] = useTransition();

  return (
    <div
      role="group"
      aria-label={t("features")}
      className={cn(
        "inline-flex items-center rounded-md border border-slate-200 bg-white p-0.5 text-xs dark:border-slate-700 dark:bg-slate-900",
        pending && "opacity-60",
        className,
      )}
    >
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => {
            if (l === locale) return;
            startTransition(() => router.replace(pathname, { locale: l }));
          }}
          aria-pressed={l === locale}
          className={cn(
            "rounded px-2 py-1 font-medium uppercase tracking-wide transition-colors",
            l === locale
              ? "bg-accent-600 text-white"
              : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
