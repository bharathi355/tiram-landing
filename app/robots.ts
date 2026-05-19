import type { MetadataRoute } from "next";
import { SITE_URL as DEFAULT_SITE_URL } from "@/lib/brand.server";
import { resolveOrigin } from "@/lib/env-url";

const SITE_URL = resolveOrigin("NEXT_PUBLIC_SITE_URL", DEFAULT_SITE_URL);

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
