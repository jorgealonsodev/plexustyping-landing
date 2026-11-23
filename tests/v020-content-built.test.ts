/**
 * The site follows app v0.2.0 (odd/tasks/site-pages.md S17, T14), checked over the built site after `pnpm build`
 * (skipped without dist/):
 * - release notes, both feeds and llms files carry the 0.2.0 entry (2026-11-23) and keep 0.1.0;
 * - no page keeps a «0.1.1» / «Próxima versión» / «Next version» label: those features shipped in 0.2.0;
 * - no page says the released app's interface is Spanish-only; the FAQ and the docs name the five languages;
 * - English pages quote the app's English labels, never its Spanish ones; the only Spanish label left is the one the
 *   English app itself still shows, the provider "ChatGPT (tu suscripción)" (app v0.2.0
 *   crates/plexustyping-ai/src/lib.rs:81), which keeps its lang="es" span (src/middleware.ts).
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { type HTMLElement, parse } from "node-html-parser";
import { describe, expect, it } from "vitest";

const DIST = join(import.meta.dirname, "..", "dist");
const built = existsSync(join(DIST, "novedades.html")) && existsSync(join(DIST, "en", "release-notes.html"));

function files(dir: string, ext: RegExp, out: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (!["_astro", "pagefind", "og", "sim"].includes(e.name)) files(p, ext, out);
    } else if (ext.test(e.name)) out.push(p);
  }
  return out;
}

const read = (p: string) => readFileSync(join(DIST, p), "utf8");
const all = built ? files(DIST, /\.(html|txt|xml)$/).map((f) => relative(DIST, f)) : [];
const isEn = (f: string) => f === "en.html" || f.startsWith("en/");
const html = all.filter((f) => f.endsWith(".html") && !f.includes("sim-preview"));

/** Visible text of <body>, without scripts, styles, code and simulation islands (their own spec, T14 item 6). */
function prose(file: string): string {
  const root = parse(read(file), { blockTextElements: { script: false, style: false } });
  const body = root.querySelector("body") as HTMLElement;
  for (const el of body.querySelectorAll("code, pre, kbd, astro-island")) el.remove();
  return body.text;
}

