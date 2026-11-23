/**
 * Documentation search (PRD §7, spec S5): Pagefind's static index is built by `pnpm build`, and a
 * docs page loads no search JavaScript, index or WebAssembly until the search is opened. The unit
 * part runs always; the build part runs after `pnpm build` (it reads dist/).
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { SEARCH_BOOTSTRAP, SEARCH_BOOTSTRAP_HASH } from "../src/components/search/bootstrap";
import { MAX_RESULTS, pageUrl, resultItems, statusText } from "../src/components/search/search-ui.js";

const ROOT = join(import.meta.dirname, "..");
const DIST = join(ROOT, "dist");
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));

describe("search module", () => {
  it("maps Pagefind's file URLs to the site's URLs without .html", () => {
    expect(pageUrl("/docs/empezar/instalar-windows.html")).toBe("/docs/empezar/instalar-windows");
    expect(pageUrl("/docs/ia/que-se-envia.html#nunca")).toBe("/docs/ia/que-se-envia#nunca");
    expect(pageUrl("/index.html")).toBe("/");
    expect(pageUrl("/docs")).toBe("/docs");
  });

  it("turns result data into items with title, link and excerpt", () => {
    const items = resultItems([
      { url: "/docs/metronomo/uso-basico.html", excerpt: "el <mark>metrónomo</mark>", meta: { title: "Uso básico" } },
      { url: "/docs/ia/activar-la-ia.html", excerpt: "x" },
    ]);
    expect(items).toEqual([
      { href: "/docs/metronomo/uso-basico", title: "Uso básico", excerpt: "el <mark>metrónomo</mark>" },
      { href: "/docs/ia/activar-la-ia", title: "/docs/ia/activar-la-ia", excerpt: "x" },
    ]);
    expect(MAX_RESULTS).toBeGreaterThan(0);
  });

  it("words the status by result count", () => {
    const labels = { one: "1 resultado para «{q}».", many: "{n} resultados para «{q}».", none: "Sin resultados para «{q}»." };
    expect(statusText(0, "zz", labels)).toBe("Sin resultados para «zz».");
    expect(statusText(1, "bpm", labels)).toBe("1 resultado para «bpm».");
    expect(statusText(4, "clave", labels)).toBe("4 resultados para «clave».");
  });
});

describe("search loader", () => {
  it("imports nothing until a search trigger is clicked", () => {
    // The only import is a dynamic one inside the click listener, of the trigger's data-module.
    expect(SEARCH_BOOTSTRAP.startsWith('document.addEventListener("click",')).toBe(true);
    expect(SEARCH_BOOTSTRAP.match(/import\(/g)).toHaveLength(1);
    expect(SEARCH_BOOTSTRAP).toContain("import(b.dataset.module)");
    expect(SEARCH_BOOTSTRAP).not.toMatch(/pagefind|fetch\(|WebAssembly/);
  });

  it("builds the Pagefind index as part of pnpm build", () => {
    expect(pkg.scripts.build).toMatch(/^astro build && pagefind --site dist$/);
    expect(pkg.devDependencies.pagefind ?? pkg.dependencies?.pagefind).toBeTruthy();
  });
});

function htmlFiles(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) htmlFiles(p, out);
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

const built = existsSync(join(DIST, "pagefind", "pagefind.js")) && existsSync(join(DIST, "docs"));

describe.skipIf(!built)("built site (after pnpm build)", () => {
  const pages = built ? [join(DIST, "docs.html"), ...htmlFiles(join(DIST, "docs"))] : [];

  it("has a Spanish Pagefind index", () => {
    const entry = JSON.parse(readFileSync(join(DIST, "pagefind", "pagefind-entry.json"), "utf8"));
    expect(Object.keys(entry.languages)).toContain("es");
    expect(entry.languages.es.page_count).toBeGreaterThan(0);
  });

  it("loads no external or module script on documentation pages before the search opens", () => {
    expect(pages.length).toBeGreaterThan(1);
    for (const file of pages) {
      const html = readFileSync(file, "utf8");
      expect(html, file).not.toMatch(/<script[^>]*\bsrc=/);
      expect(html, file).not.toMatch(/<script[^>]*type="module"/);
      expect(html, file).not.toMatch(/modulepreload|rel="preload"[^>]*as="(script|fetch)"/);
      // The speculation rules name /pagefind/* only to exclude it from prefetching (seo-gaps S7).
      const withoutRules = html.replace(/<script type="speculationrules">[^<]*<\/script>/g, "");
      expect(withoutRules, file).not.toContain("/pagefind/");
      expect(html, file).toContain(SEARCH_BOOTSTRAP);
    }
  });

  it("points the trigger at a built search module that loads Pagefind", () => {
    const html = readFileSync(join(DIST, "docs.html"), "utf8");
    const module = /data-module="([^"]+)"/.exec(html)?.[1] ?? "";
    expect(module).toMatch(/^\/_astro\/search-ui\.[\w-]+\.js$/);
    expect(readFileSync(join(DIST, module), "utf8")).toContain("/pagefind/pagefind.js");
  });

  it("allows the loader and WebAssembly in the page CSP, and nothing from other origins", () => {
    const html = readFileSync(join(DIST, "docs", "empezar", "que-es-plexustyping.html"), "utf8");
    const csp = /http-equiv="content-security-policy" content="([^"]+)"/.exec(html)?.[1] ?? "";
    const scriptSrc = /script-src ([^;]+)/.exec(csp)?.[1] ?? "";
    expect(scriptSrc).toContain("'self'");
    expect(scriptSrc).toContain("'wasm-unsafe-eval'");
    expect(scriptSrc).toContain(`'${SEARCH_BOOTSTRAP_HASH}'`);
    expect(scriptSrc).not.toMatch(/https?:|'unsafe-eval'|'unsafe-inline'/);
  });

  it("indexes the documentation pages only", () => {
    const html = readFileSync(join(DIST, "docs", "empezar", "que-es-plexustyping.html"), "utf8");
    expect(html).toContain("data-pagefind-body");
    expect(readFileSync(join(DIST, "index.html"), "utf8")).not.toContain("data-pagefind-body");
  });
});
