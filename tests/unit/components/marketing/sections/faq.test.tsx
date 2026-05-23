import type { ElementType, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/marketing/sections/../shell/motion", () => ({
  AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
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

import { Faq } from "@/components/marketing/sections/faq";
import { renderWithProviders } from "@/tests/framework/render";

const WHATSAPP_URL = "https://wa.me/918667765616";

describe("Faq support CTA", () => {
  it("adds a secondary WhatsApp contact action after objection handling", () => {
    const { getByTestId, getByText } = renderWithProviders(<Faq />);
    const message = encodeURIComponent(
      "Hi Tiram, I have a question before starting my Tiram trial.",
    );

    expect(getByText("Still deciding? Ask before you start.")).toBeInTheDocument();
    expect(getByTestId("faq-whatsapp-cta")).toHaveAttribute(
      "href",
      `${WHATSAPP_URL}?text=${message}`,
    );
  });
});