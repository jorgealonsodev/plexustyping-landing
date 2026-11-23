/** Locale-aware formatting (PRD §14: dates, numbers and units by language). */
import type { Locale } from "../i18n/paths";

const TAG: Record<Locale, string> = { es: "es-ES", en: "en-GB" };

/** "19 de noviembre de 2026" / "19 November 2026" (UTC, so a date never shifts by time zone). */
export function formatDate(date: Date | string, locale: Locale): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(TAG[locale], { dateStyle: "long", timeZone: "UTC" }).format(d);
}

/** File size in MB (1 MB = 1 048 576 bytes), one decimal: "11,8 MB" / "11.8 MB". */
export function formatBytes(bytes: number, locale: Locale): string {
  const mb = bytes / 1048576;
  return `${new Intl.NumberFormat(TAG[locale], { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(mb)} MB`;
}
