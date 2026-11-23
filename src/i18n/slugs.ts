/**
 * English slugs of the mirror (odd/tasks/site-pages.md S7). PRD §5 puts English under /en/ ("Espejo en
 * inglés") without naming its slugs, so English pages use English slugs and this module is the single
 * mapping between both URL schemes: the language switch, canonical and hreflang (src/i18n/paths.ts), the
 * sitemap filter (src/data/routes.ts), the sitemap lastmod (src/lib/lastmod.ts) and the on-page check
 * (src/lib/onpage/check.ts) all read it.
 *
 * Paths here are language-neutral paths without the /en prefix: englishPath("/descargar") is "/download"
 * and spanishPath("/download") is "/descargar". A segment the map does not know passes through unchanged
 * (previews, feeds, a mistyped page), so a translation never invents a target.
 *
 * Imported by Node directly (scripts/check-onpage.ts through the on-page check), so this file has no
 * imports and uses only erasable TypeScript syntax.
 */

/** First path segment: Spanish -> English. */
export const TOP_SLUGS = {
  descargar: "download",
  funciones: "features",
  docs: "docs",
  novedades: "release-notes",
  "preguntas-frecuentes": "faq",
  privacidad: "privacy",
  licencias: "licenses",
} as const;

/** Feature pages under /funciones (PRD §5): Spanish slug -> English slug. */
export const FEATURE_PAGE_SLUGS = {
  "motor-adaptativo": "adaptive-engine",
  ia: "ai",
  "texto-ilimitado": "unlimited-text",
  metronomo: "metronome",
  "modo-codigo": "code-mode",
  "distribuciones-e-idiomas": "layouts-and-languages",
  accesibilidad: "accessibility",
  personalizacion: "personalization",
  progreso: "progress",
} as const;

/** Documentation sections under /docs (S10): Spanish -> English. */
export const DOCS_SECTION_SLUGS = {
  empezar: "getting-started",
  practicar: "practice",
  "motor-adaptativo": "adaptive-engine",
  ia: "ai",
  metronomo: "metronome",
  "teclado-e-idiomas": "keyboard-and-languages",
  progreso: "progress",
  personalizacion: "personalization",
  accesibilidad: "accessibility",
  ajustes: "settings",
  referencia: "reference",
  ayuda: "help",
  proyecto: "project",
} as const;

/** Documentation pages per section (S10): Spanish page slug -> English page slug. */
export const DOCS_PAGE_SLUGS = {
  empezar: {
    "que-es-plexustyping": "what-is-plexustyping",
    "instalar-linux-deb": "install-linux-deb",
    "instalar-linux-tar": "install-linux-tar",
    "instalar-windows": "install-windows",
    "verificar-descarga": "verify-download",
    "primer-arranque": "first-launch",
    "actualizar-y-desinstalar": "update-and-uninstall",
  },
  practicar: {
    modos: "modes",
    "longitud-y-texto-ilimitado": "length-and-unlimited-text",
    "modos-de-error": "error-modes",
    "objetivos-y-puntos-debiles": "targets-and-weak-spots",
    "sesion-fantasma": "ghost-session",
    "desbloqueo-progresivo": "progressive-unlock",
    "meta-diaria-y-racha": "daily-goal-and-streak",
  },
  "motor-adaptativo": {
    "como-mide-tus-debilidades": "how-it-measures-weak-spots",
    "como-elige-los-textos": "how-it-picks-texts",
    "mapa-de-calor": "heatmap",
  },
  ia: {
    "activar-la-ia": "turn-on-ai",
    "proveedores-y-claves": "providers-and-keys",
    "iniciar-sesion-con-chatgpt": "sign-in-with-chatgpt",
    "respaldo-cache-y-uso": "fallback-cache-and-usage",
    "que-se-envia": "what-is-sent",
  },
  metronomo: {
    "uso-basico": "basics",
    "panel-rapido": "quick-panel",
    "tempo-adaptativo": "adaptive-tempo",
  },
  "teclado-e-idiomas": {
    distribuciones: "layouts",
    "idiomas-del-texto": "text-languages",
    "teclado-visual-y-destellos": "on-screen-keyboard-and-flashes",
  },
  progreso: {
    "historial-y-graficas": "history-and-charts",
    "exportar-csv": "export-csv",
    perfiles: "profiles",
  },
  personalizacion: {
    "temas-y-vscode": "themes-and-vs-code",
    fuentes: "fonts",
    cursor: "cursor",
    tipografia: "typography",
    "texto-pendiente-atenuado": "dimmed-pending-text",
  },
  accesibilidad: {
    teclado: "keyboard",
    "lector-de-pantalla": "screen-reader",
    "modo-daltonico": "color-blind-mode",
    "alto-contraste": "high-contrast",
    "movimiento-reducido": "reduced-motion",
  },
  ajustes: {
    "mapa-de-ajustes": "settings-map",
    buscador: "settings-search",
    "donde-se-guardan-los-datos": "where-data-is-stored",
  },
  referencia: {
    "atajos-de-teclado": "keyboard-shortcuts",
    glosario: "glossary",
    "requisitos-del-sistema": "system-requirements",
  },
  ayuda: {
    "preguntas-frecuentes": "faq",
    "solucion-de-problemas": "troubleshooting",
    "informar-de-un-error": "report-a-bug",
  },
  proyecto: {
    privacidad: "privacy",
    "licencias-y-creditos": "licenses-and-credits",
    "codigo-fuente-y-contribuir": "source-code-and-contributing",
    "notas-de-version": "release-notes",
  },
} as const;

