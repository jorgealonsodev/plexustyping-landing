// Strings of the S3 "Texto ilimitado" simulation (src/components/sims/S3Unlimited.svelte): the website's words
// around it and (UNLIMITED_UI) the app's lines inside it. Spanish pages show the app's real Spanish UI;
// English pages show the app's English UI (app v0.2.0), with English texts on the English (US) keyboard.
import type { Locale } from "../../i18n/paths";
import { typingHint } from "../data/s3";

export interface S3Strings {
  /** Visible label: the feature is new in app v0.2.0 (site-pages S17). */
  badge: string;
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
    badge: "Nuevo en la 0.2.0",
    play: "Reproducir",
    pause: "Pausar",
    description:
      "Demostración con datos de ejemplo, reproducida a velocidad acelerada: la longitud «Ilimitado» de PlexusTyping, nueva en la versión 0.2.0. Una sesión grabada escribe el texto; cuando el cursor llega al final mientras se prepara la continuación, aparece «Generando más texto…» y la continuación se encadena al texto sin interrumpir la escritura. La siguiente continuación llega antes del final y el texto sigue creciendo. Esc o «Terminar» puntúan lo escrito.",
    paused: "Demostración en pausa.",
    playing: "Reproduciendo la demostración.",
    windowTitle: "PlexusTyping · demostración",
    caption:
      "Texto ilimitado: al acercarte al final se genera la continuación (corpus local o IA) sin interrumpirte. Reproducción acelerada con datos de ejemplo.",
  },
  en: {
    badge: "New in 0.2.0",
    play: "Play",
    pause: "Pause",
    description:
      "Demo with sample data, played at accelerated speed: PlexusTyping's “Unlimited” length, new in version 0.2.0. A recorded session types the text; when the cursor reaches the end while the continuation is being prepared, “Generating more text…” appears and the continuation is chained onto the text without interrupting the typing. The next continuation arrives before the end and the text keeps growing. Esc or “End” scores what was typed.",
    paused: "Demo paused.",
    playing: "Playing the demo.",
    windowTitle: "PlexusTyping · demo",
    caption:
      "Unlimited text: as you near the end, the continuation is generated (local corpus or AI) without interrupting you. Accelerated replay with sample data.",
  },
};

/** Unlimited text (Practice.svelte, focus.ts `typingHint`; English from app v0.2.0 src/features/practice/messages.ts). */
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
      if (unlimited) return `${started ? "" : "Start typing whenever you like · "}Esc end · F4 metronome · F6 menu`;
      if (started) return "Esc restarts the text · F4 metronome · F6 menu";
      return `Start typing whenever you like · ${isCode ? "Enter = line break · Tab = indent · " : ""}Esc restarts · F4 metronome · F6 menu`;
    },
    finish: "End",
  },
};
