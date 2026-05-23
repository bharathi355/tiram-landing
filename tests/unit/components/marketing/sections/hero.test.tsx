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
  StaggerContainer: ({
    children,
    as: Tag = "div",
    className,
  }: {
    children: ReactNode;
    as?: ElementType;
    className?: string;
  }) => <Tag className={className}>{children}</Tag>,
  StaggerItem: ({
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
      get: () => ({ children, className }: { children?: ReactNode; className?: string }) => (
        <div className={className}>{children}</div>
      ),
    },
  ),
}));

import { Hero } from "@/components/marketing/sections/hero";
import { renderWithProviders } from "@/tests/framework/render";

describe("Hero contact CTA", () => {
  it("replaces the how-it-works anchor with a WhatsApp contact action", () => {
    const { getByTestId, queryByText } = renderWithProviders(<Hero />);
    const message = encodeURIComponent(
      "Hi Tiram, I am interested in billing and inventory software. Can you help me choose the right setup for my business?",
    );

    expect(queryByText("See how it works")).not.toBeInTheDocument();
    expect(getByTestId("hero-contact-cta")).toHaveAttribute(
      "href",
      `https://wa.me/918667765616?text=${message}`,
    );
  });
});