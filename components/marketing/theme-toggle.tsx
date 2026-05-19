"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("landing.nav");
  const { resolvedTheme, setTheme } = useTheme();
  // Avoid hydration mismatch — `next-themes` resolves only on the client.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={t("toggleTheme")}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
        className,
      )}
    >
      {/* Render both icons so the SSR HTML is identical regardless of theme */}
      <Sun className={cn("h-4 w-4", isDark && "hidden")} />
      <Moon className={cn("h-4 w-4", !isDark && "hidden")} />
    </button>
  );
}
