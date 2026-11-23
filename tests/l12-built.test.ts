// Built-site regression probes from odd/tasks/site-pages.md L12 and the T7 verifier (L19).
// Skipped without dist/: run `pnpm build` first.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const walk = (d: string): string[] =>
  readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const resolves = (url: string) => {
  const u = (url.split(/[#?]/)[0] ?? "").replace(/\/$/, "");
  if (!u) return true;
  return [u, `${u}.html`, `${u}/index.html`].some((c) => {
    const p = join("dist", c);
    return existsSync(p) && statSync(p).isFile();
  });
};

const isEnglish = (p: string) => /dist\/en(\.html|\/)/.test(p);

describe.skipIf(!existsSync("dist/index.html"))("built site regressions (site-pages L12)", () => {
  const html = walk("dist").filter((f) => f.endsWith(".html"));

  it("every page carries the CSP meta (S5)", () => {
    for (const f of html) {
      expect(readFileSync(f, "utf8"), f).toMatch(/<meta http-equiv="content-security-policy" content="[^"]*script-src 'self'/);
    }
  });

  it("dist/og holds only PNG files (S8, nginx location)", () => {
    expect(walk("dist/og").filter((f) => !f.endsWith(".png"))).toEqual([]);
  });

  it("internal links resolve on every page, noindex pages included (S7)", () => {
    const broken: string[] = [];
    for (const f of html) {
      for (const [, h] of readFileSync(f, "utf8").matchAll(/<a [^>]*href="(\/[^"/][^"]*|\/)"/g)) {
        if (h && !resolves(h)) broken.push(`${f} -> ${h}`);
      }
    }
    expect(broken).toEqual([]);
  });

  it("English simulations format percentages the English way (S9)", () => {
    for (const f of html.filter(isEnglish)) {
      expect(readFileSync(f, "utf8"), f).not.toMatch(/<dd[^>]*>\d+(,\d)? %<\/dd>/);
    }
  });

  it("Spanish pages keep the app's Spanish percentage format", () => {
    expect(readFileSync("dist/sim-preview/s8.html", "utf8")).toMatch(/<dd[^>]*>\d+(,\d)? %<\/dd>/);
  });

  it("Spanish pages get no injected lang=es spans (lang-es middleware)", () => {
    for (const f of html.filter((p) => !isEnglish(p))) {
      expect(readFileSync(f, "utf8"), f).not.toContain('<span lang="es">');
    }
  });
});
