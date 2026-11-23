// Strings of the S3 "Texto ilimitado" simulation (src/components/sims/S3Unlimited.svelte): the website's words
// around it and (UNLIMITED_UI) the app's lines inside it. Spanish pages show the app's real Spanish UI;
// English pages show it translated, with English texts on the English (US) keyboard.
import type { Locale } from "../../i18n/paths";
import { typingHint } from "../data/s3";

export interface S3Strings {
  /** Visible label: the feature ships in the next app version (PRD §6.1, 0.1.1). */
  upcoming: string;
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

export const S3_STRINGS: Record<Locale, S3Strings> = {
  es: {
    upcoming: "Próxima versión",
    play: "Reproducir",
    pause: "Pausar",
    description:
      "Demostración con datos de ejemplo, reproducida a velocidad acelerada: la longitud «Ilimitado» de PlexusTyping, disponible en la próxima versión (0.1.1). Una sesión grabada escribe el texto; cuando el cursor llega al final mientras se prepara la continuación, aparece «Generando más texto…» y la continuación se encadena al texto sin interrumpir la escritura. La siguiente continuación llega antes del final y el texto sigue creciendo. Esc o «Terminar» puntúan lo escrito.",
    paused: "Demostración en pausa.",
    playing: "Reproduciendo la demostración.",
    windowTitle: "PlexusTyping · demostración",
    caption:
      "Texto ilimitado: al acercarte al final se genera la continuación (corpus local o IA) sin interrumpirte. Reproducción acelerada con datos de ejemplo.",
  },
  en: {
    upcoming: "Next version",
    play: "Play",
    pause: "Pause",
    description:
      "Demo with sample data, played at accelerated speed: PlexusTyping's “Unlimited” length, coming in the next version (0.1.1). A recorded session types the text; when the cursor reaches the end while the continuation is being prepared, “Generating more text…” appears and the continuation is chained onto the text without interrupting the typing. The next continuation arrives before the end and the text keeps growing. Esc or “Finish” scores what was typed. The released app's interface is in Spanish; the demo shows it translated.",
    paused: "Demo paused.",
    playing: "Playing the demo.",
    windowTitle: "PlexusTyping · demo",
    caption:
      "Unlimited text: as you near the end, the continuation is generated (local corpus or AI) without interrupting you. Accelerated replay with sample data. The released app's interface is in Spanish; the demo shows it translated.",
  },
};

/** Unlimited text (Practice.svelte, focus.ts `typingHint`). */
export interface UnlimitedUi {
  generating: string;
  hint: (started: boolean, isCode: boolean, unlimited?: boolean) => string;
  finish: string;
}

export const UNLIMITED_UI: Record<Locale, UnlimitedUi> = {
  es: { generating: "Generando más texto…", hint: typingHint, finish: "Terminar" },
  en: {
    generating: "Generating more text…",
    hint: (started, isCode, unlimited = false) => {
      if (unlimited) return `${started ? "" : "Start typing whenever you like · "}Esc finish · F4 metronome · F6 menu`;
      if (started) return "Esc restarts the text · F4 metronome · F6 menu";
      return `Start typing whenever you like · ${isCode ? "Enter = new line · Tab = indent · " : ""}Esc restarts · F4 metronome · F6 menu`;
    },
    finish: "Finish",
  },
};
