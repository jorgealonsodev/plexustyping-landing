/**
 * Documentation sections progreso…proyecto (odd/tasks/site-pages.md, task P4b; specs S4, S10):
 * exactly the S10 pages exist, each opens with a 40–60 word answer, and every internal link
 * points to an S10 docs page or a PRD §5 route.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { FEATURE_SLUGS, ROUTES } from "../src/data/routes";

const DOCS = join(__dirname, "..", "src", "content", "docs");

/** S10 slugs of every section; this file checks the files of OWN only. */
const S10: Record<string, string[]> = {
  empezar: ["que-es-plexustyping", "instalar-linux-deb", "instalar-linux-tar", "instalar-windows", "verificar-descarga", "primer-arranque", "actualizar-y-desinstalar"],
  practicar: ["modos", "longitud-y-texto-ilimitado", "modos-de-error", "objetivos-y-puntos-debiles", "sesion-fantasma", "desbloqueo-progresivo", "meta-diaria-y-racha"],
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
const OWN = ["progreso", "personalizacion", "accesibilidad", "ajustes", "referencia", "ayuda", "proyecto"];

const docPaths = new Set(Object.entries(S10).flatMap(([s, pages]) => pages.map((p) => `/docs/${s}/${p}`)));
const sitePaths = new Set<string>([...Object.values(ROUTES), ...FEATURE_SLUGS.map((s) => `/funciones/${s}`)]);

interface Page {
  id: string;
  frontmatter: string;
  body: string;
}

const pages: Page[] = OWN.flatMap((section) =>
  (existsSync(join(DOCS, section)) ? readdirSync(join(DOCS, section)) : [])
    .filter((f) => /^[^_].*\.mdx?$/.test(f))
    .map((f) => {
      const [, frontmatter = "", body = ""] = readFileSync(join(DOCS, section, f), "utf8").match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/) ?? [];
      return { id: `${section}/${f.replace(/\.mdx?$/, "")}`, frontmatter, body };
    }),
);

/** Visible text of a Markdown paragraph: link labels kept, code spans unwrapped. */
const plain = (md: string) => md.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[`*_]/g, "");
/** The same word count as the on-page check (src/lib/onpage/check.ts). */
const words = (s: string) => s.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

describe("docs sections progreso…proyecto (P4b)", () => {
  it("has exactly the S10 pages of each section", () => {
    for (const section of OWN) {
      const ids = pages.filter((p) => p.id.startsWith(`${section}/`)).map((p) => p.id.split("/")[1]);
      expect(ids.sort(), section).toEqual([...(S10[section] ?? [])].sort());
    }
  });

  it.each(pages.map((p) => [p.id, p] as const))("%s: frontmatter matches its folder and app version", (id, p) => {
    expect(p.frontmatter).toMatch(new RegExp(`^section: ${id.split("/")[0]}$`, "m"));
    expect(p.frontmatter).toMatch(/^appVersion: "0\.1\.0"$/m);
    expect(p.frontmatter).toMatch(/^features: \[[a-z-]+(, [a-z-]+)*\]$/m);
  });

  it.each(pages.map((p) => [p.id, p] as const))("%s: opens with a 40–60 word answer", (_id, p) => {
    const lead = p.body.trim().split(/\n\s*\n/)[0] ?? "";
    expect(lead).not.toMatch(/^[#|>`-]/);
    const n = words(plain(lead));
    expect(n).toBeGreaterThanOrEqual(40);
    expect(n).toBeLessThanOrEqual(60);
  });

  it.each(pages.map((p) => [p.id, p] as const))("%s: internal links go to S10 docs or PRD §5 pages", (_id, p) => {
    const links = [...p.body.matchAll(/\]\((\/[^)\s#]*)/g)].map((m) => m[1] ?? "");
    expect(links.length).toBeGreaterThan(0);
    for (const href of links) {
      if (href.startsWith("/docs/")) expect(docPaths, href).toContain(href);
      else expect(sitePaths, href).toContain(href);
    }
  });
});
