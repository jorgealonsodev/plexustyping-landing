/**
 * Documentation content (odd/tasks/site-pages.md S4, S10): the Spanish pages under src/content/docs
 * follow the slug contract, carry the frontmatter the docs template needs, open with a 40–60 word
 * answer, and link only to pages that exist in the contract (docs) or in PRD §5 (features, routes).
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { DOCS_SECTION_KEYS } from "../src/data/docs-sections";
import { FEATURE_SLUGS, ROUTES } from "../src/data/routes";

const ROOT = join(import.meta.dirname, "..", "src", "content", "docs");

/** S10, verbatim: /docs/<section>/<page>. */
const S10: Record<string, string[]> = {
  empezar: [
    "que-es-plexustyping",
    "instalar-linux-deb",
    "instalar-linux-tar",
    "instalar-windows",
    "verificar-descarga",
    "primer-arranque",
    "actualizar-y-desinstalar",
  ],
  practicar: [
    "modos",
    "longitud-y-texto-ilimitado",
    "modos-de-error",
    "objetivos-y-puntos-debiles",
    "sesion-fantasma",
    "desbloqueo-progresivo",
    "meta-diaria-y-racha",
  ],
  "motor-adaptativo": ["como-mide-tus-debilidades", "como-elige-los-textos", "mapa-de-calor"],
  ia: ["activar-la-ia", "proveedores-y-claves", "iniciar-sesion-con-chatgpt", "respaldo-cache-y-uso", "que-se-envia"],
  metronomo: ["uso-basico", "panel-rapido", "tempo-adaptativo"],
  "teclado-e-idiomas": ["distribuciones", "idiomas-del-texto", "teclado-visual-y-destellos"],
  progreso: ["historial-y-graficas", "exportar-csv", "perfiles"],
  personalizacion: ["temas-y-vscode", "fuentes", "cursor", "tipografia", "texto-pendiente-atenuado"],
  accesibilidad: ["teclado", "lector-de-pantalla", "modo-daltonico", "alto-contraste", "movimiento-reducido"],
  ajustes: ["mapa-de-ajustes", "buscador", "donde-se-guardan-los-datos"],
  referencia: ["atajos-de-teclado", "glosario", "requisitos-del-sistema"],
  ayuda: ["preguntas-frecuentes", "solucion-de-problemas", "informar-de-un-error"],
  proyecto: ["privacidad", "licencias-y-creditos", "codigo-fuente-y-contribuir", "notas-de-version"],
};
const CONTRACT = new Set(Object.entries(S10).flatMap(([s, pages]) => pages.map((p) => `${s}/${p}`)));
/** The sections this task (P4a) writes; the rest are written by another task and only linked. */
const P4A_SECTIONS = ["empezar", "practicar", "motor-adaptativo", "ia", "metronomo", "teclado-e-idiomas"];
const ROUTE_PATHS = new Set<string>(Object.values(ROUTES));

interface Doc {
  id: string;
  file: string;
  front: Partial<Record<string, string>>;
  body: string;
}

function walk(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/^[^_].*\.mdx?$/.test(e.name)) out.push(p);
  }
  return out;
}

function parse(file: string): Doc {
  const src = readFileSync(file, "utf8");
  const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(src);
  if (!m?.[1] || m[2] === undefined) throw new Error(`${file}: no frontmatter`);
  const front: Partial<Record<string, string>> = {};
  for (const line of m[1].split("\n")) {
    const kv = /^([a-zA-Z]+):\s*(.*)$/.exec(line);
    if (kv?.[1]) front[kv[1]] = (kv[2] ?? "").replace(/^"(.*)"$/, "$1");
  }
  return { id: relative(ROOT, file).replace(/\.mdx?$/, ""), file, front, body: m[2] };
}

/** Spanish pages (the English mirror, when it exists, lives under docs/en/). */
const docs = walk(ROOT)
  .filter((f) => !relative(ROOT, f).startsWith("en/"))
  .map(parse);
const mine = docs.filter((d) => P4A_SECTIONS.includes(d.id.split("/")[0] ?? ""));

/** First paragraph of the Markdown body as plain text. */
function lead(body: string): string {
  const block = body
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .find((b) => b && !/^(#|import |<|[-*] |\d+\. |\||```|>)/.test(b));
  return (block ?? "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ");
}
const words = (s: string) => s.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

/** Internal link targets of a Markdown body: [text](/path#frag). */
const links = (body: string) => [...body.matchAll(/\]\((\/[^)\s]*)\)/g)].map((m) => m[1] ?? "");

describe("P4a documentation sections", () => {
  for (const section of P4A_SECTIONS) {
    it(`${section} has exactly the S10 pages`, () => {
      const ids = mine.filter((d) => d.id.startsWith(`${section}/`)).map((d) => d.id.split("/")[1] ?? "");
      expect(ids.sort()).toEqual([...(S10[section] ?? [])].sort());
    });
  }
});

describe.each(docs.map((d) => [d.id, d] as const))("any doc %s", (id, doc) => {
  it("is a page of the S10 contract in its own section folder", () => {
    expect(CONTRACT.has(id), `${id} is not in S10`).toBe(true);
    expect(doc.front.section).toBe(id.split("/")[0]);
    expect(DOCS_SECTION_KEYS as readonly string[]).toContain(doc.front.section);
  });

  it("links only to S10 docs, PRD §5 feature pages and site routes", () => {
    for (const href of links(doc.body)) {
      const path = href.split("#")[0] ?? "";
      if (path.startsWith("/docs/")) expect(CONTRACT.has(path.slice(6)), href).toBe(true);
      else if (path.startsWith("/funciones/")) expect(FEATURE_SLUGS as readonly string[], href).toContain(path.slice(11));
      else expect(ROUTE_PATHS.has(path), href).toBe(true);
    }
  });
});

describe.each(mine.map((d) => [d.id, d] as const))("P4a doc %s", (_id, doc) => {

  it("has the frontmatter of the docs template", () => {
    expect(doc.front.title, "title").toBeTruthy();
    expect(doc.front.title?.length).toBeLessThanOrEqual(60);
    expect(doc.front.description?.length).toBeGreaterThanOrEqual(80);
    expect(doc.front.description?.length).toBeLessThanOrEqual(155);
    expect(doc.front.appVersion).toBe("0.2.0");
    expect(doc.front.published).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(doc.front.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(doc.front.features).toMatch(/^\[.+\]$/);
  });

  it("opens with a 40–60 word answer", () => {
    const n = words(lead(doc.body));
    expect(n, lead(doc.body)).toBeGreaterThanOrEqual(40);
    expect(n, lead(doc.body)).toBeLessThanOrEqual(60);
  });

  it("uses h2 and h3 only, without skipping a level", () => {
    const levels = [...doc.body.replace(/```[\s\S]*?```/g, "").matchAll(/^(#{1,6}) /gm)].map((m) => (m[1] ?? "").length);
    expect(levels.length).toBeGreaterThan(0);
    expect(levels.every((l) => l === 2 || l === 3)).toBe(true);
    levels.forEach((l, i) => expect(l <= (levels[i - 1] ?? 2) + 1).toBe(true));
  });

  it("links to at least one related doc", () => {
    expect(links(doc.body).some((h) => h.startsWith("/docs/"))).toBe(true);
  });
});
