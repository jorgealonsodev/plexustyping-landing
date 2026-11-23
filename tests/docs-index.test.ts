/**
 * /docs index (PRD §7, spec S1): every section of src/data/docs-sections.ts that has pages, in that
 * order, each listing all of its Spanish pages from the docs collection. Reads the built page, so it
 * runs after `pnpm build`.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { DOCS_SECTION_KEYS, DOCS_SECTIONS } from "../src/data/docs-sections";

const ROOT = join(import.meta.dirname, "..");
const CONTENT = join(ROOT, "src", "content", "docs");
const INDEX = join(ROOT, "dist", "docs.html");

/** "<section>/<page>" of every Spanish docs entry on disk. */
function entries(): string[] {
  if (!existsSync(CONTENT)) return [];
  return DOCS_SECTION_KEYS.flatMap((s) =>
    existsSync(join(CONTENT, s))
      ? readdirSync(join(CONTENT, s))
          .filter((f) => /^[^_].*\.mdx?$/.test(f))
          .map((f) => `${s}/${f.replace(/\.mdx?$/, "")}`)
      : [],
  );
}

describe.skipIf(!existsSync(INDEX))("built /docs index (after pnpm build)", () => {
  const html = existsSync(INDEX) ? readFileSync(INDEX, "utf8") : "";
  const ids = entries();
  const withPages = DOCS_SECTION_KEYS.filter((s) => ids.some((id) => id.startsWith(`${s}/`)));

  it("shows each section with pages once, in sidebar order, and no empty section", () => {
    const shown = [...html.matchAll(/<h2 id="sec-([a-z-]+)"/g)].map((m) => m[1]);
    expect(shown).toEqual(withPages);
    for (const s of withPages) expect(html).toContain(`>${DOCS_SECTIONS[s].es}</h2>`);
  });

  it("links every page of the collection under its own section", () => {
    expect(ids.length).toBeGreaterThan(0);
    const blocks = html.split(/<section[^>]*aria-labelledby="sec-/).slice(1);
    for (const id of ids) {
      const [section] = id.split("/");
      const block = blocks.find((b) => b.startsWith(`${section}"`)) ?? "";
      expect(block, id).toContain(`href="/docs/${id}"`);
    }
    const linked = [...html.matchAll(/href="\/docs\/([a-z0-9-]+\/[a-z0-9-]+)"/g)].map((m) => m[1]);
    expect(new Set(linked)).toEqual(new Set(ids));
  });
});
