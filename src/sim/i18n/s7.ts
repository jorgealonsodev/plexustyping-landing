// Strings of the S7 personalisation demo (src/components/sims/S7Personalize.svelte) around the app's UI, plain
// strings so they can be island props, and (SETTINGS_UI) the app's settings inside it. Spanish pages show the app's real Spanish UI;
// English pages show it translated, over an English sample.
import type { Locale } from "../../i18n/paths";
import { CURSOR_BLINK_SETTING, CURSOR_SETTING, CURSOR_STYLES } from "../personalize/cursor";
import { FONT_GROUPS, FONT_SETTING, PRACTICE_FONTS } from "../personalize/fonts";

export interface S7Strings {
  /** Visible label of the demo: the sample text is not the visitor's. */
  badge: string;
  play: string;
  pause: string;
  /** Text alternative of the demo, read before it. */
  description: string;
  /** Polite announcements. */
  paused: string;
  playing: string;
  /** "{name}" is the theme's name. */
  themeApplied: string;
  /** The theme file could not be loaded. */
  themeFailed: string;
  /** Caption under the demo window. */
  caption: string;
}

export const S7_STRINGS: Record<Locale, S7Strings> = {
  es: {
    badge: "Demostración",
    play: "Reproducir",
    pause: "Pausar",
    description:
      "Demostración de la personalización de PlexusTyping sobre un texto de ejemplo: los 59 temas de la aplicación, incluidos «Alto contraste oscuro» y «Alto contraste claro», sus 10 fuentes incluidas, los cinco estilos de cursor (Barra, Resaltado, Bloque, Subrayado y Contorno), el cursor parpadeante y el texto pendiente atenuado. Los controles son selectores reales: elige y el texto cambia al momento.",
    paused: "Demostración en pausa.",
    playing: "Reproduciendo la demostración.",
    themeApplied: "Tema: {name}.",
    themeFailed: "No se pudo cargar el tema.",
    caption: "59 temas (dos de alto contraste), 10 fuentes y cinco cursores. Texto de demostración.",
  },
  en: {
    badge: "Demo",
    play: "Play",
    pause: "Pause",
    description:
      "Demo of PlexusTyping's personalisation on a sample text (the released app's interface is in Spanish; the demo shows it translated): the app's 59 themes, including the two high-contrast ones (“High contrast dark” and “High contrast light”), its 10 bundled fonts, the five cursor styles (bar, highlight, block, underline and outline), the blinking cursor and the dimmed pending text. The controls are real selectors: choose and the text changes at once.",
    paused: "Demo paused.",
    playing: "Playing the demo.",
    themeApplied: "Theme: {name}.",
    themeFailed: "The theme could not be loaded.",
    caption: "59 themes (two high-contrast), 10 fonts and five cursors. Demo text.",
  },
};

/** The settings the personalisation demo shows (SettingsModal, AppearanceSection, TextSection). */
export interface SettingsUi {
  title: string;
  theme: { label: string; hint: string };
  themeGroups: { highContrast: string; dark: string; light: string };
  /** Theme names that are words of the app's language; the others are proper names. */
  themeNames: Record<string, string>;
  font: { label: string; hint: string };
  fontGroups: Record<(typeof FONT_GROUPS)[number], string>;
  fontNames: Record<string, string>;
  fontHints: Record<string, string>;
  tryFont: string;
  tryFontPlaceholder: string;
  cursor: { label: string; hint: string };
  cursorStyles: Record<string, string>;
  blink: { label: string; hint: string };
  dimPending: { label: string; hint: string };
}

export const SETTINGS_UI: Record<Locale, SettingsUi> = {
  es: {
    title: "Ajustes",
    theme: { label: "Tema", hint: "Colores de toda la aplicación; se aplica al momento." },
    themeGroups: { highContrast: "Alto contraste", dark: "Oscuros", light: "Claros" },
    themeNames: {},
    font: FONT_SETTING,
    fontGroups: { Mecanografía: "Mecanografía", Legibilidad: "Legibilidad" },
    fontNames: {},
    fontHints: /* @__PURE__ */ Object.fromEntries(PRACTICE_FONTS.map((f) => [f.id, f.hint])),
    tryFont: "Prueba la fuente",
    tryFontPlaceholder: "Escribe aquí para probarla: Ñandú 0O 1lI ¿{}?",
    cursor: CURSOR_SETTING,
    cursorStyles: /* @__PURE__ */ Object.fromEntries(CURSOR_STYLES.map((c) => [c.id, c.name])),
    blink: CURSOR_BLINK_SETTING,
    // settings.ts DIM_PENDING_SETTING.
    dimPending: {
      label: "Atenuar texto pendiente",
      hint: "Baja el contraste del texto por escribir por debajo del nivel AA para que destaque lo escrito; desactívalo para recuperarlo.",
    },
  },
  en: {
    title: "Settings",
    theme: { label: "Theme", hint: "Colours of the whole app; applied at once." },
    themeGroups: { highContrast: "High contrast", dark: "Dark", light: "Light" },
    themeNames: { "alto-contraste-oscuro": "High contrast dark", "alto-contraste-claro": "High contrast light" },
    font: { label: "Font", hint: "Typeface of the practice text, prose and code; the rest of the app does not change." },
    fontGroups: { Mecanografía: "Typing", Legibilidad: "Legibility" },
    fontNames: { default: "Default" },
    fontHints: {
      default: "PlexusTyping's usual font (JetBrains Mono).",
      "roboto-mono": "Monkeytype's default font.",
      "jetbrains-mono": "A programming monospace with tall, clear letters.",
      "fira-code": "A programming monospace; without ligatures, every char shows on its own.",
      "source-code-pro": "Adobe's monospace, plain and open.",
      "ibm-plex-mono": "IBM's monospace with soft serifs.",
      inconsolata: "A compact, classic monospace.",
      "atkinson-hyperlegible-mono": "From the Braille Institute, made for people with low vision.",
      "intel-one-mono": "Designed with low-vision and blind developers.",
      "lexend-deca": "Proportional, from research on reading fluency.",
      opendyslexic: "Letters with a heavier base; proportional.",
    },
    tryFont: "Try the font",
    tryFontPlaceholder: "Type here to try it: Quartz 0O 1lI {}?",
    cursor: { label: "Cursor", hint: "How the next character to type is marked." },
    cursorStyles: { bar: "Bar", highlight: "Highlight", block: "Block", underline: "Underline", outline: "Outline" },
    blink: {
      label: "Blinking cursor",
      hint: "The cursor blinks while you wait and holds still as you type; not with the system's reduced motion.",
    },
    dimPending: {
      label: "Dim pending text",
      hint: "Lowers the contrast of the text still to type below the AA level so what you typed stands out; turn it off to restore it.",
    },
  },
};
