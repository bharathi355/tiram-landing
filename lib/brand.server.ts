// Server-only re-export of ./brand. Use this in JSON-LD, sitemap, robots, and
// any other surface that must NOT bundle into client JS. The values are
// identical to ./brand — only the import boundary differs.

import "server-only";

export {
  BRAND_NAME,
  BRAND_NAME_NATIVE,
  BRAND_LEGAL,
  BRAND_TAGLINE,
  SUPPORT_EMAIL,
  DOMAIN,
  SITE_URL,
} from "./brand";
