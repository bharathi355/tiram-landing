import { cookies, headers } from "next/headers";
import { COUNTRY_COOKIE } from "@/lib/country";

/**
 * Dev-only diagnostic panel that prints country-detection details to the
 * browser console on every page load.
 *
 * Why: on localhost there is no `x-nf-geo` header (Netlify only sets it in
 * production), so detection falls through to `OTHER` and the India variant
 * never appears. This component makes the "why" visible at a glance — what
 * cookie is set, which geo header was present (if any), and what to do to
 * force the India variant locally.
 *
 * Rendered as a no-DOM `<script>` so it doesn't affect layout or hydration.
 * Only rendered when NODE_ENV !== "production".
 */
export async function CountryDebug() {
  if (process.env.NODE_ENV === "production") return null;

  const cookieStore = await cookies();
  const headerStore = await headers();

  const cookieValue = cookieStore.get(COUNTRY_COOKIE)?.value ?? null;

  // Snapshot every geo-related header the deploy platform might send, so the
  // developer can see exactly what is and isn't reaching the app locally.
  const geoHeaders = {
    "x-nf-geo": headerStore.get("x-nf-geo"),
    "cf-ipcountry": headerStore.get("cf-ipcountry"),
    "x-vercel-ip-country": headerStore.get("x-vercel-ip-country"),
    "cloudfront-viewer-country": headerStore.get("cloudfront-viewer-country"),
    "x-country": headerStore.get("x-country"),
    // The two we set from middleware — handy to verify it ran:
    "x-tiram-country (set by our middleware)":
      headerStore.get("x-tiram-country"),
    "x-tiram-country-source (set by our middleware)":
      headerStore.get("x-tiram-country-source"),
  };

  const payload = {
    cookie: { name: COUNTRY_COOKIE, value: cookieValue },
    geoHeaders,
    notes: {
      whyOTHER:
        "On localhost there's usually no geo header, so detection returns OTHER (global content). Netlify injects x-nf-geo in production.",
      forceIN:
        "To preview the India variant locally: in DevTools console, run `document.cookie = 'tiram-country=IN; path=/'` then reload.",
      forceOTHER:
        "To go back: `document.cookie = 'tiram-country=OTHER; path=/'` then reload.",
      clearOverride:
        "To clear the override and let middleware re-detect: `document.cookie = 'tiram-country=; path=/; max-age=0'`",
    },
  };

  // JSON.stringify is safe to inline because the value is fully server-known
  // (no user input). Still, escape `</` to defeat any pathological future
  // input that could include a closing script tag.
  const json = JSON.stringify(payload, null, 2).replace(/<\//g, "<\\/");

  const script = `
console.groupCollapsed("%c[Tiram] country detection (dev only)", "color:#6366f1;font-weight:600");
console.log(${json});
const v = ${JSON.stringify(cookieValue ?? "(unset)")};
console.log("%cActive variant: %c" + v, "color:#64748b", v === "IN" ? "color:#16a34a;font-weight:600" : "color:#dc2626;font-weight:600");
console.groupEnd();
`;

  return (
    <script
      // Server-rendered, never hydrated as JSX — runs once on page load.
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
