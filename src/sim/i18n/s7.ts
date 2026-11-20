// Strings of the S7 personalisation demo (src/components/sims/S7Personalize.svelte) around the app's UI,
// which stays in Spanish. Plain strings, so they can be island props.
import type { Locale } from "../../i18n/paths";

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
      "Demo of PlexusTyping's personalisation on a sample text (the app's interface is in Spanish): the app's 59 themes, including the two high-contrast ones («Alto contraste oscuro» and «Alto contraste claro»), its 10 bundled fonts, the five cursor styles (bar, highlight, block, underline and outline), the blinking cursor and the dimmed pending text. The controls are real selectors: choose and the text changes at once.",
    paused: "Demo paused.",
    playing: "Playing the demo.",
    themeApplied: "Theme: {name}.",
    themeFailed: "The theme could not be loaded.",
    caption: "59 themes (two high-contrast), 10 fonts and five cursors. Demo text.",
  },
};
