// Universal brand-identity constants — safe to import from server or client.
// For locale-aware brand display in client UI, prefer next-intl
// `useTranslations('common').appName` so Tamil locale renders the native mark.
//
// Plain source — NOT generated. Keep in sync with the dashboard's brand.ts on
// rebrand (the two repos drift only when the brand identity changes).

export const BRAND_NAME = "Tiram";
export const BRAND_NAME_NATIVE = "திறம்";
export const BRAND_LEGAL = "Tiram Technologies Private Limited";
export const BRAND_TAGLINE = "Run your business with clarity and capability.";
export const SUPPORT_EMAIL = "tiram.business@gmail.com";
export const SUPPORT_WHATSAPP_NUMBER = "+918667765616";
export const SUPPORT_WHATSAPP_URL = `https://wa.me/${SUPPORT_WHATSAPP_NUMBER.replace(
  /^\+/,
  "",
)}`;
export const DOMAIN = "tiram.co.in";
export const SITE_URL = "https://tiram.co.in";

export function supportWhatsappUrl(message: string): string {
  return `${SUPPORT_WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
}
