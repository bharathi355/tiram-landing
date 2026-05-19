/**
 * check-i18n.mjs
 *
 * Verifies that every leaf key in en.json exists in every other locale file
 * and vice versa. Run before `next build` so missing translations are caught
 * at build time rather than at runtime in production.
 *
 * Usage: node scripts/check-i18n.mjs
 * Exit code: 0 = all keys present, 1 = mismatches found
 */

import { readFileSync, readdirSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const messagesDir = resolve(__dirname, "../messages");

/**
 * Recursively collect every dot-notation leaf key from a JSON object.
 * E.g. { a: { b: "x" } } → ["a.b"]
 */
function collectLeafKeys(obj, prefix = "") {
  const keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      keys.push(...collectLeafKeys(v, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

// Load all *.json files in messages/
const localeFiles = readdirSync(messagesDir).filter((f) => f.endsWith(".json"));

if (localeFiles.length < 2) {
  console.log("check-i18n: fewer than 2 locale files found — nothing to compare.");
  process.exit(0);
}

/** @type {Map<string, Set<string>>} locale → Set of leaf keys */
const localeKeys = new Map();

for (const file of localeFiles) {
  const locale = file.replace(".json", "");
  const raw = readFileSync(join(messagesDir, file), "utf8");
  const parsed = JSON.parse(raw);
  localeKeys.set(locale, new Set(collectLeafKeys(parsed)));
}

// Use `en` as the reference; fall back to the first locale if `en` is absent.
const referenceLocale = localeKeys.has("en") ? "en" : [...localeKeys.keys()][0];
const referenceKeys = localeKeys.get(referenceLocale);

let totalErrors = 0;

for (const [locale, keys] of localeKeys.entries()) {
  if (locale === referenceLocale) continue;

  const missingInLocale = [...referenceKeys].filter((k) => !keys.has(k));
  const extraInLocale = [...keys].filter((k) => !referenceKeys.has(k));

  if (missingInLocale.length > 0) {
    console.error(
      `\n[check-i18n] ${locale}.json is missing ${missingInLocale.length} key(s) that exist in ${referenceLocale}.json:`
    );
    missingInLocale.forEach((k) => console.error(`  - ${k}`));
    totalErrors += missingInLocale.length;
  }

  if (extraInLocale.length > 0) {
    console.error(
      `\n[check-i18n] ${locale}.json has ${extraInLocale.length} key(s) not present in ${referenceLocale}.json:`
    );
    extraInLocale.forEach((k) => console.error(`  + ${k}`));
    totalErrors += extraInLocale.length;
  }
}

if (totalErrors === 0) {
  console.log(`check-i18n: all ${referenceKeys.size} keys are in sync across ${localeFiles.length} locale(s). ✓`);
  process.exit(0);
} else {
  console.error(`\ncheck-i18n: ${totalErrors} key mismatch(es) found. Fix before building.`);
  process.exit(1);
}
