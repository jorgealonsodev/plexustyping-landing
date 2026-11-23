// Website strings of the S2 demo ("Tus puntos débiles", src/components/sims/S2WeakSpots.svelte): the controls,
// caption and text alternative around the app's interface. Spanish pages show the app's real Spanish UI;
// English pages show it translated, with English texts on the English (US) keyboard.
import type { Locale } from "../../i18n/paths";

export interface SimStrings {
  /** Title bar of the demo window. */
  title: string;
  /** Visible caption under the window. */
  caption: string;
  play: string;
  pause: string;
  /** Text alternative of the demo, read before it. */
  description: string;
  /** Polite announcements, only for the visitor's own actions. */
  paused: string;
  playing: string;
}

export const S2_STRINGS: Record<Locale, SimStrings> = {
  es: {
    title: "PlexusTyping · demostración",
    caption:
      "Tus puntos débiles. Mientras escribes, el teclado se tiñe según los errores y la lentitud de cada tecla; el texto siguiente practica esas teclas y combinaciones (ñ, qu, z). Datos de demostración.",
    play: "Reproducir",
    pause: "Pausar",
    description:
      "Demostración con datos de ejemplo: la pantalla de práctica de PlexusTyping escribe el texto de diagnóstico y el teclado en pantalla se va tiñendo en las teclas con más errores, con la leyenda «Errores por tecla» del 1 (muy pocos) al 5 (muchos). Después llega un texto nuevo con la línea «Practicando: ñ · qu · z» y palabras que los contienen, como queremos, montaña y zona.",
    paused: "Demostración en pausa.",
    playing: "Reproduciendo la demostración.",
  },
  en: {
    title: "PlexusTyping · demo",
    caption:
      "Your weak spots. As you type, the keyboard is tinted by each key's errors and slowness; the next text practices those keys and combinations (qu, z, x). Demo data. The released app's interface is in Spanish; the demo shows it translated.",
    play: "Play",
    pause: "Pause",
    description:
      "Demo with sample data, in English on the English (US) keyboard: PlexusTyping's practice screen types the diagnostic text and the on-screen keyboard is tinted on the keys with the most errors, with the legend “Errors per key” from 1 (very few) to 5 (many). Then a new text arrives with the line “Practicing: qu · z · x” and words that contain them, such as quiet, pizza and next.",
    paused: "Demo paused.",
    playing: "Playing the demo.",
  },
};
