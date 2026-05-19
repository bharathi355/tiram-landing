/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Vitest config for the landing app's component + lib unit tests. Scope:
//   - components/marketing/**/*.tsx
//   - lib/*.ts (utils.ts, app-url.ts)
//   - app/[locale]/**/*.tsx
// No Playwright e2e here — landing is small enough to validate via unit
// tests + the landing-smoke-boot CI job.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: false,
    include: ["tests/unit/**/*.test.{ts,tsx}"],
    setupFiles: ["./tests/framework/setup/vitest.setup.ts"],
    sequence: { shuffle: false },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
    },
  },
});
