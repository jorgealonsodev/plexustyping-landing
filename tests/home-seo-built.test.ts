/**
 * The home's on-page SEO for its target query over the built site (odd/tasks/site-pages.md S11, S4, S2),
 * after `pnpm build`: «programa para aprender mecanografía» on `/` and «learn touch typing» on `/en`
 * (seo-audit-home.md, Important 2–5 and Nice-to-have 6). Skipped without dist/.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "node-html-parser";
import { describe, expect, it } from "vitest";
import { localizePath } from "../src/i18n/paths";

const DIST = join(import.meta.dirname, "..", "dist");
const built = existsSync(join(DIST, "index.html")) && existsSync(join(DIST, "en.html"));

/** The same word count the on-page check uses for the 40–60 word lead. */
const words = (s: string) => s.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
const text = (s: string | undefined) => (s ?? "").replace(/\s+/g, " ").trim();

const UNLOCK = "/docs/practicar/desbloqueo-progresivo";

const HOME = {
  es: {
    file: "index.html",
    title: "Programa gratis para aprender mecanografía · PlexusTyping",
    description:
      "Programa gratis y sin conexión para aprender mecanografía en Linux y Windows. Empieza desde cero o practica las teclas y combinaciones que más te cuestan.",
    h1: "Mecanografía que se adapta a tus fallos.",
    lead: "PlexusTyping es un programa gratuito y de código abierto para aprender mecanografía en Linux y Windows, sin conexión. Si empiezas desde cero, activa el desbloqueo progresivo: empiezas con la fila central y la app añade teclas según las dominas. Si ya escribes, mide qué teclas te cuestan y practica justo esas.",
    query: ["programa", "aprender mecanografía"],
    turnOn: "activa el desbloqueo progresivo",
    beginner: "Sirve tanto si empiezas desde cero como si quieres corregir tus teclas débiles.",
  },
  en: {
    file: "en.html",
    title: "Free program to learn touch typing · PlexusTyping",
    description:
      "Free, offline program to learn touch typing on Linux and Windows. Start from scratch or practice the keys and letter pairs that cost you the most.",
    h1: "Typing practice that adapts to your mistakes.",
    lead: "PlexusTyping is a free, open-source program to learn touch typing on Linux and Windows, offline. If you are starting from scratch, turn on progressive unlock: you begin with the home row and the app adds keys as you master them. If you already type, it measures which keys cost you and writes texts to practice exactly those.",
    query: ["program", "learn touch typing"],
    turnOn: "turn on progressive unlock",
    beginner: "It works whether you are starting from scratch or want to fix your weak keys.",
  },
} as const;

describe.skipIf(!built)("home on-page SEO for the target query (after pnpm build)", () => {
  for (const locale of ["es", "en"] as const) {
    const h = HOME[locale];
    const doc = () => parse(readFileSync(join(DIST, h.file), "utf8"));

    describe(locale === "es" ? "/" : "/en", () => {
      it("has the query-first title (≤ 60) and description (≤ 155), and keeps the h1", () => {
        const d = doc();
        const title = d.querySelector("title")?.text ?? "";
        const description = d.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";
        expect(title).toBe(h.title);
        expect(title.length).toBeLessThanOrEqual(60);
        expect(description).toBe(h.description);
        expect(description.length).toBeLessThanOrEqual(155);
        expect(d.querySelectorAll("h1")).toHaveLength(1);
        expect(text(d.querySelector("h1")?.text)).toBe(h.h1);
        expect(title).not.toBe(text(d.querySelector("h1")?.text));
      });

      it("opens with a 40–60 word direct answer in the query's words that says to turn progressive unlock on", () => {
        const lead = text(doc().querySelector("main .hero .sub")?.text);
        expect(lead).toBe(h.lead);
        const n = words(lead);
        expect(n).toBeGreaterThanOrEqual(40);
        expect(n).toBeLessThanOrEqual(60);
        for (const q of h.query) expect(lead).toContain(q);
        // S2: off by default, so the copy tells the reader to turn it on.
        expect(lead).toContain(h.turnOn);
      });

      it("links the progressive-unlock docs page with a descriptive anchor from the lead", () => {
        const href = localizePath(UNLOCK, locale);
        if (locale === "en") expect(href).not.toBe(UNLOCK);
        const link = doc().querySelector(`main .hero .sub a[href="${href}"]`);
        expect(link).toBeTruthy();
        expect(text(link?.text).toLowerCase()).toContain(locale === "es" ? "desbloqueo progresivo" : "progressive unlock");
        expect(existsSync(join(DIST, `${href.slice(1)}.html`))).toBe(true);
      });

      it("adds the beginner line to the download close", () => {
        const close = doc().querySelector(`main section[aria-labelledby="${locale === "es" ? "descargar" : "download"}"]`);
        expect(text(close?.text)).toContain(h.beginner);
      });
    });
  }

  it("keeps the note on /en that the released app's interface is in Spanish", () => {
    const note = text(parse(readFileSync(join(DIST, "en.html"), "utf8")).querySelector("main .hero .note")?.text);
    expect(note).toBe("The demo shows the app translated; the released app's interface is in Spanish.");
  });
});
