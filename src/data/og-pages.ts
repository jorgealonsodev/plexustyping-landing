/**
 * Open Graph cards of standalone pages (download, release notes, FAQ, privacy, licences…).
 * A page registers its card here and passes `ogImage={ogImagePath(slug)}` to its layout; docs and
 * feature pages get theirs automatically from their collections (src/lib/og/cards.ts).
 * `slug` is the image path under /og without ".png", e.g. "descargar" or "en/descargar".
 */
import type { Locale } from "../i18n/paths";

export interface OgPageCard {
  slug: string;
  title: string;
  eyebrow?: string;
  locale: Locale;
}

export const OG_PAGES: OgPageCard[] = [];
