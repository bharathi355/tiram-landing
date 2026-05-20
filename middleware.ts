import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { COUNTRY_COOKIE, detectCountryWithSource } from "@/lib/country";

// next-intl owns locale resolution / redirects. We wrap it to layer in
// country detection without losing any of next-intl's behaviour.
const intl = createIntlMiddleware(routing);

export default function middleware(req: NextRequest) {
  const res = intl(req) ?? NextResponse.next();

  const { variant, source, raw } = detectCountryWithSource(req);

  // Only write the cookie when the value would actually change. Setting it on
  // every request churns Set-Cookie headers and confuses some CDNs.
  if (req.cookies.get(COUNTRY_COOKIE)?.value !== variant) {
    res.cookies.set(COUNTRY_COOKIE, variant, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
      path: "/",
      // Not httpOnly: client code may want to read it later (e.g. a future
      // "showing India content" badge or a manual override toggle).
    });
  }

  // Vary tells caches the response depends on these axes. Cookie covers the
  // explicit override; x-tiram-country is the request-bound country (set
  // below as a response header for debugging — Netlify's edge cache key is
  // configured separately, but Vary keeps any downstream cache honest).
  res.headers.set("Vary", "x-tiram-country, cookie");
  res.headers.set("x-tiram-country", variant);
  res.headers.set("x-tiram-country-source", source);

  // Dev-only: print to the dev server terminal so it's easy to see what got
  // detected on every navigation while testing locally.
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log(
      `[country] ${req.nextUrl.pathname} → variant=${variant} source=${source} raw=${raw ?? "—"}`,
    );
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
