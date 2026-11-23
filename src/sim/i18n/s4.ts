// Strings of the S4 "Sesión fantasma" simulation (src/components/sims/S4Ghost.svelte): the website's words
// around it and (GHOST_UI) the app's lines inside it. Spanish pages show the app's real Spanish UI;
// English pages show it translated, with English texts on the English (US) keyboard.
import type { Locale } from "../../i18n/paths";
import { NEW_RECORD, formatDelta, recordLines } from "../practice/ghost";

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
      "Demo with sample data: PlexusTyping's ghost session. A recorded session types a text practiced before while a translucent ghost cursor replays the previous record on that same text. Top right, the difference with the record in seconds: red with “+” when behind, blue with “−” when ahead. After a correction it falls behind, then overtakes the ghost; at the end the result shows “Previous record: 63 WPM” and “New record for this text!”. The released app's interface is in Spanish; the demo shows it translated.",
    paused: "Demo paused.",
    playing: "Playing the demo.",
    windowTitle: "PlexusTyping · demo",
    caption:
      "Ghost session: race your best session on the same text, with the live difference in seconds. Sample data. The released app's interface is in Spanish; the demo shows it translated.",
  },
};

/** The ghost session (ghost.ts): the live difference and the result's record lines. */
export interface GhostUi {
  deltaLabel: string;
  delta: (ms: number) => string;
  recordLines: (recordWpm: number, netWpm: number, saved: boolean) => string[];
  newRecord: string;
}

const EN_NEW_RECORD = "New record for this text!";

export const GHOST_UI: Record<Locale, GhostUi> = {
  es: { deltaLabel: "Diferencia con tu récord", delta: formatDelta, recordLines, newRecord: NEW_RECORD },
  en: {
    deltaLabel: "Difference from your record",
    delta: (ms) => {
      const tenths = Math.round(Math.abs(ms) / 100);
      if (tenths === 0) return "0.0 s";
      return `${ms > 0 ? "+" : "−"}${(tenths / 10).toFixed(1)} s`;
    },
    recordLines: (recordWpm, netWpm, saved) => {
      const lines = [`Previous record: ${Math.round(recordWpm)} WPM`];
      if (saved && netWpm > recordWpm) lines.push(EN_NEW_RECORD);
      return lines;
    },
    newRecord: EN_NEW_RECORD,
  },
};
