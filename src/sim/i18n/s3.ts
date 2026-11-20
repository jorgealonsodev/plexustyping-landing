// Strings of the S3 "Texto ilimitado" simulation (src/components/sims/S3Unlimited.svelte). The app's own
// UI inside the demo stays Spanish (the app is Spanish only); these are the website's words around it.
import type { Locale } from "../../i18n/paths";

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
      "Demo with sample data, played at accelerated speed: PlexusTyping's «Ilimitado» (unlimited) length, coming in the next version (0.1.1). A recorded session types the text; when the cursor reaches the end while the continuation is being prepared, «Generando más texto…» (generating more text) appears and the continuation is chained onto the text without interrupting the typing. The next continuation arrives before the end and the text keeps growing. Esc or «Terminar» (finish) scores what was typed. The app's interface is in Spanish.",
    paused: "Demo paused.",
    playing: "Playing the demo.",
    windowTitle: "PlexusTyping · demo",
    caption:
      "Unlimited text: as you near the end, the continuation is generated (local corpus or AI) without interrupting you. Accelerated replay with sample data; the app's interface is in Spanish.",
  },
};
