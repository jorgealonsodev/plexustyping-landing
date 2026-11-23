/**
 * Spanish app labels quoted in English pages carry lang="es" (WCAG 3.1.2, odd/tasks/site-pages.md T7,
 * L16): the build-time transform src/lib/lang-es.ts that src/middleware.ts applies to every /en page.
 */
import { describe, expect, it } from "vitest";
import { ENGLISH_QUOTES, isEnglishPath, markSpanishQuotes } from "../src/lib/lang-es";

const page = (body: string, head = "<title>“Ajustes” · PlexusTyping</title>") =>
  `<!doctype html><html lang="en"><head>${head}</head><body>${body}</body></html>`;

describe("markSpanishQuotes", () => {
  it("wraps a quoted Spanish label in a lang=es span, keeping the English quotation marks outside", () => {
    expect(markSpanishQuotes(page("<p>Open “Ajustes” (settings).</p>"))).toContain(
      '<p>Open “<span lang="es">Ajustes</span>” (settings).</p>',
    );
  });

  it("wraps every label of a run and labels with inner punctuation", () => {
    const out = markSpanishQuotes(page("<li>“Prosa / Palabras / Código” and “¡Meta diaria cumplida!”</li>"));
    expect(out).toContain('“<span lang="es">Prosa / Palabras / Código</span>”');
    expect(out).toContain('“<span lang="es">¡Meta diaria cumplida!</span>”');
  });

  it("leaves the quoted English strings alone", () => {
    for (const q of ENGLISH_QUOTES) {
      const html = page(`<p>Click “${q}”.</p>`);
      expect(markSpanishQuotes(html)).toBe(html);
    }
  });

  it("does not touch the head, attributes, scripts, styles, code or simulation islands", () => {
    const body = [
      '<a title="“Ajustes”" href="/en">x</a>',
      "<script>const s = \"“Ajustes”\";</script>",
      "<style>.a::before{content:\"“Ajustes”\"}</style>",
      "<code>“Ajustes”</code>",
      "<pre>“Ajustes”</pre>",
      '<astro-island uid="1"><p>“Ajustes”</p></astro-island>',
    ].join("");
    const html = page(body);
    expect(markSpanishQuotes(html)).toBe(html);
  });

  it("is idempotent", () => {
    const once = markSpanishQuotes(page("<p>“Ajustes”</p>"));
    expect(markSpanishQuotes(once)).toBe(once);
  });
});

describe("isEnglishPath", () => {
  it("matches /en and /en/… only", () => {
    expect(isEnglishPath("/en")).toBe(true);
    expect(isEnglishPath("/en/docs/practice/modes")).toBe(true);
    expect(isEnglishPath("/en.html")).toBe(true);
    expect(isEnglishPath("/en/docs/practice/modes.html")).toBe(true);
    expect(isEnglishPath("/")).toBe(false);
    expect(isEnglishPath("/ensayo")).toBe(false);
    expect(isEnglishPath("/docs/practicar/modos")).toBe(false);
  });
});
