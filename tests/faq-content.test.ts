// /preguntas-frecuentes (docs/seo-2026.md §C): every answer links to its documentation page, the
// page is one of the spec S10 slugs, and the FAQPage JSON-LD carries the answers as plain text.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { faqJsonLdItems, markdownToPlainText } from "../src/components/prose/faq";
import { faqPageNode } from "../src/lib/seo/jsonld";

/** Spec S10 (odd/tasks/site-pages.md): the docs slug contract. */
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
const S10_IDS = new Set(Object.entries(S10).flatMap(([s, pages]) => pages.map((p) => `${s}/${p}`)));

const dir = join(import.meta.dirname, "../src/content/faq");
const entries = readdirSync(dir)
  .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
  .map((f) => {
    const raw = readFileSync(join(dir, f), "utf8");
    const [, fm = "", body = ""] = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/) ?? [];
    const field = (k: string) => fm.match(new RegExp(`^${k}:\\s*"?(.*?)"?$`, "m"))?.[1] ?? "";
    return { file: f, question: field("question"), doc: field("doc"), order: Number(field("order")), body };
  });

describe("FAQ content (src/content/faq)", () => {
  it("has questions", () => {
    expect(entries.length).toBeGreaterThanOrEqual(8);
  });

  it.each(entries.map((e) => [e.file, e] as const))("%s links to an S10 docs page from its answer", (_, e) => {
    expect(S10_IDS.has(e.doc), `${e.doc} is not an S10 slug`).toBe(true);
    expect(e.body).toContain(`](/docs/${e.doc})`);
    for (const m of e.body.matchAll(/\]\(\/docs\/([^)#]+)/g)) expect(S10_IDS.has(m[1] ?? ""), m[1]).toBe(true);
  });

  it("has unique questions and orders", () => {
    expect(new Set(entries.map((e) => e.question)).size).toBe(entries.length);
    expect(new Set(entries.map((e) => e.order)).size).toBe(entries.length);
  });
});

describe("FAQPage JSON-LD", () => {
  it("turns Markdown answers into plain text", () => {
    expect(markdownToPlainText("Sí. Lee **[la guía](/docs/a/b)** y usa `sha256sum -c`.\n\nOtra *línea*.")).toBe(
      "Sí. Lee la guía y usa sha256sum -c. Otra línea.",
    );
  });

  it("builds one Question per entry, in order, with its plain-text answer", () => {
    const node = faqPageNode(
      faqJsonLdItems([
        { question: "¿Es gratis?", body: "Sí. [Licencias](/docs/proyecto/licencias-y-creditos)." },
        { question: "¿Sin conexión?", body: "Sí, con el corpus local." },
      ]),
    );
    expect(node["@type"]).toBe("FAQPage");
    expect(node.mainEntity).toEqual([
      { "@type": "Question", name: "¿Es gratis?", acceptedAnswer: { "@type": "Answer", text: "Sí. Licencias." } },
      { "@type": "Question", name: "¿Sin conexión?", acceptedAnswer: { "@type": "Answer", text: "Sí, con el corpus local." } },
    ]);
  });
});
