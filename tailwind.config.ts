import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  // Class-based dark mode is scoped to the marketing/landing tree only via the
  // ThemeProvider in components/marketing/. The authenticated app does not opt
  // in, so it stays on the existing light palette.
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        accent: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Noto Sans Tamil",
          "sans-serif",
        ],
      },
      fontSize: {
        base: ["14px", { lineHeight: "20px" }],
      },
    },
  },
  plugins: [],
};

export default config;
