// Cross-domain CTA helper. Landing lives on the apex; the authenticated app
// lives on app.<domain>. NEXT_PUBLIC_APP_ORIGIN is baked in at build time
// (see Dockerfile ARG). Dev defaults to localhost:3005 so the dashboard's
// dev server is targeted when running both locally.
import { resolveOrigin } from "@/lib/env-url";

export const APP_ORIGIN = resolveOrigin(
  "NEXT_PUBLIC_APP_ORIGIN",
  "http://localhost:3005",
);

export function appUrl(locale: string, path: `/${string}` = "/"): string {
  return `${APP_ORIGIN}/${locale}${path === "/" ? "" : path}`;
}
