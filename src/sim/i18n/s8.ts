// Strings of the S8 "Modo código" simulation (src/components/sims/S8Code.svelte). `app` holds the app's own
// interface labels inside the demo: in Spanish exactly as the app words them (sources in the comments, app
// commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390); in English, faithful translations for the English site.
import type { Locale } from "../../i18n/paths";
import type { AppLabels } from "../code/labels";

/** The app's labels inside the demo, in code mode. */
export type S8AppStrings = AppLabels;

export interface S8Strings {
  play: string;
  pause: string;
  /** Next to the play button: the visitor can type. */
  hint: string;
  description: string;
  paused: string;
  playing: string;
  restarted: string;
  /** "{wpm}" and "{accuracy}" are replaced. */
  finished: string;
  windowTitle: string;
  caption: string;
  app: S8AppStrings;
}

export const S8_STRINGS: Record<Locale, S8Strings> = {
  es: {
    play: "Reproducir",
    pause: "Pausar",
    hint: "Haz clic y escribe",
    description:
      "Demostración con datos de ejemplo: el modo código de PlexusTyping. Un fragmento de Python, TypeScript o Rust con resaltado de sintaxis se escribe solo, con la sangría automática: Intro es un salto de línea medido y la sangría de la línea siguiente se rellena sola. Con el selector de lenguaje cambias de fragmento. Puedes escribir tú: haz clic en la demostración o llega con Tab al campo de escritura; Intro salta de línea, Retroceso corrige y Esc reinicia el fragmento. En la demostración Tab sale del campo; en la app también sangra.",
    paused: "Demostración en pausa.",
    playing: "Reproduciendo la demostración.",
    restarted: "Fragmento reiniciado.",
    finished: "Fragmento terminado: {wpm} PPM, precisión {accuracy}.",
    windowTitle: "PlexusTyping · demostración",
    caption:
      "Modo código: 15 lenguajes con resaltado de sintaxis; Intro y Tab son teclas medidas y la sangría puede ser automática. Datos de ejemplo.",
    app: {
      tagline: "Del cerebro a los dedos.", // App.svelte <header>
      profile: "Principal", // the default profile's name
      ai: "IA", // App.svelte .ai-label
      kindsLabel: "Modo de práctica", // ModeSwitch.svelte
      prose: "Prosa",
      words: "Palabras",
      code: "Código",
      languageLabel: "Lenguaje de programación", // ModeSwitch.svelte <select aria-label>
      typingField: "Entrada de mecanografía", // Practice.svelte <textarea aria-label>
      liveStats: "Estadísticas en vivo", // Practice.svelte <dl aria-label>
      wpm: "PPM",
      kpm: "Pulsaciones/min",
      accuracy: "Precisión",
      time: "Tiempo",
      textRegion: "Texto de práctica", // Practice.svelte region aria-label (prose)
      codeRegion: "Código de práctica", // Practice.svelte region aria-label (isCode)
      source: "Corpus local", // prefetch.ts sourceLabel()
      hintStart: "Empieza a escribir cuando quieras · Intro = salto de línea · Tab = sangría · Esc reinicia · F4 metrónomo · F6 menú", // focus.ts typingHint(false, true)
      hintStarted: "Esc reinicia el texto · F4 metrónomo · F6 menú", // focus.ts typingHint(true, true)
    },
  },
  en: {
    play: "Play",
    pause: "Pause",
    hint: "Click and type",
    description:
      "Demo with sample data: PlexusTyping's code mode. A Python, TypeScript or Rust snippet with syntax highlighting types itself with automatic indentation: Enter is a measured line break and the next line's indentation fills in by itself. The language picker switches snippets. You can type yourself: click the demo or Tab to its typing field; Enter breaks the line, Backspace corrects and Esc restarts the snippet. In the demo Tab leaves the field; in the app it also indents. Inside the demo the app's labels are translated; the app's own interface is in Spanish.",
    paused: "Demo paused.",
    playing: "Playing the demo.",
    restarted: "Snippet restarted.",
    finished: "Snippet finished: {wpm} WPM, {accuracy} accuracy.",
    windowTitle: "PlexusTyping · demo",
    caption:
      "Code mode: 15 languages with syntax highlighting; Enter and Tab are measured keys and indentation can be automatic. Sample data; the app's interface is in Spanish.",
    app: {
      tagline: "From brain to fingers.",
      profile: "Main",
      ai: "AI",
      kindsLabel: "Practice mode",
      prose: "Prose",
      words: "Words",
      code: "Code",
      languageLabel: "Programming language",
      typingField: "Typing input",
      liveStats: "Live statistics",
      wpm: "WPM",
      kpm: "Keystrokes/min",
      accuracy: "Accuracy",
      time: "Time",
      textRegion: "Practice text",
      codeRegion: "Practice code",
      source: "Local corpus",
      hintStart: "Start typing whenever you like · Enter = line break · Tab = indent · Esc restarts · F4 metronome · F6 menu",
      hintStarted: "Esc restarts the text · F4 metronome · F6 menu",
    },
  },
};

/** A `0..=1` ratio as a percentage in `locale`: the app's `90,5 %` (format.ts) in Spanish, `90.5%` in English. */
export const percentIn = (locale: Locale, ratio: number) => {
  const value = Math.round(ratio * 1000) / 10;
  return locale === "es" ? `${String(value).replace(".", ",")} %` : `${value}%`;
};
