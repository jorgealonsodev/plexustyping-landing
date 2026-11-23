/**
 * JSON-LD builders (docs/seo-2026.md §A, §B7). Each returns one node; a page puts its nodes in a
 * single `graph(...)` passed to the base layout's `jsonLd` prop.
 * - WebSite + Organization: Spanish home only (site-name markup cannot be set per subdirectory).
 * - SoftwareApplication: home and /descargar; never with invented ratings or reviews.
 * - BreadcrumbList: docs and feature pages (the layouts add it).
 * - TechArticle: docs pages (DocsLayout adds it).
 * - FAQPage / HowTo: no rich result any more (2026-05 and 2023); harmless data, optional.
 */
import { APP_LICENSES, APP_REPO_URL, GITHUB_OWNER_URL, SITE_NAME } from "../../data/site";
import { type Locale, localizePath } from "../../i18n/paths";
import type { Release } from "../release";

export type JsonLdNode = Record<string, unknown>;

const abs = (site: URL, path: string) => new URL(path, site).href;
const ids = (site: URL) => ({
  organization: abs(site, "/#organization"),
  website: abs(site, "/#website"),
  software: abs(site, "/#software"),
});
/** Calendar date of a Date or ISO string, as shown on the page ("YYYY-MM-DD"). */
export const isoDate = (d: Date | string) => (typeof d === "string" ? new Date(d) : d).toISOString().slice(0, 10);

export function graph(...nodes: JsonLdNode[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

/** JSON for a <script type="application/ld+json">, with `<` escaped so it can never end the element. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function websiteNode(site: URL, locale: Locale): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": ids(site).website,
    name: SITE_NAME,
    alternateName: "Plexus Typing",
    url: abs(site, "/"),
    inLanguage: locale,
    publisher: { "@id": ids(site).organization },
  };
}

export function organizationNode(site: URL): JsonLdNode {
  return {
    "@type": "Organization",
    "@id": ids(site).organization,
    name: SITE_NAME,
    url: abs(site, "/"),
    logo: { "@type": "ImageObject", url: abs(site, "/og/logo.png"), width: 512, height: 512 },
    sameAs: [APP_REPO_URL, GITHUB_OWNER_URL],
  };
}

export interface SoftwareExtras {
  featureList?: string[];
  /** Absolute or site-relative URLs of real screenshots (never invented ones). */
  screenshot?: string[];
}

export function softwareApplicationNode(site: URL, release: Release, locale: Locale, extras: SoftwareExtras = {}): JsonLdNode {
  const node: JsonLdNode = {
    "@type": "SoftwareApplication",
    "@id": ids(site).software,
    name: SITE_NAME,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Linux, Windows",
    softwareVersion: release.version,
    datePublished: isoDate(release.publishedAt),
    downloadUrl: abs(site, localizePath("/descargar", locale)),
    url: abs(site, localizePath("/", locale)),
    isAccessibleForFree: true,
    inLanguage: "es",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    license: APP_LICENSES.map((l) => l.url),
    sameAs: [APP_REPO_URL],
    publisher: { "@id": ids(site).organization },
  };
  if (extras.featureList?.length) node.featureList = extras.featureList;
  if (extras.screenshot?.length) node.screenshot = extras.screenshot.map((s) => abs(site, s));
  return node;
}

export interface Crumb {
  name: string;
  /** Localized site path, e.g. "/docs" or "/en/docs". */
  path: string;
}

export function breadcrumbListNode(site: URL, crumbs: Crumb[]): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: abs(site, c.path) })),
  };
}

export interface ArticleInput {
  /** Localized path of the page. */
  path: string;
  headline: string;
  description: string;
  locale: Locale;
  datePublished: Date;
  dateModified: Date;
}

export function techArticleNode(site: URL, a: ArticleInput): JsonLdNode {
  return {
    "@type": "TechArticle",
    headline: a.headline,
    description: a.description,
    inLanguage: a.locale,
    url: abs(site, a.path),
    mainEntityOfPage: abs(site, a.path),
    datePublished: isoDate(a.datePublished),
    dateModified: isoDate(a.dateModified),
    author: { "@id": ids(site).organization },
    publisher: { "@id": ids(site).organization },
    isPartOf: { "@id": ids(site).website },
    about: { "@id": ids(site).software },
  };
}

export function faqPageNode(items: { question: string; answer: string }[]): JsonLdNode {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };
}

export function howToNode(h: { name: string; steps: { name: string; text: string }[] }): JsonLdNode {
  return {
    "@type": "HowTo",
    name: h.name,
    step: h.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })),
  };
}
