/**
 * The site's main navigation as an app-style segmented control, over the built site
 * (odd/tasks/site-pages.md S14, with S3 and S5), after `pnpm build`: in es and en, a `<nav>` holds the
 * three section links as real `<a>` elements, the matching section link carries `aria-current`
 * ("page" on the section's own index, "true" on a page inside it), and the header's stylesheet fills
 * the current link from that attribute with the app mode switch's active skin
 * (plexustyping src/features/code/ModeSwitch.svelte `.kinds .active`). Skipped without dist/.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { type HTMLElement, parse } from "node-html-parser";
import { describe, expect, it } from "vitest";

const DIST = join(import.meta.dirname, "..", "dist");
const built = existsSync(join(DIST, "index.html")) && existsSync(join(DIST, "en.html"));

const NAV = {
  es: [
    { href: "/funciones", label: "Funciones" },
    { href: "/docs", label: "Documentación" },
    { href: "/novedades", label: "Novedades" },
  ],
  en: [
    { href: "/en/features", label: "Features" },
    { href: "/en/docs", label: "Documentation" },
    { href: "/en/release-notes", label: "What's new" },
  ],
} as const;

/** Built page → index of the nav link that must be current (or null) and the aria-current value. */
const PAGES: Record<"es" | "en", { file: string; current: number | null; value?: "page" | "true" }[]> = {
  es: [
    { file: "index.html", current: null },
    { file: "funciones.html", current: 0, value: "page" },
    { file: "funciones/ia.html", current: 0, value: "true" },
    { file: "docs.html", current: 1, value: "page" },
    { file: "docs/empezar/instalar-linux-deb.html", current: 1, value: "true" },
    { file: "novedades.html", current: 2, value: "page" },
    { file: "descargar.html", current: null },
  ],
  en: [
    { file: "en.html", current: null },
    { file: "en/features.html", current: 0, value: "page" },
    { file: "en/features/ai.html", current: 0, value: "true" },
    { file: "en/docs.html", current: 1, value: "page" },
    { file: "en/docs/accessibility/keyboard.html", current: 1, value: "true" },
    { file: "en/release-notes.html", current: 2, value: "page" },
    { file: "en/download.html", current: null },
  ],
};

const text = (el: HTMLElement) => el.text.replace(/\s+/g, " ").trim();
const doc = (file: string) => parse(readFileSync(join(DIST, file), "utf8"));

/** The section links of the site header's main navigation. */
function navLinks(root: HTMLElement) {
  const nav = root.querySelector("header.site-header nav");
  expect(nav, "header nav").toBeTruthy();
  return nav!.querySelectorAll("ul a");
}

/** Every innermost CSS rule (selector, declarations) the page loads, linked or inline. */
function cssRules(root: HTMLElement): { selector: string; body: string }[] {
  const sheets = root
    .querySelectorAll('link[rel="stylesheet"]')
    .map((l) => readFileSync(join(DIST, l.getAttribute("href")!), "utf8"));
  sheets.push(...root.querySelectorAll("style").map((s) => s.textContent));
  const rules: { selector: string; body: string }[] = [];
  for (const css of sheets) {
    for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      rules.push({ selector: (m[1] ?? "").trim(), body: (m[2] ?? "").replace(/\s+/g, "") });
    }
  }
  return rules;
}

describe.skipIf(!built)("site navigation as a segmented control (after pnpm build)", () => {
  for (const locale of ["es", "en"] as const) {
    describe(locale, () => {
      for (const page of PAGES[locale]) {
        it(`${page.file}: a <nav> with the three section links, the matching one current`, () => {
          const links = navLinks(doc(page.file));
          expect(links.map((a) => ({ href: a.getAttribute("href"), label: text(a) }))).toEqual(NAV[locale]);
          const current = links.map((a) => a.getAttribute("aria-current") ?? null);
          const expected = links.map((_, i) => (i === page.current ? page.value! : null));
          expect(current).toEqual(expected);
          expect(current.filter((v) => v === "page").length).toBe(page.value === "page" ? 1 : 0);
        });
      }

      it("the current link is filled from aria-current with the app's active segment skin", () => {
        const root = doc(`${NAV[locale][0].href.slice(1)}.html`);
        const header = root.querySelector("header.site-header")!;
        const cid = Object.keys(header.attributes).find((k) => k.startsWith("data-astro-cid-"));
        expect(cid, "scoped style id").toBeTruthy();
        const rules = cssRules(root).filter((r) => r.selector.includes(`[${cid}]`));

        const active = rules.filter((r) => /\ba\[[^\]]+\]\[aria-current\]/.test(r.selector));
        expect(active.some((r) => r.body.includes("background:var(--accent)"))).toBe(true);
        expect(active.some((r) => r.body.includes("color:var(--on-accent)"))).toBe(true);
        expect(active.some((r) => r.body.includes("border-color:var(--accent)"))).toBe(true);

        // Idle segments: the app's button skin (app.css `button`) with the mode switch's muted label.
        const idle = rules.filter((r) => /\ba\[[^\]]+\]$/.test(r.selector) && r.selector.includes(".links"));
        const idleBody = idle.map((r) => r.body).join(";");
        expect(idleBody).toContain("background:var(--surface-2)");
        expect(idleBody).toContain("border:1pxsolidvar(--border)");
        expect(idleBody).toContain("color:var(--muted)");
      });
    });
  }
});
