import { ImageResponse } from "next/og";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand.server";

export const alt = "Tiram — Billing & inventory software for businesses worldwide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #312e81 100%)",
          color: "#f8fafc",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 420,
            height: 420,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(99,102,241,0.55), rgba(99,102,241,0) 70%)",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: -160,
            left: -100,
            width: 480,
            height: 480,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(168,85,247,0.45), rgba(168,85,247,0) 70%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            T
          </div>
          <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: -0.5 }}>
            {BRAND_NAME}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              letterSpacing: -1.5,
              lineHeight: 1.05,
              maxWidth: 980,
            }}
          >
            Billing & inventory software for businesses worldwide.
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 400,
              color: "#cbd5e1",
              maxWidth: 900,
              lineHeight: 1.35,
            }}
          >
            {BRAND_TAGLINE}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            color: "#94a3b8",
          }}
        >
          <span>Tax-compliant invoicing</span>
          <span>·</span>
          <span>Multi-warehouse inventory</span>
          <span>·</span>
          <span>English + Tamil</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
