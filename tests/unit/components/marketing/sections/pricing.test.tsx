import type { ElementType, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/marketing/sections/../shell/motion", () => ({
  ScrollReveal: ({
    children,
    as: Tag = "div",
    className,
  }: {
    children: ReactNode;
    as?: ElementType;
    className?: string;
  }) => <Tag className={className}>{children}</Tag>,
  motion: new Proxy(
    {},
    {
      get: () => (props: Record<string, unknown>) => {
        const { children, layoutId: _layoutId, ...rest } = props as {
          children?: ReactNode;
          layoutId?: string;
        };
        return <span {...rest}>{children}</span>;
      },
    },
  ),
}));

import { Pricing } from "@/components/marketing/sections/pricing";
import { renderWithProviders } from "@/tests/framework/render";

const WHATSAPP_URL = "https://wa.me/918667765616";

describe("Pricing CTAs", () => {
  it("keeps the Standard plan CTA on the locale-aware onboarding path", () => {
    const { getByTestId } = renderWithProviders(<Pricing />, { locale: "ta" });

    expect(getByTestId("pricing-primary-cta").getAttribute("href")).toMatch(
      /\/ta\/onboarding$/,
    );
  });

  it("uses WhatsApp for desktop and enterprise support intent", () => {
    const { getByTestId } = renderWithProviders(<Pricing />);

    const desktopMessage = encodeURIComponent(
      "Hi Tiram, I would like to know about the offline desktop app for Windows and Mac.",
    );
    const enterpriseMessage = encodeURIComponent(
      "Hi Tiram, I would like to discuss Tiram for multiple branches, distribution, or custom integrations.",
    );

    expect(getByTestId("pricing-desktop-whatsapp-cta")).toHaveAttribute(
      "href",
      `${WHATSAPP_URL}?text=${desktopMessage}`,
    );
    expect(getByTestId("pricing-enterprise-whatsapp-cta")).toHaveAttribute(
      "href",
      `${WHATSAPP_URL}?text=${enterpriseMessage}`,
    );
  });
});