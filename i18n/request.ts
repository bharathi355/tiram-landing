import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { COUNTRY_COOKIE } from "@/lib/country";
import { routing } from "./routing";

// Messages are always a plain object at the root (the JSON files start with
// `{}`). The typing matches next-intl's expectation for `RequestConfig.messages`.
type Messages = Record<string, unknown>;

function isPlainObject(v: unknown): v is Messages {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

/**
 * Recursive deep-merge of plain JSON objects. Arrays are *replaced* (not
 * concatenated) so an India variant can override an entire `items: [...]`
 * block cleanly; primitives are replaced too. Both inputs are treated as
 * immutable — we return a fresh object so cached imports stay safe across
 * requests.
 */
function deepMerge(base: Messages, override: Messages): Messages {
  const out: Messages = { ...base };
  for (const [k, v] of Object.entries(override)) {
    const left = out[k];
    out[k] = isPlainObject(left) && isPlainObject(v) ? deepMerge(left, v) : v;
  }
  return out;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale =
    requested && (routing.locales as readonly string[]).includes(requested)
      ? requested
      : routing.defaultLocale;

  const base = (await import(`../messages/${locale}.json`))
    .default as Messages;

  // Country axis: orthogonal to locale. When the visitor is in India, we
  // deep-merge messages/{locale}-IN.json over the base file. Missing India
  // file or missing keys both fall back to base silently — the India variant
  // is an enrichment, not a hard requirement.
  const country = (await cookies()).get(COUNTRY_COOKIE)?.value;
  let messages: Messages = base;
  if (country === "IN") {
    try {
      const india = (await import(`../messages/${locale}-IN.json`))
        .default as Messages;
      messages = deepMerge(base, india);
    } catch {
      // No India variant for this locale yet — keep base.
    }
  }

  return { locale, messages };
});
