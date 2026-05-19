/**
 * Custom render that wraps the unit-under-test in NextIntlClientProvider so
 * `useTranslations()` and `useLocale()` resolve without each test mounting
 * its own provider. Landing has no react-query — there's no QueryClient here.
 *
 * Usage:
 *   import { renderWithProviders } from "@/tests/framework/render";
 *   renderWithProviders(<MyComponent prop="…" />);
 *   renderWithProviders(<MyComponent />, { locale: "ta" });
 */
import { render, type RenderOptions, type RenderResult } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactElement, ReactNode } from "react";

import enMessages from "@/messages/en.json";
import taMessages from "@/messages/ta.json";

const MESSAGES = { en: enMessages, ta: taMessages } as const;

type LocaleKey = keyof typeof MESSAGES;

interface RenderWithProvidersOptions extends Omit<RenderOptions, "wrapper"> {
  locale?: LocaleKey;
}

export function renderWithProviders(
  ui: ReactElement,
  { locale = "en", ...rtlOptions }: RenderWithProvidersOptions = {},
): RenderResult {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <NextIntlClientProvider locale={locale} messages={MESSAGES[locale]}>
      {children}
    </NextIntlClientProvider>
  );
  return render(ui, { wrapper: Wrapper, ...rtlOptions });
}
