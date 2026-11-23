// The app's own interface inside the simulations, per site language (S9 of odd/tasks/site-pages.md). Spanish
// pages show the app's real Spanish UI: every `es` entry is the app's string, taken from the copied app code
// where it lives there (so it cannot drift) or copied from the app's markup. English pages show the same UI
// translated (the released app's interface is Spanish only; the pages say so). Shared screen parts live here;
// the parts only one simulation shows live in that simulation's strings file (./s3.ts … ./s7.ts).
import type { Locale } from "../../i18n/paths";
import { NAMED_LABELS } from "../keyboard/geometry";
import { HEAT_LEGEND, HEAT_LEGEND_TITLE } from "../keyboard/heat";
import { formatPercent } from "../practice/format";

/** The practice screen: header, live stats, label line and text (Practice.svelte, App.svelte). */
export interface PracticeUi {
  tagline: string;
  profile: string;
  kinds: { prose: string; words: string; code: string };
  ai: string;
  input: string;
  liveStats: string;
  wpm: string;
  kpm: string;
  accuracy: string;
  time: string;
  /** "Practicando:", before the targets. */
  practising: string;
  practiceText: string;
  /** sourceLabel() of a local-corpus text. */
  localCorpus: string;
  /** The app's ratio as a percentage (`90,5 %` in Spanish). */
  percent: (ratio: number) => string;
}

export const PRACTICE_UI: Record<Locale, PracticeUi> = {
  es: {
    tagline: "Del cerebro a los dedos.",
    profile: "Principal",
    kinds: { prose: "Prosa", words: "Palabras", code: "Código" },
    ai: "IA",
    input: "Entrada de mecanografía",
    liveStats: "Estadísticas en vivo",
    wpm: "PPM",
    kpm: "Pulsaciones/min",
    accuracy: "Precisión",
    time: "Tiempo",
    practising: "Practicando:",
    practiceText: "Texto de práctica",
    localCorpus: "Corpus local",
    percent: formatPercent,
  },
  en: {
    tagline: "From brain to fingers.",
    profile: "Main",
    kinds: { prose: "Prose", words: "Words", code: "Code" },
    ai: "AI",
    input: "Typing input",
    liveStats: "Live stats",
    wpm: "WPM",
    kpm: "Keystrokes/min",
    accuracy: "Accuracy",
    time: "Time",
    practising: "Practicing:",
    practiceText: "Practice text",
    localCorpus: "Local corpus",
    percent: (ratio) => `${Math.round(ratio * 1000) / 10}%`,
  },
};

/** The result screen (Results.svelte). */
export interface ResultsUi {
  title: string;
  netWpm: string;
  grossWpm: string;
  errors: string;
  failed: string;
  noFailed: string;
  next: string;
  enter: string;
  repeat: string;
}

export const RESULTS_UI: Record<Locale, ResultsUi> = {
  es: {
    title: "Resultado",
    netWpm: "PPM netas",
    grossWpm: "PPM brutas",
    errors: "Errores",
    failed: "Caracteres fallados:",
    noFailed: "Sin fallos.",
    next: "Siguiente texto",
    enter: "Intro",
    repeat: "Repetir",
  },
  en: {
    title: "Result",
    netWpm: "Net WPM",
    grossWpm: "Gross WPM",
    errors: "Errors",
    failed: "Missed characters:",
    noFailed: "No mistakes.",
    next: "Next text",
    enter: "Enter",
    repeat: "Repeat",
  },
};

/** The on-screen keyboard: named keys and the heatmap legend (geometry.ts, heat.ts). */
export interface KeyboardUi {
  names: Record<string, string>;
  legendTitle: string;
  /** The legend's levels 1–5, lowest first. */
  legendNames: string[];
}

export const KEYBOARD_UI: Record<Locale, KeyboardUi> = {
  es: { names: NAMED_LABELS, legendTitle: HEAT_LEGEND_TITLE, legendNames: /* @__PURE__ */ HEAT_LEGEND.map((l) => l.name) },
  en: {
    names: {
      Backspace: "⌫",
      Tab: "Tab",
      Enter: "Enter",
      CapsLock: "Caps Lock",
      ShiftLeft: "Shift",
      ShiftRight: "Shift",
      ControlLeft: "Ctrl",
      ControlRight: "Ctrl",
      MetaLeft: "Super",
      AltLeft: "Alt",
      AltRight: "Alt",
    },
    legendTitle: "Errors per key",
    legendNames: ["very few", "few", "some", "quite a few", "many"],
  },
};

