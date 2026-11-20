// Strings of the S5 metronome demo (src/components/sims/S5Metronome.svelte) around the app's UI, which stays
// in Spanish. Plain strings, so they can be island props (only the page's language reaches the browser).
import type { Locale } from "../../i18n/paths";

export interface S5Strings {
  /** Visible label of the demo: the data is prerecorded. */
  badge: string;
  play: string;
  pause: string;
  /** The sound button: off by default, it plays only after the visitor presses it. */
  soundOn: string;
  soundOff: string;
  /** Text alternative of the demo, read before it. */
  description: string;
  /** Polite announcements, only for the visitor's own actions. */
  paused: string;
  playing: string;
  soundStarted: string;
  soundStopped: string;
  /** Caption under the demo window. */
  caption: string;
}

export const S5_STRINGS: Record<Locale, S5Strings> = {
  es: {
    badge: "Demostración",
    play: "Reproducir",
    pause: "Pausar",
    soundOn: "Oír el metrónomo",
    soundOff: "Silenciar",
    description:
      "Demostración con datos de ejemplo del metrónomo de PlexusTyping: el punto del pulso se enciende en cada tiempo y en amarillo en los acentos; un texto se escribe al ritmo y, al terminarlo, aparecen el desvío medio del ritmo y el tempo adaptativo del texto siguiente. El panel rápido permite cambiar el tempo (de 30 a 300 BPM, con − y + o escribiéndolo), el sonido (Clic, Madera o Bip), el volumen y el acento. No suena hasta que pulsas «Oír el metrónomo».",
    paused: "Demostración en pausa.",
    playing: "Reproduciendo la demostración.",
    soundStarted: "Sonido activado.",
    soundStopped: "Sonido desactivado.",
    caption: "Metrónomo de 30 a 300 BPM con panel rápido y tempo adaptativo. Datos de demostración; el sonido solo se activa al pulsar.",
  },
  en: {
    badge: "Demo",
    play: "Play",
    pause: "Pause",
    soundOn: "Hear the metronome",
    soundOff: "Mute",
    description:
      "Demo with sample data of the PlexusTyping metronome (the app's interface is in Spanish): the pulse dot lights on every beat, yellow on accents; a text is typed to the beat and, once finished, the mean rhythm offset and the adaptive tempo for the next text appear. The quick panel changes the tempo (30 to 300 BPM, with − and + or by typing it), the sound (Clic, Madera or Bip), the volume and the accent. It makes no sound until you press “Hear the metronome”.",
    paused: "Demo paused.",
    playing: "Playing the demo.",
    soundStarted: "Sound on.",
    soundStopped: "Sound off.",
    caption: "Metronome from 30 to 300 BPM with a quick panel and adaptive tempo. Demo data; sound plays only when you press the button.",
  },
};
