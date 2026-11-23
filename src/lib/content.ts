/**
 * Read helpers over the content collections (src/content.config.ts): ordering, URLs, the docs
 * sidebar, and the GitHub links every docs page carries (PRD §7).
 */
import { type CollectionEntry, getCollection } from "astro:content";
import { DOCS_SECTION_KEYS, DOCS_SECTIONS, type DocsSection } from "../data/docs-sections";
import { SITE_REPO_BRANCH, SITE_REPO_URL } from "../data/site";
import { type Locale, localizePath } from "../i18n/paths";

export type DocEntry = CollectionEntry<"docs">;

/** Id without the language folder: "en/empezar/instalar" -> "empezar/instalar". */
export const docSlug = (entry: DocEntry) => entry.id.replace(/^en\//, "");

/** Localized URL path of a documentation page. */
export const docPath = (entry: DocEntry) => localizePath(`/docs/${docSlug(entry)}`, entry.data.lang);

/** Localized URL path of a feature page. */
export const featurePath = (slug: string, locale: Locale) => localizePath(`/funciones/${slug}`, locale);

/** Fragment id of a version's section on /novedades: "0.1.0" -> "v0-1-0". */
export const releaseAnchor = (version: string) => `v${version.replaceAll(".", "-")}`;

const sectionIndex = (s: DocsSection) => DOCS_SECTION_KEYS.indexOf(s);

/** Documentation pages of one language, in sidebar order (section, then `order`). */
export async function getDocs(locale: Locale = "es"): Promise<DocEntry[]> {
  const all = await getCollection("docs", (e) => e.data.lang === locale);
  return all.sort((a, b) => sectionIndex(a.data.section) - sectionIndex(b.data.section) || a.data.order - b.data.order);
}

export interface SidebarSection {
  key: DocsSection;
  label: string;
  items: { label: string; href: string; current: boolean }[];
}

/** Sidebar groups for the docs layout; sections without pages are left out. */
export async function docsSidebar(locale: Locale, currentPath: string): Promise<SidebarSection[]> {
  const docs = await getDocs(locale);
  return DOCS_SECTION_KEYS.map((key) => ({
    key,
    label: DOCS_SECTIONS[key][locale],
    items: docs
      .filter((d) => d.data.section === key)
      .map((d) => ({ label: d.data.sidebarLabel ?? d.data.h1 ?? d.data.title, href: docPath(d), current: docPath(d) === currentPath })),
  })).filter((s) => s.items.length > 0);
}

/** "Editar en GitHub" link of a repository file ("src/content/docs/empezar/instalar.md"). */
export const editUrl = (repoPath: string) => `${SITE_REPO_URL}/edit/${SITE_REPO_BRANCH}/${repoPath.replace(/^\.?\//, "")}`;

/** "¿Te ha ayudado?" link: a prefilled issue on the site repository (no third-party analytics). */
export function feedbackUrl(pageTitle: string, pageUrl: string, locale: Locale): string {
  const title = locale === "es" ? `Documentación: ${pageTitle}` : `Docs: ${pageTitle}`;
  const body =
    locale === "es"
      ? `Página: ${pageUrl}\n\n¿Te ha ayudado? (sí / no)\n\n¿Qué faltaba o qué estaba mal?\n`
      : `Page: ${pageUrl}\n\nDid this help? (yes / no)\n\nWhat was missing or wrong?\n`;
  return `${SITE_REPO_URL}/issues/new?${new URLSearchParams({ title, body }).toString()}`;
}

export async function getFeatures(locale: Locale = "es") {
  const all = await getCollection("features", (e) => e.data.lang === locale);
  return all.sort((a, b) => a.data.order - b.data.order);
}

/** Releases, newest first. */
export async function getReleases(locale: Locale = "es") {
  const all = await getCollection("releases", (e) => e.data.lang === locale);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getFaq(locale: Locale = "es") {
  const all = await getCollection("faq", (e) => e.data.lang === locale);
  return all.sort((a, b) => a.data.order - b.data.order);
}
