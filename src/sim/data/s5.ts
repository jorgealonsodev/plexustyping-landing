// Prerecorded data of the S5 metronome demo (labelled "demostración"; invented, not a real session).
// One beat is one expected keystroke (the app's metronome). Each run types TEXT once; its offsets say how far
// each keystroke fell from its beat, as a share of the beat interval (negative = early), so the replay and
// the app's rhythmSummary/adaptTempo agree at any tempo the visitor picks.
import type { Locale } from "../../i18n/paths";
import type { MetronomeSettings } from "../metronome/beat";
import { TEXT as EN_TEXT } from "./s5.en";

export const TEXT = "ritmo constante";

/** The demo's metronome: the app's defaults (click, 80 %, accent every 4) at a livelier 100 BPM, adaptive on. */
export const START: MetronomeSettings = {
  enabled: true,
  bpm: 100,
  sound: "click",
  volume: 80,
  accentEvery: 4,
  adaptive: true,
};

export interface Run {
  /** Accuracy of the run, 0–1 (both runs are typed without errors). */
  accuracy: number;
  /** One offset per char of TEXT, in beat intervals. */
  offsets: number[];
}

/** On the beat (mean ≈ 7 % of the interval): the adaptive tempo raises the next text's tempo. */
export const ON_BEAT: Run = {
  accuracy: 1,
  offsets: [0.02, -0.05, 0.08, -0.03, 0.11, -0.06, 0.04, 0.09, -0.12, 0.05, -0.02, 0.07, -0.1, 0.06, 0.03],
};

/** Losing the beat (mean ≈ 28 %): the adaptive tempo lowers it again. */
export const OFF_BEAT: Run = {
  accuracy: 1,
  offsets: [0.05, 0.18, 0.31, -0.22, 0.36, 0.27, -0.33, 0.4, 0.24, -0.38, 0.29, 0.35, -0.26, 0.42, 0.3],
};

/** The still state (server render and reduced motion): this many chars of the current run typed. */
export const STILL_TYPED = 8;

/** The text per site language; both have one offset per char of the runs above (English: ./s5.en.ts). */
export const S5_TEXTS: Record<Locale, string> = { es: TEXT, en: EN_TEXT };
