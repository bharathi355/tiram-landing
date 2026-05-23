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

describe("MarketingFooter proof badge", () => {
  it("renders the Made in India micro-badge with the legal entity", () => {
    const { getByText } = renderWithProviders(<MarketingFooter />);

    expect(
      getByText("Made in India · Tiram Technologies Pvt Ltd"),
    ).toBeInTheDocument();
  });
});
