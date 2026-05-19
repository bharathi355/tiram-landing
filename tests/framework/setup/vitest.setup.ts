/**
 * Vitest global setup. Loaded once per worker before any test file. Wires
 * @testing-library/jest-dom matchers (so `toBeInTheDocument()` etc. work) and
 * clears the RTL DOM after each test so per-test environments stay isolated.
 */
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});
