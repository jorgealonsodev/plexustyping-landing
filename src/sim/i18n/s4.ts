// Strings of the S4 "Sesión fantasma" simulation (src/components/sims/S4Ghost.svelte). The app's own UI
// inside the demo stays Spanish (the app is Spanish only); these are the website's words around it.
import type { Locale } from "../../i18n/paths";

export interface S4Strings {
  play: string;
  pause: string;
  /** Text alternative of the demo, read before it. */
  description: string;
  /** Polite announcements, only for the visitor's own actions. */
  paused: string;
  playing: string;
  /** Title of the demo window and the caption under it. */
  windowTitle: string;
  caption: string;
}

export const S4_STRINGS: Record<Locale, S4Strings> = {
  es: {
    play: "Reproducir",
    pause: "Pausar",
    description:
      "Demostración con datos de ejemplo: la sesión fantasma de PlexusTyping. Una sesión grabada escribe un texto ya practicado mientras un cursor fantasma translúcido repite el récord anterior con ese mismo texto. Arriba a la derecha, la diferencia con el récord en segundos: en rojo con «+» cuando vas por detrás y en azul con «−» cuando vas por delante. Tras una corrección se queda atrás y luego adelanta al fantasma; al terminar, el resultado muestra «Récord anterior: 63 PPM» y «¡Nuevo récord para este texto!».",
    paused: "Demostración en pausa.",
    playing: "Reproduciendo la demostración.",
    windowTitle: "PlexusTyping · demostración",
    caption:
      "Sesión fantasma: compites contra tu mejor sesión con el mismo texto, con la diferencia en segundos en directo. Datos de ejemplo.",
  },
  en: {
    play: "Play",
    pause: "Pause",
    description:
      "Demo with sample data: PlexusTyping's ghost session. A recorded session types a text practised before while a translucent ghost cursor replays the previous record on that same text. Top right, the difference with the record in seconds: red with «+» when behind, blue with «−» when ahead. After a correction it falls behind, then overtakes the ghost; at the end the result shows «Récord anterior: 63 PPM» (previous record) and «¡Nuevo récord para este texto!» (new record for this text). The app's interface is in Spanish.",
    paused: "Demo paused.",
    playing: "Playing the demo.",
    windowTitle: "PlexusTyping · demo",
    caption:
      "Ghost session: race your best session on the same text, with the live difference in seconds. Sample data; the app's interface is in Spanish.",
  },
};