type Table = Readonly<Record<string, string>>;

const invert = (t: Table): Table => Object.fromEntries(Object.entries(t).map(([k, v]) => [v, k]));
const pick = (t: Table, seg: string): string => (Object.hasOwn(t, seg) ? (t[seg] as string) : seg);

const PAGES: Readonly<Record<string, Table>> = DOCS_PAGE_SLUGS;
const TOP_EN = invert(TOP_SLUGS);
const FEATURES_EN = invert(FEATURE_PAGE_SLUGS);
const SECTIONS_EN = invert(DOCS_SECTION_SLUGS);
const PAGES_EN: Readonly<Record<string, Table>> = Object.fromEntries(
  Object.entries(PAGES).map(([section, pages]) => [pick(DOCS_SECTION_SLUGS, section), invert(pages)]),
);

/** Translates the segments of a neutral path with the tables of one direction. */
function translate(path: string, top: Table, features: Table, sections: Table, pages: Readonly<Record<string, Table>>): string {
  const [first = "", second, third, ...rest] = path.split("/").filter(Boolean);
  if (!first) return "/";
  const out = [pick(top, first)];
  const neutralFirst = top === TOP_EN ? pick(top, first) : first;
  if (second !== undefined) {
    if (neutralFirst === "funciones") out.push(pick(features, second));
    else if (neutralFirst === "docs") out.push(pick(sections, second));
    else out.push(second);
  }
  if (third !== undefined) {
    const table = neutralFirst === "docs" && second !== undefined ? pages[second] : undefined;
    out.push(table ? pick(table, third) : third);
  }
  out.push(...rest);
  return `/${out.join("/")}`;
}

/** English path (without /en) of a Spanish neutral path: "/docs/ia/que-se-envia" -> "/docs/ai/what-is-sent". */
export function englishPath(spanish: string): string {
  return translate(spanish, TOP_SLUGS, FEATURE_PAGE_SLUGS, DOCS_SECTION_SLUGS, PAGES);
}

/** Spanish neutral path of an English path without /en: "/docs/ai/what-is-sent" -> "/docs/ia/que-se-envia". */
export function spanishPath(english: string): string {
  return translate(english, TOP_EN, FEATURES_EN, SECTIONS_EN, PAGES_EN);
}

/** True for "/en" and paths under "/en/". */
export const isEnglishPath = (p: string) => p === "/en" || p.startsWith("/en/");

/** Spanish neutral path of any site path, Spanish or English: "/en/download" -> "/descargar". */
export function neutralPath(p: string): string {
  return isEnglishPath(p) ? spanishPath(p.slice(3) || "/") : p;
}

/** English site path (with /en) of a Spanish neutral path: "/descargar" -> "/en/download". */
export function englishSitePath(spanish: string): string {
  const en = englishPath(spanish);
  return en === "/" ? "/en" : `/en${en}`;
}
