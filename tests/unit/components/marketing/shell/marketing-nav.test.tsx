/**
 * Unit test for `MarketingNav` — covers the brand mark + wordmark in the
 * landing top navigation. Siblings (language switcher, theme toggle,
 * motion-driven mobile drawer) are stubbed so the test isolates branding.
 *
 * Mirror of `frontend-landing/components/marketing/marketing-nav.tsx`.
 */
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

vi.mock("@/components/marketing/shared/language-switcher", () => ({
  MarketingLanguageSwitcher: () => <div data-testid="marketing-lang-stub" />,
}));

vi.mock("@/components/marketing/shared/theme-toggle", () => ({
  ThemeToggle: () => <div data-testid="theme-toggle-stub" />,
}));

vi.mock("@/components/marketing/shell/motion", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: new Proxy(
    {},
    {
      get: () => (props: Record<string, unknown>) => {
        const { children, ...rest } = props as { children?: React.ReactNode };
        return <div {...rest}>{children}</div>;
      },
    },
  ),
}));

import { MarketingNav } from "@/components/marketing/shell/marketing-nav";
import { renderWithProviders } from "@/tests/framework/render";

describe("MarketingNav brand link", () => {
  it("renders the logo next to the wordmark with the localized alt text", () => {
    const { getByAltText, getByText } = renderWithProviders(<MarketingNav />);
    const logo = getByAltText("Tiram logo") as HTMLImageElement;
    expect(logo).toBeInTheDocument();
    expect(logo.getAttribute("src")).toBe("/logo.png");
    expect(getByText("Tiram")).toBeInTheDocument();
  });

  it("uses the Tamil alt text under the ta locale", () => {
    const { getByAltText } = renderWithProviders(<MarketingNav />, {
      locale: "ta",
    });
    expect(getByAltText("திறம் சின்னம்")).toBeInTheDocument();
  });
});

describe("MarketingNav anchor links", () => {
  it("nav anchors use absolute /{locale}#id hrefs so they work from any page", () => {
    const { getAllByRole } = renderWithProviders(<MarketingNav />);
    const anchors = getAllByRole("link") as HTMLAnchorElement[];
    const anchorHrefs = anchors.map((a) => a.getAttribute("href"));
    // Every section anchor must start with /en# (not just #)
    const sectionAnchors = anchorHrefs.filter((h) => h && h.startsWith("/") && h.includes("#"));
    expect(sectionAnchors.length).toBeGreaterThan(0);
    sectionAnchors.forEach((href) => {
      expect(href).toMatch(/^\/en#/);
    });
  });

  it("nav anchors under ta locale use /ta#id hrefs", () => {
    const { getAllByRole } = renderWithProviders(<MarketingNav />, { locale: "ta" });
    const anchors = getAllByRole("link") as HTMLAnchorElement[];
    const sectionAnchors = anchors
      .map((a) => a.getAttribute("href"))
      .filter((h) => h && h.startsWith("/") && h.includes("#"));
    sectionAnchors.forEach((href) => {
      expect(href).toMatch(/^\/ta#/);
    });
  });
});
