// Strings of the S5 metronome demo (src/components/sims/S5Metronome.svelte) around the app's UI, plain strings
// so they can be island props (only the page's language reaches the browser), and (METRONOME_UI) the app's
// labels inside it. Spanish pages show the app's real Spanish UI;
// English pages show it translated, with an English text.
import type { Locale } from "../../i18n/paths";
import type { Sound } from "../metronome/api";
import { SOUNDS, type TempoChange, tempoNotice } from "../metronome/beat";

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
      "Demo with sample data of the PlexusTyping metronome: the pulse dot lights on every beat, yellow on accents; a text is typed to the beat and, once finished, the mean rhythm offset and the adaptive tempo for the next text appear. The quick panel changes the tempo (30 to 300 BPM, with − and + or by typing it), the sound (Click, Wood or Beep), the volume and the accent. It makes no sound until you press “Hear the metronome”.",
    paused: "Demo paused.",
    playing: "Playing the demo.",
    soundStarted: "Sound on.",
    soundStopped: "Sound off.",
    caption: "Metronome from 30 to 300 BPM with a quick panel and adaptive tempo. Demo data; sound plays only when you press the button.",
  },
};

/** The metronome: quick panel, beat dot and the result's rhythm lines (MetronomeQuick, BeatDot, Results). */
export interface MetronomeUi {
  toggle: (bpm: number) => string;
  toggleTitle: string;
  dialog: string;
  tempo: string;
  slower: string;
  faster: string;
  bpmInput: string;
  sound: string;
  sounds: Record<Sound, string>;
  volume: string;
  /** The volume's value, `80 %` in Spanish. */
  volumeValue: (volume: number) => string;
  accentEvery: string;
  adaptive: string;
  off: string;
  close: string;
  dot: (bpm: number) => string;
  previousResult: string;
  rhythm: (meanAbsMs: number) => string;
  rhythmShares: (earlyPct: number, latePct: number) => string;
  tempoNotice: (change: TempoChange) => string;
}

export const METRONOME_UI: Record<Locale, MetronomeUi> = {
  es: {
    toggle: (bpm) => `Ajustes rápidos del metrónomo: ${bpm} BPM`,
    toggleTitle: "Ajustar el metrónomo",
    dialog: "Metrónomo",
    tempo: "Tempo",
    slower: "Más lento",
    faster: "Más rápido",
    bpmInput: "Tempo en BPM",
    sound: "Sonido",
    sounds: /* @__PURE__ */ Object.fromEntries(SOUNDS.map((s) => [s.id, s.label])) as Record<Sound, string>,
    volume: "Volumen",
    volumeValue: (volume) => `${volume} %`,
    accentEvery: "Acento cada",
    adaptive: "Tempo adaptativo",
    off: "Apagar",
    close: "Cerrar",
    dot: (bpm) => `Metrónomo: ${bpm} BPM`,
    previousResult: "Resultado del texto anterior",
    rhythm: (ms) => `Ritmo: desvío medio ±${Math.round(ms)} ms`,
    rhythmShares: (early, late) => `· adelantadas ${Math.round(early)}% / atrasadas ${Math.round(late)}%`,
    tempoNotice,
  },
  en: {
    toggle: (bpm) => `Metronome quick settings: ${bpm} BPM`,
    toggleTitle: "Adjust the metronome",
    dialog: "Metronome",
    tempo: "Tempo",
    slower: "Slower",
    faster: "Faster",
    bpmInput: "Tempo in BPM",
    sound: "Sound",
    sounds: { click: "Click", wood: "Wood", beep: "Beep" },
    volume: "Volume",
    volumeValue: (volume) => `${volume}%`,
    accentEvery: "Accent every",
    adaptive: "Adaptive tempo",
    off: "Turn off",
    close: "Close",
    dot: (bpm) => `Metronome: ${bpm} BPM`,
    previousResult: "Result of the previous text",
    rhythm: (ms) => `Rhythm: mean offset ±${Math.round(ms)} ms`,
    rhythmShares: (early, late) => `· early ${Math.round(early)}% / late ${Math.round(late)}%`,
    tempoNotice: ({ from, to }) => (from === to ? `Tempo: stays at ${from} BPM` : `Tempo: ${from} → ${to} BPM`),
  },
};
