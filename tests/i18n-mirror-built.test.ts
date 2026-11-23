/**
 * The English mirror over the built site (odd/tasks/site-pages.md S7, S4, S5, S9), after `pnpm build`:
 * every Spanish page has its English page at the mapped slug and back, hreflang is reciprocal, the
 * sitemap lists both languages, Pagefind keeps one index per language, and English simulations get the
 * English (US) keyboard. Skipped without dist/.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { mirrorPath } from "../src/i18n/paths";
import { checkSite, urlPathOf } from "../src/lib/onpage/check";

const DIST = join(import.meta.dirname, "..", "dist");
const built = existsSync(join(DIST, "en", "download.html")) && existsSync(join(DIST, "descargar.html"));

function htmlFiles(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) htmlFiles(p, out);
    else if (e.name.endsWith(".html")) out.push(relative(DIST, p));
  }
  return out;
}

describe.skipIf(!built)("built English mirror (after pnpm build)", () => {
  const paths = built ? htmlFiles(DIST).map(urlPathOf) : [];
  const pages = paths.filter((p) => p !== "/404" && !p.includes("sim-preview") && !p.startsWith("/pagefind"));
  const set = new Set(paths);
  const read = (p: string) => readFileSync(join(DIST, p === "/" ? "index.html" : `${p.slice(1)}.html`), "utf8");

  it("builds every page in both languages, each at its mapped counterpart", () => {
    const es = pages.filter((p) => !p.startsWith("/en"));
    const en = pages.filter((p) => p === "/en" || p.startsWith("/en/"));
    expect(es.length).toBeGreaterThan(60);
    expect(en.length).toBe(es.length);
    for (const p of pages) expect(set.has(mirrorPath(p)), `${p} -> ${mirrorPath(p)}`).toBe(true);
  });

  it("passes the on-page check with mirrors required: reciprocal hreflang, sitemap and lang per page", () => {
    const { issues } = checkSite(DIST, { site: process.env.SITE_URL ?? "https://example.com", requireMirrors: true });
    expect(issues.filter((i) => i.level === "error")).toEqual([]);
  });

  it("lists both languages in the sitemap", () => {
    const sitemap = readdirSync(DIST).filter((f) => /^sitemap-\d+\.xml$/.test(f)).map((f) => readFileSync(join(DIST, f), "utf8")).join("");
    expect(sitemap).toContain("/en/docs/getting-started/install-linux-deb</loc>");
    expect(sitemap).toContain("/docs/empezar/instalar-linux-deb</loc>");
    expect(sitemap).not.toContain("/en/docs/help/faq</loc>");
  });

  it("keeps one Pagefind index per language, with the same docs in each", () => {
    const entry = JSON.parse(readFileSync(join(DIST, "pagefind", "pagefind-entry.json"), "utf8"));
    expect(Object.keys(entry.languages).sort()).toEqual(["en", "es"]);
    expect(entry.languages.en.page_count).toBe(entry.languages.es.page_count);
    expect(read("/en/docs/ai/what-is-sent")).toMatch(/<html lang="en"/);
  });

  it("gives the English S8 and S10 simulations the English (US) keyboard and leaves the Spanish ones on their default", () => {
    for (const p of ["/en/features/code-mode", "/en/features/accessibility"]) expect(read(p), p).toContain("us-qwerty");
    for (const p of ["/funciones/modo-codigo", "/funciones/accesibilidad"]) expect(read(p), p).not.toContain("us-qwerty");
  });

  it("says on English pages that the released app's interface is in Spanish", () => {
    for (const p of ["/en", "/en/download", "/en/docs", "/en/features/ai"]) expect(read(p), p).toMatch(/the app(?:'|&#39;)s interface is in Spanish/);
  });

  it("has an English RSS feed linking to the English release notes", () => {
    const rss = readFileSync(join(DIST, "en", "rss.xml"), "utf8");
    expect(rss).toContain("<language>en</language>");
    expect(rss).toContain("/en/release-notes#v0-1-0");
    expect(read("/en/release-notes")).toContain('href="/en/rss.xml"');
  });
});
