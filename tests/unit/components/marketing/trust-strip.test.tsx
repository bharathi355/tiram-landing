/**
 * Unit test for `TrustStrip` — covers the honest proof label and local
 * integration logos without exercising the marquee animation itself.
 */
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

vi.mock("@/components/marketing/shell/motion", () => ({
  Marquee: ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
  ScrollReveal: ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}));

import { TrustStrip } from "@/components/marketing/trust-strip";
import { renderWithProviders } from "@/tests/framework/render";

describe("TrustStrip proof", () => {
  it("renders the honest Indian SMB proof label and approved integration logos", () => {
    const { getByAltText, getByText } = renderWithProviders(<TrustStrip />);

    expect(getByText("Trusted by Indian SMBs")).toBeInTheDocument();
    expect(getByAltText("Razorpay logo").getAttribute("src")).toBe(
      "/integrations/razorpay.svg",
    );
    expect(getByAltText("Supabase logo").getAttribute("src")).toBe(
      "/integrations/supabase.svg",
    );
  });

  it("renders all trust items including the five new proof points", () => {
    const { getByText } = renderWithProviders(<TrustStrip />);

    // Original five
    expect(getByText("Tax-compliant")).toBeInTheDocument();
    expect(getByText("UPI · Card · Cash")).toBeInTheDocument();
    expect(getByText("English + Tamil + more")).toBeInTheDocument();
    expect(getByText("Thermal printer")).toBeInTheDocument();
    expect(getByText("Multi-warehouse")).toBeInTheDocument();

    // Five new proof points
    expect(getByText("Offline desktop app")).toBeInTheDocument();
    expect(getByText("GST & e-Invoice ready")).toBeInTheDocument();
    expect(getByText("Barcode scanning")).toBeInTheDocument();
    expect(getByText("Split-payment support")).toBeInTheDocument();
    expect(getByText("30-day free trial")).toBeInTheDocument();
  });
});
