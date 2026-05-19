// Resilient env-var-to-origin resolver. Hosting providers (Netlify, Vercel)
// expose env vars as strings, and operators frequently set values in three
// shapes the naive `new URL(...)` doesn't tolerate:
//   1. `""`        — UI quirk where an empty value is created. `??` would
//                    miss it (only catches null/undefined), so an empty
//                    string would crash prerender.
//   2. `tiram.co.in` — bare hostname, no scheme. People reading the var name
//                      "SITE_URL" reasonably write the host. We accept this
//                      and prepend `https://`.
//   3. garbage    — truly malformed (spaces, control chars, exotic schemes).
//                    Falls back to the supplied default with a warning.
// All three cases previously crashed prerender with an opaque "Server
// Components render" error.
export function resolveOrigin(name: string, fallback: string): string {
  const raw = process.env[name];
  const trimmed = typeof raw === "string" ? raw.trim() : "";

  if (!trimmed) return stripTrailingSlash(fallback);

  const candidate = hasScheme(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error(`unsupported protocol "${url.protocol}"`);
    }
    if (!hasScheme(trimmed)) {
      console.info(
        `[env-url] ${name}="${trimmed}" had no scheme; using "${url.origin}".`,
      );
    }
    return stripTrailingSlash(candidate);
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.warn(
      `[env-url] ${name}="${trimmed}" is not a valid http(s) URL (${reason}); falling back to ${fallback}`,
    );
    return stripTrailingSlash(fallback);
  }
}

function hasScheme(value: string): boolean {
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(value);
}

function stripTrailingSlash(value: string): string {
  return value.replace(/\/$/, "");
}
