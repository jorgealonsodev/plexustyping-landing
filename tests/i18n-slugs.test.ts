/**
 * English URL scheme of the mirror (odd/tasks/site-pages.md S7, PRD §5): English slugs under /en, one
 * mapping module (src/i18n/slugs.ts) read by the language switch, hreflang, the sitemap and the on-page
 * check. Every Spanish route has exactly one English counterpart and back (the content files that build
 * those routes are compared in tests/i18n-mirror-content.test.ts).
 */
import { existsSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { DOCS_SECTION_KEYS } from "../src/data/docs-sections";
import { FEATURE_SLUGS, ROUTES } from "../src/data/routes";
import { basePath, localizePath, mirrorPath } from "../src/i18n/paths";
import { DOCS_PAGE_SLUGS, DOCS_SECTION_SLUGS, englishPath, FEATURE_PAGE_SLUGS, spanishPath, TOP_SLUGS } from "../src/i18n/slugs";

const CONTENT = join(import.meta.dirname, "..", "src", "content");

function files(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) files(p, out);
    else if (/^[^_].*\.mdx?$/.test(e.name)) out.push(p);
  }
  return out;
}
/** Ids of a collection by language: "empezar/primer-arranque" for both es and en/… files. */
function ids(collection: string) {
  const root = join(CONTENT, collection);
  const all = files(root).map((f) => relative(root, f).replace(/\.mdx?$/, ""));
  return {
    es: all.filter((id) => !id.startsWith("en/")).sort(),
    en: all.filter((id) => id.startsWith("en/")).map((id) => id.slice(3)).sort(),
  };
}

const SPANISH_ROUTES: string[] = [
  ...Object.values(ROUTES),
  ...FEATURE_SLUGS.map((s) => `/funciones/${s}`),
  ...ids("docs").es.map((id) => `/docs/${id}`),
];

describe("language switch with English slugs (S7)", () => {
  it.each([
    ["/", "/en"],
    ["/descargar", "/en/download"],
    ["/funciones", "/en/features"],
    ["/funciones/ia", "/en/features/ai"],
    ["/funciones/distribuciones-e-idiomas", "/en/features/layouts-and-languages"],
    ["/docs", "/en/docs"],
    ["/docs/empezar/instalar-linux-deb", "/en/docs/getting-started/install-linux-deb"],
    ["/docs/ia/que-se-envia", "/en/docs/ai/what-is-sent"],
    ["/novedades", "/en/release-notes"],
    ["/preguntas-frecuentes", "/en/faq"],
    ["/privacidad", "/en/privacy"],
    ["/licencias", "/en/licenses"],
    ["/rss.xml", "/en/rss.xml"],
    ["/sim-preview/s2", "/en/sim-preview/s2"],
  ])("%s <-> %s", (es, en) => {
    expect(mirrorPath(es)).toBe(en);
    expect(mirrorPath(en)).toBe(es);
    expect(localizePath(es, "en")).toBe(en);
    expect(localizePath(en, "es")).toBe(es);
    expect(basePath(en)).toBe(es);
  });

  it("keeps the fragment-free, slash-free form on input variants", () => {
    expect(mirrorPath("/descargar/")).toBe("/en/download");
    expect(mirrorPath("/en/download.html")).toBe("/descargar");
    expect(mirrorPath("/en/docs/getting-started/first-launch#x")).toBe("/docs/empezar/primer-arranque");
  });

  it("maps unknown segments unchanged, so a mistyped path stays recognisable", () => {
    expect(englishPath("/docs/empezar/no-existe")).toBe("/docs/getting-started/no-existe");
    expect(spanishPath("/docs/getting-started/no-existe")).toBe("/docs/empezar/no-existe");
    expect(mirrorPath("/enlaces")).toBe("/en/enlaces");
  });
});

describe("slug map completeness and uniqueness (S7, S10)", () => {
  it("names every top route, feature page, docs section and docs page", () => {
    for (const r of Object.values(ROUTES)) {
      const seg = r.split("/")[1] ?? "";
      if (r !== "/" && !r.includes(".")) expect(TOP_SLUGS, r).toHaveProperty(seg);
    }
    for (const f of FEATURE_SLUGS) expect(FEATURE_PAGE_SLUGS, f).toHaveProperty(f);
    for (const s of DOCS_SECTION_KEYS) expect(DOCS_SECTION_SLUGS, s).toHaveProperty(s);
    for (const id of ids("docs").es) {
      const [s = "", p = ""] = id.split("/");
      expect(DOCS_PAGE_SLUGS[s as keyof typeof DOCS_PAGE_SLUGS], id).toHaveProperty(p);
    }
  });

  it("maps no two Spanish routes to the same English route, and round-trips each one", () => {
    const english = SPANISH_ROUTES.map((p) => localizePath(p, "en"));
    expect(new Set(english).size).toBe(english.length);
    for (const p of SPANISH_ROUTES) expect(localizePath(localizePath(p, "en"), "es")).toBe(p);
  });

  it("uses lowercase ASCII kebab-case English slugs", () => {
    for (const p of SPANISH_ROUTES) {
      for (const seg of localizePath(p, "en").split("/").filter(Boolean)) expect(seg, p).toMatch(/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/);
    }
  });
});
