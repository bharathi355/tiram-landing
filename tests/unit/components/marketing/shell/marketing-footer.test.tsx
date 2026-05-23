/**
 * Unit test for `MarketingFooter` — covers the footer proof badge while
 * stubbing neighboring controls that have their own behavior.
 */
import type { ElementType, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/marketing/shared/language-switcher", () => ({
  MarketingLanguageSwitcher: () => <div data-testid="marketing-lang-stub" />,
}));

vi.mock("@/components/marketing/shared/theme-toggle", () => ({
  ThemeToggle: () => <div data-testid="theme-toggle-stub" />,
}));

vi.mock("@/components/marketing/shell/motion", () => ({
  ScrollReveal: ({
    children,
    as: Tag = "div",
    className,
  }: {
    children: ReactNode;
    as?: ElementType;
    className?: string;
  }) => <Tag className={className}>{children}</Tag>,
}));

import { MarketingFooter } from "@/components/marketing/shell/marketing-footer";
import { renderWithProviders } from "@/tests/framework/render";

const WHATSAPP_URL = "https://wa.me/918667765616";

describe("MarketingFooter proof badge", () => {
  it("renders the Made in India micro-badge with the legal entity", () => {
    const { getByText } = renderWithProviders(<MarketingFooter />);

    expect(
      getByText("Made in India · Tiram Technologies Pvt Ltd"),
    ).toBeInTheDocument();
  });

  it("links the bottom contact CTA to WhatsApp with a prefilled message", () => {
    const { getByTestId } = renderWithProviders(<MarketingFooter />);
    const message = encodeURIComponent(
      "Hi Tiram, I would like to contact your team about Tiram.",
    );

    expect(getByTestId("footer-whatsapp-cta")).toHaveAttribute(
      "href",
      `${WHATSAPP_URL}?text=${message}`,
    );
  });

  it("links the new demand-generation resource guides", () => {
    const { getByRole } = renderWithProviders(<MarketingFooter />);

    expect(getByRole("link", { name: "GSTR-1 export guide" })).toHaveAttribute(
      "href",
      "/en/articles/gstr-1-export-tiram",
    );
    expect(getByRole("link", { name: "Barcode Quick Bill" })).toHaveAttribute(
      "href",
      "/en/articles/counter-billing-barcode-quick-bill",
    );
    expect(getByRole("link", { name: "Purchase to insights" })).toHaveAttribute(
      "href",
      "/en/articles/purchase-to-insights-workflow",
    );
  });
});
