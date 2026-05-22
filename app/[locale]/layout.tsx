import "../globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { routing } from "@/i18n/routing";
import { BRAND_NAME, SITE_URL as DEFAULT_SITE_URL } from "@/lib/brand.server";
import { resolveOrigin } from "@/lib/env-url";
import { CountryDebug } from "@/components/debug/country-debug";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// Noto Sans Tamil is vendored under public/fonts/ and declared via @font-face
// in globals.css. The Tailwind font-sans stack lists "Noto Sans Tamil" as a
// fallback, so Tamil glyphs resolve without next/font/google fetching anything.

const SITE_URL = resolveOrigin("NEXT_PUBLIC_SITE_URL", DEFAULT_SITE_URL);

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s · ${BRAND_NAME}`,
    default: `${BRAND_NAME} — Billing & inventory software for businesses worldwide`,
  },
  description:
    "Tax-compliant invoicing, multi-warehouse inventory, payments, and reports — for businesses of any size, anywhere.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Country-aware content (India variant via the `tiram-country` cookie set in
// middleware) requires per-request rendering. Static prerender would freeze
// the global variant into HTML and the India copy would never appear.
// Netlify's CDN respects the `Vary: x-tiram-country, cookie` header set by
// middleware, so this still caches — just per cookie value, not per request.
export const dynamic = "force-dynamic";

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
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-XX4Q86RVKK"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XX4Q86RVKK');
        `}
      </Script>
      <body className="font-sans text-slate-900 antialiased dark:text-slate-100">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
        {/* No-op in production; prints country-detection details to the
            browser console in development. */}
        <CountryDebug />
      </body>
    </html>
  );
}
