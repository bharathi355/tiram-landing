import "../globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { routing } from "@/i18n/routing";
import { BRAND_NAME } from "@/lib/brand.server";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// Noto Sans Tamil is vendored under public/fonts/ and declared via @font-face
// in globals.css. The Tailwind font-sans stack lists "Noto Sans Tamil" as a
// fallback, so Tamil glyphs resolve without next/font/google fetching anything.

export const metadata: Metadata = {
  title: {
    template: `%s · ${BRAND_NAME}`,
    default: `${BRAND_NAME} — Billing & inventory for Indian SMBs`,
  },
  description: "Sales/Billing & Warehouse/Inventory for small businesses.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className={inter.variable}>
      <body className="font-sans text-slate-900 antialiased dark:text-slate-100">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
