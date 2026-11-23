/**
 * FAQ helpers for /preguntas-frecuentes: the FAQPage JSON-LD answer is the visible answer as plain
 * text (docs/seo-2026.md §A: no rich result since 2026-05, kept as harmless data).
 */

/** Markdown answer as one line of plain text: links keep their text, emphasis and code marks go. */
export function markdownToPlainText(md: string): string {
  return md
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/(\*|_)(.+?)\1/g, "$2")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, "")
    .replace(/^#+\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function faqJsonLdItems(entries: { question: string; body: string }[]) {
  return entries.map((e) => ({ question: e.question, answer: markdownToPlainText(e.body) }));
}
