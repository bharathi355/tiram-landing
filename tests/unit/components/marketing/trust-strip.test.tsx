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

vi.mock("@/components/marketing/motion", () => ({
  Marquee: ({ children, className }: { children: ReactNode; className?: string }) => (
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
});
