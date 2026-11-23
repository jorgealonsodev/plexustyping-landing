/**
 * URL helpers for the two site languages (PRD §5, §14): Spanish at the root with no prefix, English
 * under `/en` with English slugs (src/i18n/slugs.ts holds the one mapping), and never a trailing slash.
 * A "language-neutral" path is the Spanish one: pages and layouts pass it, and these helpers localize it.
 */
import { englishSitePath, isEnglishPath, neutralPath } from "./slugs.ts";

export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";

/** `path` without query, hash, `.html` suffix (build.format "file") or trailing slash; always starts with "/". */
export function normalizePath(path: string): string {
  let clean = path.split(/[?#]/, 1)[0] ?? "/";
  if (!clean.startsWith("/")) clean = `/${clean}`;
  clean = clean.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
  if (clean.length > 1) clean = clean.replace(/\/+$/, "");
  return clean || "/";
}

/** The language a site path belongs to. */
export function localeFromPath(path: string): Locale {
  return isEnglishPath(normalizePath(path)) ? "en" : "es";
}

/** The language-neutral (Spanish) path: `/en/download` and `/descargar` both give `/descargar`. */
export function basePath(path: string): string {
  return neutralPath(normalizePath(path));
}

/** `path` (language-neutral or already localized) in `locale`. */
export function localizePath(path: string, locale: Locale): string {
  const base = basePath(path);
  return locale === "es" ? base : englishSitePath(base);
}

/** The same page in the other language, for the language switch. */
export function mirrorPath(path: string): string {
  return localizePath(path, localeFromPath(path) === "es" ? "en" : "es");
}
