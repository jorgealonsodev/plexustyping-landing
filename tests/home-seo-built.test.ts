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

/**
 * T9 (S12, S2, S4): the «Cómo aprender» section right after the hero, a 40–50 word answer and four
 * linked steps in an `<ol>`; and the 0.1.1 label of the unlimited-text section as a badge, not a `<p>`.
 * Step texts follow src/content/docs: progressive unlock is off by default and skips the diagnostic
 * text (app ai::first_text), so the diagnostic step is for people who already type.
 */
const HOWTO = {
  es: {
    file: "index.html",
    h2: "Cómo aprender mecanografía con PlexusTyping",
    answer:
      "Aprender mecanografía con PlexusTyping lleva cuatro pasos: instalarlo, elegir cómo empezar, escribir y practicar a diario. Si empiezas desde cero, activa el desbloqueo progresivo y avanza tecla a tecla desde la fila central. Si ya escribes, la app mide qué teclas y pares de letras te cuestan y los practicas.",
    steps: [
      "Descarga e instala PlexusTyping en Linux o Windows.",
      "Si empiezas desde cero, activa el desbloqueo progresivo en Ajustes → Práctica. Viene desactivado: al activarlo empiezas solo con la fila central y la app añade una tecla cada vez que dominas las activas.",
      "Si ya escribes, empieza por el texto de diagnóstico: la app mide tus errores y tu lentitud en cada carácter y en cada par de letras, y adapta los textos siguientes.",
      "Practica cada día: fija una meta diaria de minutos o de textos, y la racha cuenta los días seguidos en que la cumples.",
    ],
    unlimited: "Un texto que no se acaba",
    badge: "Próxima versión 0.1.1",
  },
  en: {
    file: "en.html",
    h2: "How to learn touch typing with PlexusTyping",
    answer:
      "Learning touch typing with PlexusTyping takes four steps: install it, choose how to start, type and practice daily. If you start from scratch, turn on progressive unlock and move key by key from the home row. If you already type, the app measures which keys and letter pairs cost you.",
    steps: [
      "Download and install PlexusTyping on Linux or Windows.",
      "If you start from scratch, turn on progressive unlock in Settings → Practice. It is off by default: once on, you start with only the home row and the app adds one key each time you master the active ones.",
      "If you already type, start with the diagnostic text: the app measures your errors and your slowness on every character and every pair of letters, and adapts the next texts.",
      "Practice every day: set a daily goal in minutes or texts, and the streak counts the days in a row you meet it.",
    ],
    unlimited: "A text that never runs out",
    badge: "Next version 0.1.1",
  },
} as const;

const STEP_LINKS = [
  "/descargar",
  "/docs/practicar/desbloqueo-progresivo",
  "/docs/motor-adaptativo/como-mide-tus-debilidades",
  "/docs/practicar/meta-diaria-y-racha",
];

describe.skipIf(!built)("home «Cómo aprender» steps and the 0.1.1 badge (after pnpm build)", () => {
  for (const locale of ["es", "en"] as const) {
    const h = HOWTO[locale];
    const doc = () => parse(readFileSync(join(DIST, h.file), "utf8"));
    const section = () => {
      const h2 = doc().querySelector("main h2");
      return { h2, section: h2?.closest("section") };
    };

    describe(locale === "es" ? "/" : "/en", () => {
      it("puts the how-to H2 first after the hero", () => {
        const { h2, section: s } = section();
        expect(text(h2?.text)).toBe(h.h2);
        // The hero's two sections come first, then this one.
        const sections = doc().querySelectorAll("main > section");
        expect(sections[0]?.classList.contains("hero")).toBe(true);
        expect(sections[1]?.classList.contains("window")).toBe(true);
        expect(sections[2]?.getAttribute("aria-labelledby")).toBe(h2?.getAttribute("id"));
        expect(s?.getAttribute("aria-labelledby")).toBe(h2?.getAttribute("id"));
      });

      it("answers in 40–50 words in the first paragraph after the H2", () => {
        const { section: s } = section();
        const answer = text(s?.querySelector("p")?.text);
        expect(answer).toBe(h.answer);
        const n = words(answer);
        expect(n).toBeGreaterThanOrEqual(40);
        expect(n).toBeLessThanOrEqual(50);
      });

      it("lists four steps in an <ol>, each linking an existing built page", () => {
        const { section: s } = section();
        const lists = s?.querySelectorAll("ol") ?? [];
        expect(lists).toHaveLength(1);
        const items = lists[0]?.querySelectorAll(":scope > li") ?? [];
        expect(items).toHaveLength(4);
        items.forEach((li, i) => {
          expect(text(li.text)).toBe(h.steps[i]);
          const links = li.querySelectorAll("a");
          expect(links).toHaveLength(1);
          const href = links[0]?.getAttribute("href") ?? "";
          expect(href).toBe(localizePath(STEP_LINKS[i] ?? "", locale));
          if (locale === "en") expect(href.startsWith("/en/")).toBe(true);
          expect(text(links[0]?.text).length).toBeGreaterThan(0);
          expect(existsSync(join(DIST, `${href.slice(1)}.html`))).toBe(true);
        });
      });

      it("shows the 0.1.1 label as a badge, so the first <p> after the unlimited-text H2 explains it", () => {
        const d = doc();
        const h2 = d.querySelectorAll("main h2").find((x) => text(x.text) === h.unlimited);
        expect(h2).toBeTruthy();
        const s = h2?.closest("section");
        const badge = s?.querySelector(".badge");
        expect(text(badge?.text)).toBe(h.badge);
        expect(badge?.tagName).not.toBe("P");
        const first = text(s?.querySelector("p")?.text);
        expect(first).not.toContain(h.badge);
        expect(words(first)).toBeGreaterThanOrEqual(20);
      });
    });
  }
});
