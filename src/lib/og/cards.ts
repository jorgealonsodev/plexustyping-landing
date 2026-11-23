/**
 * Every Open Graph card the build renders (src/pages/og/[...slug].png.ts): one generic card per
 * language, one per documentation page and feature page, and the pages registered in src/data/og-pages.ts.
 */
import { DOCS_SECTIONS } from "../../data/docs-sections";
import { OG_PAGES } from "../../data/og-pages";
import type { Locale } from "../../i18n/paths";
import { UI } from "../../i18n/ui";
import { type DocEntry, docSlug, getDocs, getFeatures } from "../content";
import type { OgCard } from "./render";

export type OgCardEntry = OgCard & { slug: string };

const prefix = (locale: Locale) => (locale === "en" ? "en/" : "");

/** Site path of a card: "descargar" -> "/og/descargar.png". */
export const ogImagePath = (slug: string) => `/og/${slug}.png`;
export const docOgImage = (entry: DocEntry) => ogImagePath(`${prefix(entry.data.lang)}docs/${docSlug(entry)}`);
export const featureOgImage = (slug: string, locale: Locale) => ogImagePath(`${prefix(locale)}funciones/${slug}`);

const DEFAULT_TITLE: Record<Locale, string> = {
  es: "Mecanografía que se adapta a tus fallos",
  en: "Typing practice that adapts to your mistakes",
};

export async function ogCards(): Promise<OgCardEntry[]> {
  const cards: OgCardEntry[] = (["es", "en"] as const).map((locale) => ({
    slug: `default-${locale}`,
    title: DEFAULT_TITLE[locale],
    locale,
  }));
  for (const locale of ["es", "en"] as const) {
    for (const d of await getDocs(locale)) {
      cards.push({
        slug: `${prefix(locale)}docs/${docSlug(d)}`,
        title: d.data.h1 ?? d.data.title,
        eyebrow: `${UI[locale].layout.docsNav} · ${DOCS_SECTIONS[d.data.section][locale]}`,
        locale,
      });
    }
    for (const f of await getFeatures(locale)) {
      cards.push({ slug: `${prefix(locale)}funciones/${f.id}`, title: f.data.h1, eyebrow: UI[locale].nav.features, locale });
    }
  }
  cards.push(...OG_PAGES);
  return cards;
}
