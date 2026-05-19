/**
 * check-env.mjs
 *
 * Validates the NEXT_PUBLIC_* URL env vars consumed at build time. Hosting
 * providers expose these as raw strings: an empty value in the Netlify UI
 * comes through as "" (not undefined), and a value without a scheme
 * ("tiram.app" instead of "https://tiram.app") still passes a naive
 * "is it a string" check. Both used to crash prerender with an opaque
 * "Server Components render" error — see Netlify build failure 2026-05-19.
 *
 * Runs before `next build`. If a variable is set but malformed, this script
 * exits non-zero with a precise message so the misconfiguration is caught
 * before Next.js obscures it.
 *
 * Usage: node scripts/check-env.mjs
 * Exit code: 0 = all set vars valid, 1 = one or more invalid.
 */

const VARS = ["NEXT_PUBLIC_SITE_URL", "NEXT_PUBLIC_APP_ORIGIN"];

const errors = [];

for (const name of VARS) {
  const raw = process.env[name];
  // Unset is fine — the code falls back to a hard-coded default.
  if (raw === undefined) continue;

  const trimmed = raw.trim();
  // Empty/whitespace is treated as "unset" — the runtime helper falls back to
  // the brand default. This avoids breaking deploys where a hosting-provider
  // UI quirk creates an empty env var the user didn't intend to set.
  if (trimmed === "") {
    console.warn(
      `check-env: ${name} is set but empty — using the default. Set a full http(s) URL or remove the variable.`,
    );
    continue;
  }

  // Accept scheme-less hostnames (e.g. "tiram.co.in") — the runtime helper
  // normalizes them by prepending "https://". Only fail on truly malformed
  // values that wouldn't parse even with a scheme.
  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed);
  const candidate = hasScheme ? trimmed : `https://${trimmed}`;

  let url;
  try {
    url = new URL(candidate);
  } catch {
    errors.push(
      `${name}="${raw}" is not a valid URL. Use a hostname like "tiram.co.in" or a full URL like "https://tiram.co.in".`,
    );
    continue;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    errors.push(
      `${name}="${raw}" uses unsupported protocol "${url.protocol}". Use http or https.`,
    );
    continue;
  }

  if (!hasScheme) {
    console.warn(
      `check-env: ${name}="${raw}" has no scheme — will be treated as "${url.origin}". Set the full URL in your hosting provider's env panel to silence this.`,
    );
  }
}

if (errors.length > 0) {
  console.error("\ncheck-env: invalid build-time URL configuration:");
  errors.forEach((msg) => console.error(`  - ${msg}`));
  console.error("\nFix in your hosting provider's environment-variables panel and redeploy.\n");
  process.exit(1);
}

console.log(`check-env: all ${VARS.length} public URL env var(s) valid (or unset). ✓`);
process.exit(0);
