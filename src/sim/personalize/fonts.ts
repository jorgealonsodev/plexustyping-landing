// Copy of the PlexusTyping app's src/features/settings/fonts.ts (app commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390).
// Demo edits: the localStorage load/save helpers and the settings import are left out (the demo keeps
// nothing); fontStyle's CSS text becomes fontStyleVars, the same two variables as a map that the island sets
// with style.setProperty (the website's CSP forbids style attributes). Everything else is verbatim.

/** Ajustes → Apariencia select of the practice text's typeface, prose and code (practice-font S1). */
export const FONT_SETTING = {
  label: "Fuente",
  hint: "Tipo de letra del texto de práctica, prosa y código; el resto de la aplicación no cambia.",
};

export const FONT_GROUPS = ["Mecanografía", "Legibilidad"] as const;

export interface PracticeFont {
  id: string;
  name: string;
  /** CSS `font-family` stack: the bundled family first, then today's monospace stack. */
  family: string;
  group: (typeof FONT_GROUPS)[number];
  hint: string;
  /** Turns the font's ligatures off: each typed char stays its own glyph. */
  noLigatures?: boolean;
}

export const DEFAULT_FONT_ID = "default";

const mono = (name: string) => `"${name}", var(--mono)`;

/** Display order; the first is today's font (the `--mono` stack), the default (S1). Files bundled by fontFiles.ts (S2). */
export const PRACTICE_FONTS: PracticeFont[] = [
  {
    id: DEFAULT_FONT_ID,
    name: "Predeterminada",
    family: "var(--mono)",
    group: "Mecanografía",
    hint: "La fuente de siempre de PlexusTyping (JetBrains Mono).",
  },
  {
    id: "roboto-mono",
    name: "Roboto Mono",
    family: mono("Roboto Mono"),
    group: "Mecanografía",
    hint: "La fuente por defecto de Monkeytype.",
  },
  {
    id: "jetbrains-mono",
    name: "JetBrains Mono",
    family: mono("JetBrains Mono"),
    group: "Mecanografía",
    hint: "Monoespaciada de programación con letras altas y claras.",
  },
  {
    id: "fira-code",
    name: "Fira Code",
    family: mono("Fira Code"),
    group: "Mecanografía",
    hint: "Monoespaciada de programación; sin ligaduras, cada carácter se ve por separado.",
    noLigatures: true,
  },
  {
    id: "source-code-pro",
    name: "Source Code Pro",
    family: mono("Source Code Pro"),
    group: "Mecanografía",
    hint: "Monoespaciada de Adobe, sobria y abierta.",
  },
  {
    id: "ibm-plex-mono",
    name: "IBM Plex Mono",
    family: mono("IBM Plex Mono"),
    group: "Mecanografía",
    hint: "Monoespaciada de IBM con remates suaves.",
  },
  {
    id: "inconsolata",
    name: "Inconsolata",
    family: mono("Inconsolata"),
    group: "Mecanografía",
    hint: "Monoespaciada compacta y clásica.",
  },
  {
    id: "atkinson-hyperlegible-mono",
    name: "Atkinson Hyperlegible Mono",
    family: mono("Atkinson Hyperlegible Mono"),
    group: "Legibilidad",
    hint: "Del Braille Institute, pensada para personas con baja visión.",
  },
  {
    id: "intel-one-mono",
    name: "Intel One Mono",
    family: mono("Intel One Mono"),
    group: "Legibilidad",
    hint: "Diseñada con desarrolladores con baja visión o ciegos.",
  },
  {
    id: "lexend-deca",
    name: "Lexend Deca",
    family: '"Lexend Deca", system-ui, sans-serif',
    group: "Legibilidad",
    hint: "Proporcional, de la investigación sobre fluidez lectora.",
  },
  {
    id: "opendyslexic",
    name: "OpenDyslexic",
    family: '"OpenDyslexic", sans-serif',
    group: "Legibilidad",
    hint: "Letras con la base más gruesa; proporcional.",
  },
];

/** The font with `id`; the default for an unknown id (S1). (Demo edit: `!` for the site's strictest tsconfig.) */
export const fontById = (id: string): PracticeFont =>
  PRACTICE_FONTS.find((f) => f.id === id) ?? PRACTICE_FONTS[0]!;

/** The CSS variables the prose and code practice text read. (Demo edit: a map, see the header.) */
export const fontStyleVars = (f: PracticeFont): Record<string, string> => ({
  "--practice-font": f.family,
  "--practice-features": f.noLigatures ? '"liga" 0, "calt" 0' : "normal",
});
