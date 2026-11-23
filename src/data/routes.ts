/**
 * Language-neutral routes of the site (PRD §5). Nav, footer and the on-page check read them.
 * Imported with an explicit `.ts` extension by scripts/check-onpage.ts (run by Node directly), so this
 * file must stay free of imports and of non-erasable TypeScript syntax.
 */
export const ROUTES = {
  home: "/",
  download: "/descargar",
  features: "/funciones",
  docs: "/docs",
  news: "/novedades",
  faq: "/preguntas-frecuentes",
  privacy: "/privacidad",
  licenses: "/licencias",
  rss: "/rss.xml",
} as const;

/** The nine feature pages of PRD §5, in nav order; the slug is the URL segment under /funciones. */
export const FEATURE_SLUGS = [
  "motor-adaptativo",
  "ia",
  "texto-ilimitado",
  "metronomo",
  "modo-codigo",
  "distribuciones-e-idiomas",
  "accesibilidad",
  "personalizacion",
  "progreso",
] as const;
export type FeatureSlug = (typeof FEATURE_SLUGS)[number];

/** Every page PRD §5 promises. A link to one that is not built yet is "pending", not broken. */
export const PLANNED_ROUTES: readonly string[] = [
  ...Object.values(ROUTES),
  ...FEATURE_SLUGS.map((s) => `/funciones/${s}`),
  "/llms.txt",
  "/llms-full.txt",
  "/robots.txt",
  "/sitemap-index.xml",
];

/**
 * Path prefixes whose pages are planned as a whole: every documentation page (PRD §7) and the
 * English mirror (spec S7). Links into them are pending until the page exists.
 */
export const PLANNED_PREFIXES: readonly string[] = ["/docs/", "/en/"];

/** Page templates of docs/seo-2026.md §C, written to <body data-page-type> and enforced by the on-page check. */
export const PAGE_TYPES = [
  "home",
  "feature",
  "feature-index",
  "download",
  "docs",
  "docs-index",
  "faq",
  "release-notes",
  "prose",
] as const;
export type PageType = (typeof PAGE_TYPES)[number];

/** Pages and path prefixes that are never indexed (robots noindex) and stay out of the sitemap. */
export const NOINDEX_PATHS: readonly string[] = ["/404", "/sim-preview", "/en/sim-preview"];
