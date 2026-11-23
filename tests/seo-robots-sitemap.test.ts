import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { lastModifiedFor, sourceCandidates } from "../src/lib/lastmod";
import { CRAWLERS, robotsTxt } from "../src/lib/robots";

describe("robots.txt (docs/seo-2026.md §B3)", () => {
  const txt = robotsTxt(new URL("https://plexus.example"));

  it("allows everyone and names every search and AI crawler, each allowed", () => {
    expect(txt).toMatch(/^User-agent: \*\nAllow: \//m);
    for (const bot of ["Googlebot", "Bingbot", "OAI-SearchBot", "GPTBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended"]) {
      expect(CRAWLERS).toContain(bot);
      expect(txt).toContain(`User-agent: ${bot}\n`);
    }
    expect(txt).not.toMatch(/Disallow/);
  });

  it("points to the absolute sitemap index", () => {
    expect(txt).toContain("Sitemap: https://plexus.example/sitemap-index.xml");
  });
});

describe("sitemap lastmod from git (docs/seo-2026.md §B5)", () => {
  it("maps URLs to their source files, content first", () => {
    expect(sourceCandidates("/")[0]).toBe("src/pages/index.astro");
    expect(sourceCandidates("/en")[0]).toBe("src/pages/en.astro");
    expect(sourceCandidates("/en")).toContain("src/pages/en/index.astro");
    expect(sourceCandidates("/docs/empezar/instalar").slice(0, 2)).toEqual([
      "src/content/docs/empezar/instalar.md",
      "src/content/docs/empezar/instalar.mdx",
    ]);
    expect(sourceCandidates("/en/funciones/ia")[0]).toBe("src/content/features/en/ia.md");
    expect(sourceCandidates("/descargar")).toContain("src/pages/descargar.astro");
  });

  it("returns the commit date of a committed page and nothing for a page without a source", () => {
    expect(lastModifiedFor("/")).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(lastModifiedFor("/no-such-page")).toBeUndefined();
  });

  it("gives no date in a shallow clone, where every file would get the same last-commit date", () => {
    const dir = mkdtempSync(join(tmpdir(), "lastmod-shallow-"));
    try {
      execFileSync("git", ["clone", "-q", "--depth", "1", `file://${process.cwd()}`, join(dir, "repo")], { stdio: "ignore" });
      expect(lastModifiedFor("/", join(dir, "repo"))).toBeUndefined();
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
