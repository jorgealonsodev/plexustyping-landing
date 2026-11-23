/**
 * Text of /llms.txt and /llms-full.txt (PRD §10.2, docs/seo-2026.md §B11; format of llmstxt.org):
 * an H1 with the name, a blockquote summary, short notes, then H2 sections of Markdown links.
 * The full version adds every documentation body. Pure functions over plain data, so the endpoints
 * (src/pages/llms.txt.ts, src/pages/llms-full.txt.ts) only gather the collections.
 */

export interface LlmsLink {
  title: string;
  /** Site path, e.g. "/descargar". */
  path: string;
  description?: string;
}

export interface LlmsDoc extends LlmsLink {
  /** Section label, e.g. "Empezar". */
  section: string;
  /** Markdown or MDX source of the page body. */
  body: string;
}

export interface LlmsRelease {
  version: string;
  date: Date;
  summary: string;
  /** Path of its section on /novedades. */
  path: string;
  github: string;
}

export interface LlmsFaq {
  question: string;
  /** Plain-text answer. */
  answer: string;
  /** Path of the documentation page the answer links to. */
  path: string;
}

export interface LlmsData {
  site: URL;
  name: string;
  summary: string;
  /** Short paragraphs after the summary. */
  intro: string[];
  pages: LlmsLink[];
  features: LlmsLink[];
  docs: LlmsDoc[];
  releases: LlmsRelease[];
  faq: LlmsFaq[];
  /** The English mirror under /en (site-pages S7): links only, listed after the Spanish index. */
  english?: LlmsEnglish;
}

export interface LlmsEnglish {
  /** One line under the "English version" heading. */
  note: string;
  pages: LlmsLink[];
  features: LlmsLink[];
  docs: LlmsLink[];
}

const abs = (site: URL, path: string) => new URL(path, site).href;
const day = (d: Date) => d.toISOString().slice(0, 10);
const link = (site: URL, l: LlmsLink) => `- [${l.title}](${abs(site, l.path)})${l.description ? `: ${l.description}` : ""}`;

function head(d: LlmsData): string[] {
  return [`# ${d.name}`, "", `> ${d.summary}`, "", ...d.intro.flatMap((p) => [p, ""])];
}

function section(title: string, lines: string[]): string[] {
  return lines.length ? [`## ${title}`, "", ...lines, ""] : [];
}

/** Docs grouped by section label, keeping the input (sidebar) order. */
function bySection(docs: LlmsDoc[]): [string, LlmsDoc[]][] {
  const groups = new Map<string, LlmsDoc[]>();
  for (const doc of docs) groups.set(doc.section, [...(groups.get(doc.section) ?? []), doc]);
  return [...groups];
}

/** The English mirror's links, at the end of both files. */
function englishSection(d: LlmsData): string[] {
  const en = d.english;
  if (!en) return [];
  return [
    "## English version",
    "",
    en.note,
    "",
    ...en.pages.map((p) => link(d.site, p)),
    ...en.features.map((f) => link(d.site, f)),
    ...en.docs.map((x) => link(d.site, x)),
    "",
  ];
}

const releaseLine = (site: URL, r: LlmsRelease) =>
  link(site, { title: `PlexusTyping ${r.version} (${day(r.date)})`, path: r.path, description: r.summary });

/** /llms.txt: the index. */
export function buildLlmsTxt(d: LlmsData): string {
  const out = [
    ...head(d),
    `Versión completa, con el texto de toda la documentación: ${abs(d.site, "/llms-full.txt")}`,
    "",
    ...section("Páginas", d.pages.map((p) => link(d.site, p))),
    ...section("Funciones", d.features.map((f) => link(d.site, f))),
    ...bySection(d.docs).flatMap(([label, docs]) => section(`Documentación: ${label}`, docs.map((x) => link(d.site, x)))),
    ...section("Novedades", d.releases.map((r) => releaseLine(d.site, r))),
    ...section("Preguntas frecuentes", d.faq.map((q) => link(d.site, { title: q.question, path: q.path }))),
    ...englishSection(d),
  ];
  return `${out.join("\n").trimEnd()}\n`;
}

/**
 * MDX source as plain Markdown for the full file: ESM import/export lines and capitalized JSX
 * component lines are dropped, site-relative links become absolute, headings go one level down
 * (each document sits under its own H2). Fenced code is left untouched.
 */
export function mdxToMarkdown(src: string, site: URL): string {
  const out: string[] = [];
  let fence = false;
  for (const line of src.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      fence = !fence;
      out.push(line);
      continue;
    }
    if (fence) {
      out.push(line);
      continue;
    }
    if (/^(import|export)\s/.test(line)) continue;
    if (/^\s*<\/?[A-Z][\w.]*(\s[^>]*)?\/?>\s*$/.test(line)) continue;
    out.push(
      line
        .replace(/^(#{1,5})(\s)/, "#$1$2")
        .replace(/\]\((\/[^)\s]*)\)/g, (_, p: string) => `](${abs(site, p)})`),
    );
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

/** /llms-full.txt: the index header, then every documentation page in full, the FAQ and the releases. */
export function buildLlmsFullTxt(d: LlmsData): string {
  const docs = d.docs.flatMap((x) => [
    `## ${x.title}`,
    "",
    `URL: ${abs(d.site, x.path)}`,
    `Sección: ${x.section}`,
    "",
    ...(x.description ? [x.description, ""] : []),
    mdxToMarkdown(x.body, d.site),
    "",
  ]);
  const faq = d.faq.flatMap((q) => [`### ${q.question}`, "", q.answer, "", `Más información: ${abs(d.site, q.path)}`, ""]);
  const releases = d.releases.flatMap((r) => [
    `### PlexusTyping ${r.version} (${day(r.date)})`,
    "",
    r.summary,
    "",
    `Notas: ${abs(d.site, r.path)} · GitHub: ${r.github}`,
    "",
  ]);
  const out = [
    ...head(d),
    `Índice: ${abs(d.site, "/llms.txt")}`,
    "",
    ...section("Páginas", d.pages.map((p) => link(d.site, p))),
    ...section("Funciones", d.features.map((f) => link(d.site, f))),
    ...docs,
    ...(faq.length ? ["## Preguntas frecuentes", "", ...faq] : []),
    ...(releases.length ? ["## Novedades", "", ...releases] : []),
    ...englishSection(d),
  ];
  return `${out.join("\n").trimEnd()}\n`;
}