describe.skipIf(!built)("app v0.2.0 content (S17, after pnpm build)", () => {
  it.each([
    ["novedades.html", "es"],
    ["en/release-notes.html", "en"],
  ])("%s lists 0.2.0 (2026-11-23) before 0.1.0, each with its GitHub release", (file) => {
    const root = parse(read(file));
    const versions = root.querySelectorAll("h2[data-version]").map((h) => h.getAttribute("data-version"));
    expect(versions).toEqual(["0.2.0", "0.1.0"]);
    expect(root.querySelector('h2[data-version="0.2.0"] time')?.getAttribute("datetime")).toBe("2026-11-23");
    const links = root.querySelectorAll("a").map((a) => a.getAttribute("href"));
    expect(links).toContain("https://github.com/jorgealonsodev/plexustyping/releases/tag/v0.2.0");
    expect(links).toContain("https://github.com/jorgealonsodev/plexustyping/releases/tag/v0.1.0");
  });

  it.each(["rss.xml", "en/rss.xml"])("%s has a 0.2.0 item first and keeps 0.1.0", (file) => {
    const titles = [...read(file).matchAll(/<item><title>([^<]+)<\/title>/g)].map((m) => m[1]);
    expect(titles).toEqual(["PlexusTyping 0.2.0", "PlexusTyping 0.1.0"]);
  });

  it("names 0.2.0 in llms.txt and llms-full.txt", () => {
    for (const f of ["llms.txt", "llms-full.txt"]) expect(read(f), f).toContain("PlexusTyping 0.2.0");
  });

  it("keeps no «0.1.1» / «Próxima versión» / «Next version» label on any page or file", () => {
    const LABEL = /0\.1\.1|próxima versión|next version/i;
    const offenders = all.filter((f) => LABEL.test(f.endsWith(".html") ? prose(f) : read(f)));
    expect(offenders).toEqual([]);
  });

  it("never says the released app's interface is in Spanish only", () => {
    // The statements T14 replaced; «con la interfaz en español» as an example of a chosen language is fine.
    const SPANISH_ONLY =
      /interfaz(?: de la app)? está(?: solo)? en español|interfaz solo en español|interface (?:is )?in Spanish|Spanish[ -]only|interface, on the other hand|interfaz de la app, en cambio/i;
    const offenders: string[] = [];
    for (const f of all) {
      const text = f.endsWith(".html") ? prose(f) : read(f);
      const m = SPANISH_ONLY.exec(text);
      if (m) offenders.push(`${f}: ${text.slice(Math.max(0, m.index - 30), m.index + 60)}`);
    }
    expect(offenders).toEqual([]);
  });

  it("answers the interface-language question with the five languages and where to change it", () => {
    const es = prose("preguntas-frecuentes.html");
    const en = prose("en/faq.html");
    for (const name of ["Español", "English", "Português (Brasil)", "Français", "Deutsch"]) {
      expect(es).toContain(name);
      expect(en).toContain(name);
    }
    expect(es).toContain("Ajustes → Apariencia");
    expect(en).toContain("Settings → Appearance");
  });

  it("documents the interface language in the docs and on the languages feature page, es and en", () => {
    for (const f of [
      "docs/teclado-e-idiomas/idiomas-del-texto.html",
      "funciones/distribuciones-e-idiomas.html",
      "en/docs/keyboard-and-languages/text-languages.html",
      "en/features/layouts-and-languages.html",
    ]) {
      const text = prose(f);
      expect(text, f).toContain("Português (Brasil)");
      expect(text, f).toMatch(/Idioma de la interfaz|Interface language/);
    }
  });

  it("presents the 0.2.0 features as available: lengths up to 2000, «Ilimitado», the header picker, the bar default", () => {
    const len = prose("docs/practicar/longitud-y-texto-ilimitado.html");
    expect(len).toContain("2000");
    expect(len).toContain("«Ilimitado»");
    expect(len).toMatch(/cabecera/);
    const lenEn = prose("en/docs/practice/length-and-unlimited-text.html");
    expect(lenEn).toContain("“Unlimited”");
    expect(lenEn).toMatch(/header/);
    expect(prose("docs/personalizacion/cursor.html")).toMatch(/«Barra», (?:que es )?el (?:estilo )?por defecto/);
    expect(prose("en/docs/personalization/cursor.html")).toMatch(/“Bar”, the default/);
  });

  it("English pages tag no Spanish app label with lang=es except the provider name the English app keeps", () => {
    const offenders: string[] = [];
    for (const f of html.filter(isEn))
      for (const m of read(f).matchAll(/“<span lang="es">([^<]*)<\/span>”/g))
        if (m[1] !== "ChatGPT (tu suscripción)") offenders.push(`${f}: ${m[1]}`);
    expect(offenders).toEqual([]);
  });

  it("English pages quote the app's English labels, not the Spanish ones quoted on the Spanish pages", () => {
    // Labels the app words the same in both languages, and Spanish data the English pages quote on purpose.
    const SAME = new Set(["Cursor", "Tempo", "Manual", "Tab", "PlexusTerm", "OK", "ChatGPT (tu suscripción)", "Tempo: 60 → 63 BPM", "qu", "rr", "á", "ü"]);
    const spanish = new Set<string>();
    for (const f of html.filter((x) => !isEn(x))) for (const m of prose(f).matchAll(/«([^«»]+)»/g)) spanish.add(m[1] ?? "");
    const offenders: string[] = [];
    for (const f of html.filter(isEn))
      for (const m of prose(f).matchAll(/“([^“”]+)”/g)) {
        const q = m[1] ?? "";
        if (spanish.has(q) && !SAME.has(q)) offenders.push(`${f}: “${q}”`);
      }
    expect([...new Set(offenders)]).toEqual([]);
  });
});
