/** Regression tests for odd/tasks/seo-gaps.md (S3, S5). */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { isNoindexPath } from "../src/data/routes";

describe("docs pages that repeat a hub are not indexed (S5)", () => {
  it("marks the four overlapping docs pages noindex and keeps the hubs indexable", () => {
    for (const p of ["/docs/ayuda/preguntas-frecuentes", "/docs/proyecto/notas-de-version", "/docs/proyecto/privacidad", "/docs/proyecto/licencias-y-creditos"]) {
      expect(isNoindexPath(p)).toBe(true);
    }
    for (const p of ["/preguntas-frecuentes", "/novedades", "/privacidad", "/licencias", "/docs/ayuda/solucion-de-problemas", "/"]) {
      expect(isNoindexPath(p)).toBe(false);
    }
  });

  it("keeps the earlier noindex paths and their prefixes", () => {
    expect(isNoindexPath("/404")).toBe(true);
    expect(isNoindexPath("/sim-preview/s1")).toBe(true);
    expect(isNoindexPath("/en/sim-preview")).toBe(true);
  });
});

describe("docs layout order (S3)", () => {
  it("puts the article before the sidebar in the HTML, so phones paint it first without a layout shift", () => {
    const src = readFileSync("src/layouts/DocsLayout.astro", "utf8");
    const article = src.indexOf('<article class="article"');
    const side = src.indexOf('<aside class="side"');
    expect(article).toBeGreaterThan(-1);
    expect(side).toBeGreaterThan(article);
    expect(src).not.toMatch(/order:\s*2/);
  });
});

describe("speculation rules (S7)", async () => {
  const { SPECULATION_RULES, SPECULATION_RULES_HASH } = await import("../src/scripts/speculation");
  const { createHash } = await import("node:crypto");

  it("prefetch internal links with moderate eagerness, never search data, cards, feeds or text files", () => {
    const rules = JSON.parse(SPECULATION_RULES);
    expect(rules.prefetch).toHaveLength(1);
    const [rule] = rules.prefetch;
    expect(rule.eagerness).toBe("moderate");
    const text = JSON.stringify(rule.where);
    expect(text).toContain('"href_matches":"/*"');
    for (const excluded of ["/pagefind/*", "/og/*", "/*.xml", "/*.txt"]) expect(text).toContain(`"not":{"href_matches":"${excluded}"}`);
  });

  it("is allowed by the CSP through its sha256 hash", () => {
    expect(SPECULATION_RULES_HASH).toBe(`sha256-${createHash("sha256").update(SPECULATION_RULES).digest("base64")}`);
    const base = readFileSync("src/layouts/Base.astro", "utf8");
    expect(base).toContain("insertScriptHash(SPECULATION_RULES_HASH)");
    expect(base).toMatch(/<script type="speculationrules" is:inline set:html=\{SPECULATION_RULES\}/);
  });
});

describe("home hero hydration (S8)", () => {
  it("hydrates the above-the-fold demo when the browser is idle, not during the first input", () => {
    expect(readFileSync("src/components/HomeHero.astro", "utf8")).toMatch(/<HeroSim client:idle /);
  });
});

describe.skipIf(!existsSync("dist/index.html"))("built site (after pnpm build): speculation rules and CSP (S7)", () => {
  const html = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? html(join(dir, e.name)) : e.name.endsWith(".html") ? [join(dir, e.name)] : [],
    );

  it("every page that inlines the rules allows them by hash in its CSP meta", async () => {
    const { SPECULATION_RULES_HASH } = await import("../src/scripts/speculation");
    const pages = html("dist").filter((f) => readFileSync(f, "utf8").includes('type="speculationrules"'));
    expect(pages.length).toBeGreaterThan(10);
    for (const file of pages) {
      const csp = /http-equiv="content-security-policy" content="([^"]+)"/.exec(readFileSync(file, "utf8"))?.[1] ?? "";
      expect(csp, file).toContain(`'${SPECULATION_RULES_HASH}'`);
    }
  });
});
