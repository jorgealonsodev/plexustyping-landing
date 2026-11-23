// S9 of odd/tasks/site-pages.md for the S1 hero and the practice screen S1–S4 share: on /en the app's labels are
// translated, the text is the app's English corpus and the keyboard the English (US) layout; Spanish pages keep
// the app's real Spanish UI. The components are rendered on the server, as the pages' still state is.
import { createRequire } from "node:module";
import type { Component } from "svelte";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createServer, type ViteDevServer } from "vite";
import { DEMO_PACKS } from "../src/sim/data/s1";
import { KEYBOARD_UI, PRACTICE_UI } from "../src/sim/i18n/app";
import { ui } from "../src/i18n/ui";

let server: ViteDevServer;
let render: (c: Component<any>, o: { props: Record<string, unknown> }) => { body: string };
let HeroSim: Component<any>;
let PracticeScreen: Component<any>;

beforeAll(async () => {
  // The Svelte plugin Astro uses (a dependency of @astrojs/svelte, not a direct one of the site).
  const fromAstroSvelte = createRequire(createRequire(import.meta.url).resolve("@astrojs/svelte"));
  const { svelte } = await import(fromAstroSvelte.resolve("@sveltejs/vite-plugin-svelte"));
  server = await createServer({
    root: process.cwd(),
    configFile: false,
    logLevel: "silent",
    appType: "custom",
    server: { middlewareMode: true, hmr: false, ws: false },
    plugins: [svelte({ configFile: false })],
  });
  ({ render } = await server.ssrLoadModule("svelte/server"));
  HeroSim = (await server.ssrLoadModule("/src/components/HeroSim.svelte")).default;
  PracticeScreen = (await server.ssrLoadModule("/src/sim/practice/PracticeScreen.svelte")).default;
}, 60_000);
afterAll(() => server?.close());

/** The visible text of a render: tags dropped, so the per-char spans read as the practice text. */
const text = (html: string) => html.replace(/<!--[^]*?-->/g, "").replace(/<[^>]+>/g, "");
/** Comment markers and Svelte's per-render ids, which differ between two renders of the same thing. */
const stable = (html: string) => html.replace(/<!--[^]*?-->/g, "").replace(/s\d+-text/g, "ID");

const SPANISH_LABELS = [
  "Del cerebro a los dedos.",
  "Principal",
  "Prosa",
  "Palabras",
  "Código",
  "Entrada de mecanografía",
  "Estadísticas en vivo",
  "Pulsaciones/min",
  "Precisión",
  "Tiempo",
  "Texto de práctica",
  "Mayús",
  "Intro",
];

const practiceProps = {
  view: {
    chars: [..."hola"],
    states: ["correct", "pending", "pending", "pending"],
    cursor: 1,
    stats: { netWpm: 42, kpm: 210, accuracy: 0.905 },
  },
  elapsed: 3000,
  source: "Corpus local",
  targets: ["qu"],
  layout: DEMO_PACKS.es.layout,
  highlights: [],
  flash: null,
  heat: null,
  textId: "t",
};

describe("PracticeScreen strings (S9)", () => {
  it("renders the app's Spanish labels without strings, the same as with the Spanish strings", () => {
    const bare = render(PracticeScreen, { props: practiceProps }).body;
    for (const label of SPANISH_LABELS) expect(text(bare) + bare).toContain(label);
    expect(text(bare)).toContain("Practicando:");
    expect(text(bare)).toContain("90,5 %");
    const es = render(PracticeScreen, {
      props: { ...practiceProps, strings: PRACTICE_UI.es, keyboardStrings: KEYBOARD_UI.es },
    }).body;
    expect(stable(es)).toBe(stable(bare));
  });

  it("renders every label in English with the English strings", () => {
    const html = render(PracticeScreen, {
      props: { ...practiceProps, layout: DEMO_PACKS.en.layout, strings: PRACTICE_UI.en, keyboardStrings: KEYBOARD_UI.en },
    }).body;
    for (const label of [
      "From brain to fingers.",
      "Main",
      "Prose",
      "Words",
      "Code",
      'aria-label="Typing input"',
      'aria-label="Live stats"',
      "WPM",
      "Keystrokes/min",
      "Accuracy",
      "Time",
      "Practicing:",
      'aria-label="Practice text"',
      ">AI<",
      "Caps Lock",
      "90.5%",
    ])
      expect(html).toContain(label);
    for (const label of SPANISH_LABELS) expect(html).not.toContain(label);
    expect(html).not.toContain("Practicando");
    expect(html).not.toContain(">IA<");
  });
});

describe("HeroSim locale (S9)", () => {
  const en = () => render(HeroSim, { props: { strings: ui("en").heroSim, locale: "en" } }).body;
  const es = () => render(HeroSim, { props: { strings: ui("es").heroSim, locale: "es" } }).body;

  it("shows the English corpus text, the English (US) keyboard and English labels on /en", () => {
    const html = en();
    const pack = DEMO_PACKS.en;
    expect(text(html)).toContain(pack.targetText);
    expect(html).toContain(pack.targetSource);
    expect(text(html)).toContain("Practicing:");
    expect(html).toContain("Errors per key");
    for (const t of pack.targets) expect(html).toMatch(new RegExp(`<kbd[^>]*>${t}</kbd>`));
    expect(html).toContain('lang="en"');
    expect(html).not.toContain('lang="es"');
    // The US layout has no ñ key; es-qwerty has one.
    expect(html).not.toMatch(/>ñ</i);
    for (const label of SPANISH_LABELS) expect(html).not.toContain(label);
  });

  it("keeps the Spanish hero exactly as before without a locale", () => {
    const bare = render(HeroSim, { props: { strings: ui("es").heroSim } }).body;
    expect(stable(bare)).toBe(stable(es()));
    expect(bare).toContain('lang="es"');
    expect(text(bare)).toContain(DEMO_PACKS.es.targetText);
    expect(text(bare)).toContain("Practicando:");
    for (const t of DEMO_PACKS.es.targets) expect(bare).toMatch(new RegExp(`<kbd[^>]*>${t}</kbd>`));
    expect(bare).toMatch(/>ñ</);
  });
});

describe("Hero copy (S9)", () => {
  it("no longer says on /en that the released app is in Spanish (app v0.2.0 has an English UI, S17)", () => {
    const d = ui("en").heroSim.description;
    expect(d).not.toMatch(/in Spanish|translated/);
    expect(d).toContain("qu, z and x");
    expect(d).not.toContain("ñ");
  });

  it("keeps the Spanish hero description", () => {
    expect(ui("es").heroSim.description).toBe(
      "Demostración con datos de ejemplo: la pantalla de práctica de PlexusTyping escribiendo sola. Muestra las estadísticas en vivo (PPM, pulsaciones por minuto, precisión y tiempo), el texto con los aciertos y los errores, y el teclado en pantalla con la tecla siguiente resaltada. Tras el texto de diagnóstico, el teclado se tiñe según los errores de cada tecla y el texto siguiente practica ñ, qu y z. Puedes escribir tú: haz clic en la demostración o llega con Tab al campo de escritura; Esc reinicia el texto.",
    );
  });
});
