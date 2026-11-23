/**
 * Finish items of odd/tasks/site-pages.md T7 over the built site, after `pnpm build` (skipped without dist/):
 * - (a) Spanish app labels inside English pages carry lang="es" (WCAG 3.1.2): no English page has a Spanish
 *   word outside a lang="es" element, apart from proper names (layout, language and theme names);
 * - (b) English pages use US spelling;
 * - (c) the English previews of S8, S9 and S10 exist and draw the translated app on the English (US) keyboard;
 * - the English S8/S10 keyboards name their keys in English (site-pages S9).
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { type HTMLElement, parse } from "node-html-parser";
import { describe, expect, it } from "vitest";

const DIST = join(import.meta.dirname, "..", "dist");
const built = existsSync(join(DIST, "en.html")) && existsSync(join(DIST, "en", "docs"));

function htmlFiles(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) htmlFiles(p, out);
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

const read = (p: string) => readFileSync(join(DIST, p), "utf8");
const body = (html: string) => parse(html, { blockTextElements: { script: false, style: false } }).querySelector("body")!;

/**
 * Proper names that WCAG 3.1.2 exempts: the app's keyboard layouts and text languages by their own names, and
 * bundled theme names. Removed from a text run before it is checked.
 */
const PROPER_NAMES = [
  /Español \((?:España|Latinoamérica)\)/g,
  /\bEspañol\b/g,
  /Português \(Brasil, ABNT2\)/g,
  /Français \(AZERTY\)/g,
  /Catppuccin Frappé/g,
  /Rosé Pine(?: Moon| Dawn)?/g,
];
/** A word with a letter English does not use (single letters and key lists such as «ß ä ö ü» are not words). */
const SPANISH_WORD = /[\p{L}]*[ñáéíóú¿¡][\p{L}]*/giu;

/** Text runs of an English page that read as Spanish but have no lang="es" ancestor. */
function untaggedSpanish(root: HTMLElement): string[] {
  const found: string[] = [];
  const visit = (n: HTMLElement, es: boolean) => {
    for (const c of n.childNodes) {
      if (c.nodeType === 3) {
        if (es) continue;
        let t = c.rawText;
        for (const re of PROPER_NAMES) t = t.replace(re, "");
        const words = (t.match(SPANISH_WORD) ?? []).filter((w) => w.replace(/[¿¡]/g, "").length > 1);
        if (words.length) found.push(c.rawText.trim().slice(0, 80));
      } else if (c.nodeType === 1) {
        const el = c as HTMLElement;
        if (el.tagName === "SCRIPT" || el.tagName === "STYLE") continue;
        const lang = el.getAttribute("lang");
        visit(el, lang ? lang.startsWith("es") : es);
      }
    }
  };
  visit(root, false);
  return found;
}

describe.skipIf(!built)("finish over the built site (after pnpm build)", () => {
  const enFiles = built
    ? [join(DIST, "en.html"), ...htmlFiles(join(DIST, "en"))].map((f) => relative(DIST, f))
    : [];

  it("tags the Spanish app labels quoted in English pages with lang=es", () => {
    const modes = read("en/docs/practice/modes.html");
    expect(modes).toContain('“<span lang="es">Prosa / Palabras / Código</span>”');
    expect(read("en/docs/reference/glossary.html")).toContain('“<span lang="es">precisión</span>”');
    expect(read("en/docs/getting-started/install-windows.html")).toContain("“Run anyway”");
    // Spanish pages are left as they are: the whole page is already lang="es".
    expect(read("docs/practicar/modos.html")).not.toContain('<span lang="es">');
  });

  it("leaves no Spanish word outside a lang=es element on any English page", () => {
    const offenders: string[] = [];
    for (const f of enFiles) for (const t of untaggedSpanish(body(read(f)))) offenders.push(`${f}: ${t}`);
    expect(offenders).toEqual([]);
  });

  it("spells English pages the US way", () => {
    const UK = /\b(colour\w*|practis\w*|personalis\w*|favourite\w*|behaviour\w*|licence\w*|grey)\b/gi;
    const offenders: string[] = [];
    for (const f of enFiles) {
      const text = body(read(f)).text;
      for (const m of text.matchAll(UK)) offenders.push(`${f}: ${m[0]}`);
    }
    expect(offenders).toEqual([]);
  });

  it("builds the English previews of S8, S9 and S10 next to the Spanish ones, linked by the language switch", () => {
    for (const s of ["s8", "s9", "s10"]) {
      expect(existsSync(join(DIST, "en", "sim-preview", `${s}.html`)), `/en/sim-preview/${s}`).toBe(true);
      const en = parse(read(`en/sim-preview/${s}.html`));
      expect(en.querySelector("html")?.getAttribute("lang")).toBe("en");
      expect(en.querySelector('meta[name="robots"]')?.getAttribute("content")).toBe("noindex");
      expect(read(`sim-preview/${s}.html`)).toContain(`href="/en/sim-preview/${s}"`);
    }
  });

  it("draws the English (US) keyboard with English key names in the English S8 and S10 demos", () => {
    for (const f of ["en/sim-preview/s8.html", "en/sim-preview/s10.html", "en/features/accessibility.html", "en/features/code-mode.html"]) {
      const text = body(read(f)).text;
      expect(text, f).toContain("Caps Lock");
      expect(text, f).not.toContain("Mayús");
    }
    // The Spanish pages keep the app's real Spanish keyboard.
    expect(body(read("funciones/accesibilidad.html")).text).toContain("Bloq Mayús");
  });
});
