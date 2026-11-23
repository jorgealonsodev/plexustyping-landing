// /llms.txt and /llms-full.txt (PRD §10.2, docs/seo-2026.md §B11): generated from the collections.
import { describe, expect, it } from "vitest";
import { buildLlmsFullTxt, buildLlmsTxt, type LlmsData, mdxToMarkdown } from "../src/components/prose/llms";

const site = new URL("https://plexus.example");

const data: LlmsData = {
  site,
  name: "PlexusTyping",
  summary: "Tutor de mecanografía adaptativo para Linux y Windows.",
  intro: ["La interfaz de la app está solo en español."],
  pages: [
    { title: "Descargar", path: "/descargar", description: "Descargas de la última versión." },
    { title: "Novedades", path: "/novedades" },
  ],
  features: [{ title: "Motor adaptativo", path: "/funciones/motor-adaptativo", description: "Practica tus puntos débiles." }],
  docs: [
    {
      section: "Empezar",
      title: "Instalar en Windows",
      path: "/docs/empezar/instalar-windows",
      description: "Instalador por usuario.",
      body: 'import Note from "../../components/Note.astro";\n\n## Pasos\n\nLee [la verificación](/docs/empezar/verificar-descarga).\n\n<Note kind="info" />\n',
    },
    { section: "IA", title: "Qué se envía", path: "/docs/ia/que-se-envia", description: "Datos que salen.", body: "Nunca se envía lo que escribes." },
  ],
  releases: [{ version: "0.1.0", date: new Date("2026-11-19"), summary: "Primera versión pública.", path: "/novedades#v0-1-0", github: "https://github.com/x/y/releases/tag/v0.1.0" }],
  faq: [{ question: "¿Es gratis?", answer: "Sí, es gratis.", path: "/docs/proyecto/licencias-y-creditos" }],
};

describe("buildLlmsTxt", () => {
  const txt = buildLlmsTxt(data);

  it("starts with the H1 name and the blockquote summary (llmstxt.org)", () => {
    const lines = txt.split("\n");
    expect(lines[0]).toBe("# PlexusTyping");
    expect(lines[2]).toBe("> Tutor de mecanografía adaptativo para Linux y Windows.");
    expect(txt).toContain("La interfaz de la app está solo en español.");
  });

  it("lists pages, features and docs as absolute Markdown links with descriptions", () => {
    expect(txt).toContain("- [Descargar](https://plexus.example/descargar): Descargas de la última versión.");
    expect(txt).toContain("- [Novedades](https://plexus.example/novedades)\n");
    expect(txt).toContain("- [Motor adaptativo](https://plexus.example/funciones/motor-adaptativo): Practica tus puntos débiles.");
    expect(txt).toContain("- [Instalar en Windows](https://plexus.example/docs/empezar/instalar-windows): Instalador por usuario.");
  });

  it("groups docs under one H2 per section, in input order", () => {
    const a = txt.indexOf("## Documentación: Empezar");
    const b = txt.indexOf("## Documentación: IA");
    expect(a).toBeGreaterThan(0);
    expect(b).toBeGreaterThan(a);
  });

  it("links the full version, the releases and the FAQ", () => {
    expect(txt).toContain("https://plexus.example/llms-full.txt");
    expect(txt).toContain("- [PlexusTyping 0.1.0 (2026-11-19)](https://plexus.example/novedades#v0-1-0): Primera versión pública.");
    expect(txt).toContain("- [¿Es gratis?](https://plexus.example/docs/proyecto/licencias-y-creditos)");
  });

  it("does not include doc bodies", () => {
    expect(txt).not.toContain("Nunca se envía lo que escribes.");
  });

  it("leaves out empty sections", () => {
    const empty = buildLlmsTxt({ ...data, docs: [], features: [], faq: [], releases: [] });
    expect(empty).not.toContain("## Documentación");
    expect(empty).not.toContain("## Funciones");
    expect(empty).not.toContain("## Preguntas frecuentes");
    expect(empty).not.toContain("## Novedades");
    expect(empty).toContain("## Páginas");
  });
});

describe("buildLlmsFullTxt", () => {
  const full = buildLlmsFullTxt(data);

  it("includes every doc body under its title, with its URL", () => {
    expect(full.split("\n")[0]).toBe("# PlexusTyping");
    expect(full).toContain("## Instalar en Windows\n\nURL: https://plexus.example/docs/empezar/instalar-windows");
    expect(full).toContain("Nunca se envía lo que escribes.");
  });

  it("shifts doc headings one level down so each doc stays under its own H2", () => {
    expect(full).toContain("### Pasos");
    expect(full).not.toMatch(/^## Pasos$/m);
  });

  it("makes site-relative links absolute and drops MDX imports and components", () => {
    expect(full).toContain("[la verificación](https://plexus.example/docs/empezar/verificar-descarga)");
    expect(full).not.toContain("import Note");
    expect(full).not.toContain("<Note");
  });

  it("includes the FAQ answers and the release summaries", () => {
    expect(full).toContain("¿Es gratis?");
    expect(full).toContain("Sí, es gratis.");
    expect(full).toContain("PlexusTyping 0.1.0");
  });
});

describe("mdxToMarkdown", () => {
  it("keeps fenced code untouched", () => {
    const src = "```bash\nimport x\n## not a heading\n```\n";
    expect(mdxToMarkdown(src, site)).toBe("```bash\nimport x\n## not a heading\n```");
  });
});

describe("English entries (site-pages S7)", () => {
  const english = {
    note: "English version of the site; the app's interface is in Spanish.",
    pages: [{ title: "Download", path: "/en/download" }],
    features: [{ title: "Adaptive engine", path: "/en/features/adaptive-engine", description: "Practice your weak spots." }],
    docs: [{ title: "Install on Windows", path: "/en/docs/getting-started/install-windows", description: "Per-user installer." }],
  };
  const withEn = { ...data, english };

  it("adds an English section with the English pages, features and docs as absolute links", () => {
    for (const txt of [buildLlmsTxt(withEn), buildLlmsFullTxt(withEn)]) {
      expect(txt).toContain("## English version");
      expect(txt).toContain("English version of the site; the app's interface is in Spanish.");
      expect(txt).toContain("- [Download](https://plexus.example/en/download)");
      expect(txt).toContain("- [Adaptive engine](https://plexus.example/en/features/adaptive-engine): Practice your weak spots.");
      expect(txt).toContain("- [Install on Windows](https://plexus.example/en/docs/getting-started/install-windows): Per-user installer.");
    }
  });

  it("keeps the Spanish output unchanged without English data", () => {
    expect(buildLlmsTxt(data)).not.toContain("English version");
    expect(buildLlmsTxt(withEn).startsWith(buildLlmsTxt(data).trimEnd())).toBe(true);
  });
});
