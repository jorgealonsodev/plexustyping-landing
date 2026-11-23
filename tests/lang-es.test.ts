/**
 * Spanish app strings quoted in English pages carry lang="es" (WCAG 3.1.2, odd/tasks/site-pages.md T7,
 * L16): the build-time transform src/lib/lang-es.ts that src/middleware.ts applies to every /en page. Since app
 * v0.2.0 (S17, T14) English pages quote the app's English labels, so only the strings the English app itself
 * keeps in Spanish (SPANISH_QUOTES) are wrapped; every other quotation is English and stays as it is.
 */
import { describe, expect, it } from "vitest";
import { isEnglishPath, markSpanishQuotes, SPANISH_QUOTES } from "../src/lib/lang-es";

const page = (body: string, head = "<title>“ChatGPT (tu suscripción)” · PlexusTyping</title>") =>
  `<!doctype html><html lang="en"><head>${head}</head><body>${body}</body></html>`;

describe("markSpanishQuotes", () => {
  it("wraps the provider name the English app keeps in Spanish, keeping the English quotation marks outside", () => {
    expect(markSpanishQuotes(page("<p>Add “ChatGPT (tu suscripción)” (your subscription).</p>"))).toContain(
      '<p>Add “<span lang="es">ChatGPT (tu suscripción)</span>” (your subscription).</p>',
    );
  });

  it("wraps every Spanish string of a run", () => {
    const out = markSpanishQuotes(page("<li>“ChatGPT (tu suscripción)” or “ChatGPT (tu suscripción)”</li>"));
    expect(out.match(/<span lang="es">ChatGPT \(tu suscripción\)<\/span>/g)).toHaveLength(2);
  });

  it("leaves the app's English labels alone, British spelling included (app v0.2.0)", () => {
    for (const q of ["Settings", "Prose / Words / Code", "Colour-blind mode", "Practising: ñ · qu · z", "Run anyway", "Daily goal met!"]) {
      const html = page(`<p>Click “${q}”.</p>`);
      expect(markSpanishQuotes(html)).toBe(html);
    }
  });

  it("lists only strings the English app shows in Spanish", () => {
    expect([...SPANISH_QUOTES]).toEqual(["ChatGPT (tu suscripción)"]);
  });

  it("does not touch the head, attributes, scripts, styles, code or simulation islands", () => {
    const body = [
      '<a title="“ChatGPT (tu suscripción)”" href="/en">x</a>',
      "<script>const s = \"“ChatGPT (tu suscripción)”\";</script>",
      "<style>.a::before{content:\"“ChatGPT (tu suscripción)”\"}</style>",
      "<code>“ChatGPT (tu suscripción)”</code>",
      "<pre>“ChatGPT (tu suscripción)”</pre>",
      '<astro-island uid="1"><p>“ChatGPT (tu suscripción)”</p></astro-island>',
    ].join("");
    const html = page(body);
    expect(markSpanishQuotes(html)).toBe(html);
  });

  it("is idempotent", () => {
    const once = markSpanishQuotes(page("<p>“ChatGPT (tu suscripción)”</p>"));
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
