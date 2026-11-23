/**
 * English mirror content (odd/tasks/site-pages.md S7): every Spanish entry of the docs, features, FAQ and
 * releases collections has its English translation under en/ with the same file name, and vice versa;
 * English entries say `lang: en`, keep the Spanish frontmatter references (docs ids, feature slugs), and
 * link only to English pages of the site.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const CONTENT = join(import.meta.dirname, "..", "src", "content");

function files(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) files(p, out);
    else if (/^[^_].*\.mdx?$/.test(e.name)) out.push(p);
  }
  return out;
}
function ids(collection: string) {
  const root = join(CONTENT, collection);
  const all = files(root).map((f) => relative(root, f).replace(/\.mdx?$/, ""));
  return {
    es: all.filter((id) => !id.startsWith("en/")).sort(),
    en: all.filter((id) => id.startsWith("en/")).map((id) => id.slice(3)).sort(),
  };
}
const COLLECTIONS = ["docs", "features", "faq", "releases"];
const english = COLLECTIONS.flatMap((c) => files(join(CONTENT, c, "en")));
const frontOf = (src: string) => /^---\n([\s\S]*?)\n---\n/.exec(src)?.[1] ?? "";

describe("every Spanish content entry has its English counterpart and vice versa (S7)", () => {
  it.each(COLLECTIONS)("%s", (collection) => {
    const { es, en } = ids(collection);
    expect(es.length).toBeGreaterThan(0);
    expect(en).toEqual(es);
  });
});

describe("English entries (S7)", () => {
  it("declare lang: en", () => {
    expect(english.length).toBeGreaterThan(70);
    for (const f of english) expect(frontOf(readFileSync(f, "utf8")), f).toMatch(/^lang: en$/m);
  });

  it("keep the Spanish frontmatter references, so both languages pair by id", () => {
    for (const f of english) {
      const front = frontOf(readFileSync(f, "utf8"));
      const twin = join(CONTENT, relative(CONTENT, f).replace(/^([^/]+)\/en\//, "$1/"));
      const es = frontOf(readFileSync(twin, "utf8"));
      for (const key of ["section", "order", "features", "doc", "docs", "version", "date", "published", "updated", "appVersion"]) {
        const pick = (s: string) => new RegExp(`^${key}:(.*(?:\\n  - .*)*)`, "m").exec(s)?.[1]?.trim();
        expect(pick(front), `${f} ${key}`).toEqual(pick(es));
      }
    }
  });

  it("link only to English pages of the site (/en…), never to a Spanish route", () => {
    for (const f of english) {
      const body = readFileSync(f, "utf8").replace(/^---\n[\s\S]*?\n---\n/, "");
      for (const m of body.matchAll(/\]\((\/[^)\s]*)\)|href="(\/[^"]*)"/g)) {
        const target = m[1] ?? m[2] ?? "";
        expect(target, f).toMatch(/^\/en(\/|$)/);
      }
    }
  });
});
