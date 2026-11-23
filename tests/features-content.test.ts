/**
 * The nine feature pages (PRD §5; spec S1, S4, S10): one `features` entry per slug, each with a
 * 40–60 word lead, its demonstration figure, and documentation links drawn only from the docs slug
 * contract of odd/tasks/site-pages.md S10.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { FEATURE_SLUGS } from "../src/data/routes";

/** Spec S10, verbatim: /docs/<section>/<page>. */
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
const DOC_IDS = new Set(Object.entries(S10).flatMap(([s, pages]) => pages.map((p) => `${s}/${p}`)));

const DIR = join(import.meta.dirname, "../src/content/features");
const files = readdirSync(DIR).filter((f) => /^[^_].*\.mdx?$/.test(f));

/** The frontmatter block as scalar fields plus YAML list items (the subset these entries use). */
function frontmatter(source: string): { fields: Record<string, string>; lists: Record<string, string[]>; body: string } {
  const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(source);
  if (!m) throw new Error("no frontmatter");
  const fields: Record<string, string> = {};
  const lists: Record<string, string[]> = {};
  let current = "";
  for (const line of (m[1] ?? "").split("\n")) {
    const item = /^\s+-\s+(.+)$/.exec(line);
    if (item && current) {
      lists[current]?.push((item[1] ?? "").replace(/^["']|["']$/g, ""));
      continue;
    }
    const kv = /^([a-zA-Z]+):\s*(.*)$/.exec(line);
    if (!kv) continue;
    current = kv[1] ?? "";
    if (kv[2]) fields[current] = (kv[2] ?? "").replace(/^["']|["']$/g, "");
    else lists[current] = [];
  }
  return { fields, lists, body: m[2] ?? "" };
}

/** Same word count as the on-page check (src/lib/onpage/check.ts). */
const words = (s: string) => s.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

const entries = files.map((f) => ({ slug: f.replace(/\.mdx?$/, ""), ...frontmatter(readFileSync(join(DIR, f), "utf8")) }));

describe("features collection", () => {
  it("has exactly one entry per feature page of PRD §5", () => {
    expect(entries.map((e) => e.slug).sort()).toEqual([...FEATURE_SLUGS].sort());
  });

  it.each(entries.map((e) => [e.slug, e] as const))("%s links only to documentation pages of spec S10", (_slug, e) => {
    const docs = e.lists.docs ?? [];
    expect(docs.length).toBeGreaterThan(0);
    for (const id of docs) expect(DOC_IDS.has(id), `${id} is not in S10`).toBe(true);
    expect(new Set(docs).size).toBe(docs.length);
  });

  it.each(entries.map((e) => [e.slug, e] as const))("%s opens with a 40–60 word answer and fits the title limits", (_slug, e) => {
    const n = words(e.fields.lead ?? "");
    expect(n).toBeGreaterThanOrEqual(40);
    expect(n).toBeLessThanOrEqual(60);
    expect((e.fields.title ?? "").length).toBeLessThanOrEqual(60);
    expect((e.fields.description ?? "").length).toBeLessThanOrEqual(155);
  });

  it.each(entries.map((e) => [e.slug, e] as const))("%s shows its demonstration in a figure", (_slug, e) => {
    expect(e.body).toMatch(/<FeatureSim\s+sim="[a-z0-9]+"/);
  });

  it("labels unlimited text as coming in version 0.1.1 (spec S2)", () => {
    const e = entries.find((x) => x.slug === "texto-ilimitado");
    expect(`${e?.fields.lead} ${e?.body}`).toMatch(/próxima versión 0\.1\.1/i);
  });

  it("orders the entries as the nav does", () => {
    const order = [...entries].sort((a, b) => Number(a.fields.order) - Number(b.fields.order)).map((e) => e.slug);
    expect(order).toEqual([...FEATURE_SLUGS]);
  });
});
