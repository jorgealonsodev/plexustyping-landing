/**
 * URL helpers for the two site languages (PRD §5, §14): Spanish at the root with no prefix,
 * English mirrored under `/en`, the same slugs in both, and never a trailing slash.
 */
export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";

const EN_PREFIX = "/en";

/** `path` without query, hash, `.html` suffix (build.format "file") or trailing slash; always starts with "/". */
export function normalizePath(path: string): string {
  let clean = path.split(/[?#]/, 1)[0] ?? "/";
  if (!clean.startsWith("/")) clean = `/${clean}`;
  clean = clean.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
  if (clean.length > 1) clean = clean.replace(/\/+$/, "");
  return clean || "/";
}

const isEnglish = (clean: string) => clean === EN_PREFIX || clean.startsWith(`${EN_PREFIX}/`);

/** The language a site path belongs to. */
export function localeFromPath(path: string): Locale {
  return isEnglish(normalizePath(path)) ? "en" : "es";
}

/** The language-neutral part of a path: `/en/descargar` and `/descargar` both give `/descargar`. */
export function basePath(path: string): string {
  const clean = normalizePath(path);
  if (!isEnglish(clean)) return clean;
  return clean.slice(EN_PREFIX.length) || "/";
}

/** `path` (language-neutral or already localized) in `locale`. */
export function localizePath(path: string, locale: Locale): string {
  const base = basePath(path);
  if (locale === "es") return base;
  return base === "/" ? EN_PREFIX : `${EN_PREFIX}${base}`;
}

/** The same page in the other language, for the language switch. */
export function mirrorPath(path: string): string {
  return localizePath(path, localeFromPath(path) === "es" ? "en" : "es");
}
