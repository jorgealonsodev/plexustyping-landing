// Verbatim copy of the PlexusTyping app's src/features/metronome/beat.ts (app commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390).

// Pure metronome helpers (S7): beat timing, offsets and the rhythm summary.

import type { MetronomeConfig, Sound } from "./api";

/** Sounds in display order; the first is the default. */
export const SOUNDS: { id: Sound; label: string }[] = [
  { id: "click", label: "Clic" },
  { id: "wood", label: "Madera" },
  { id: "beep", label: "Bip" },
];

export const MIN_BPM = 30;
export const MAX_BPM = 300;
export const MAX_ACCENT_EVERY = 16;

/** The persisted metronome settings; volume in percent. */
export interface MetronomeSettings {
  enabled: boolean;
  bpm: number;
  sound: Sound;
  volume: number;
  accentEvery: number;
  /** Retune the tempo after each text from its accuracy and rhythm. */
  adaptive: boolean;
}

export const toConfig = (s: MetronomeSettings): MetronomeConfig => ({
  bpm: s.bpm,
  sound: s.sound,
  volume: s.volume / 100,
  accentEvery: s.accentEvery,
});

/** Beat 0 (epoch ms) and the tempo of the running metronome. */
export interface BeatAnchor {
  epochMs: number;
  intervalMs: number;
  bpm: number;
  accentEvery: number;
}

/** Ms from the nearest beat at or after beat 0 to `tMs`: negative = early, positive = late. */
export function beatOffsetMs(tMs: number, anchorMs: number, intervalMs: number): number {
  // Exactly halfway counts against the earlier beat (late).
  const beat = Math.max(Math.ceil((tMs - anchorMs) / intervalMs - 0.5), 0);
  return tMs - (anchorMs + beat * intervalMs);
}

/** The beat that last sounded at `tMs` and the time since it; `null` before beat 0. */
export function beatAt(tMs: number, anchorMs: number, intervalMs: number): { index: number; sinceMs: number } | null {
  if (tMs < anchorMs) return null;
  const index = Math.floor((tMs - anchorMs) / intervalMs);
  return { index, sinceMs: tMs - (anchorMs + index * intervalMs) };
}

/** Beat 0 and every `accentEvery`-th beat are accented; 0 disables the accent. */
export const isAccent = (index: number, accentEvery: number) => accentEvery > 0 && index % accentEvery === 0;

export interface RhythmSummary {
  /** Mean absolute offset, ms. */
  meanAbsMs: number;
  /** Shares of measured keys before and after the beat, in percent. */
  earlyPct: number;
  latePct: number;
}

/** Summary of the measured offsets; `null` when none was measured. */
export function rhythmSummary(offsets: (number | null)[]): RhythmSummary | null {
  const measured = offsets.filter((o): o is number => o !== null);
  if (measured.length === 0) return null;
  const share = (n: number) => (n / measured.length) * 100;
  return {
    meanAbsMs: measured.reduce((sum, o) => sum + Math.abs(o), 0) / measured.length,
    earlyPct: share(measured.filter((o) => o < 0).length),
    latePct: share(measured.filter((o) => o > 0).length),
  };
}

/** Adaptive tempo: raise at or above this accuracy when on the beat, lower below `LOWER_ACCURACY`. */
const RAISE_ACCURACY = 0.97;
const LOWER_ACCURACY = 0.9;
/**
 * Mean absolute offset as a share of the beat interval: on the beat up to `ON_BEAT`, lost above
 * `OFF_BEAT`. Typing unrelated to the beat averages 0.25; the gap between both keeps the tempo
 * from oscillating.
 */
const ON_BEAT = 0.15;
const OFF_BEAT = 0.2;
const TEMPO_STEP = 0.05;
const MIN_TEMPO_STEP = 2;

/**
 * The tempo for the next text after one typed entirely at `bpm` with `accuracy` (0–1) and
 * `offsets`: a step up when accurate and on the beat, a step down when inaccurate or off the
 * beat, else the same. Unchanged without measured offsets.
 */
export function adaptTempo(bpm: number, accuracy: number, offsets: (number | null)[]): number {
  const rhythm = rhythmSummary(offsets);
  if (!rhythm) return bpm;
  const drift = rhythm.meanAbsMs / (60_000 / bpm);
  const step = Math.max(Math.round(bpm * TEMPO_STEP), MIN_TEMPO_STEP);
  if (accuracy < LOWER_ACCURACY || drift > OFF_BEAT) return Math.max(bpm - step, MIN_BPM);
  if (accuracy >= RAISE_ACCURACY && drift <= ON_BEAT) return Math.min(bpm + step, MAX_BPM);
  return bpm;
}

/** The tempo a finished text was typed at and the one the adaptive metronome set for the next. */
export interface TempoChange {
  from: number;
  to: number;
}

/**
 * What the adaptive metronome sets after a scored text: `null` when the metronome was switched
 * on or off mid-text (`switched`), the text had no single tempo (`bpm`) or no measured keystroke.
 * Keystrokes before the first beat was known are unmeasured but do not stop the change.
 */
export function tempoChangeFor(
  bpm: number | null,
  accuracy: number,
  offsets: (number | null)[],
  switched: boolean,
): TempoChange | null {
  if (switched || bpm === null || !offsets.some((o) => o !== null)) return null;
  return { from: bpm, to: adaptTempo(bpm, accuracy, offsets) };
}

export const tempoNotice = ({ from, to }: TempoChange) =>
  from === to ? `Tempo: se mantiene en ${from} BPM` : `Tempo: ${from} → ${to} BPM`;

type ShortcutKey = Pick<KeyboardEvent, "key" | "ctrlKey" | "altKey" | "metaKey" | "shiftKey" | "repeat">;

/** A bare F4 turns the metronome on or off. */
export const isMetronomeShortcut = (k: ShortcutKey) =>
  k.key === "F4" && !k.ctrlKey && !k.altKey && !k.metaKey && !k.shiftKey && !k.repeat;

/** Tempo step of the quick − / + buttons. */
export const BPM_STEP = 5;

/** A tempo typed by hand: rounded and clamped to MIN_BPM..MAX_BPM; `current` when it is not a number. */
export function parseBpm(text: string, current: number): number {
  const value = Number(text.trim());
  if (text.trim() === "" || !Number.isFinite(value)) return current;
  return Math.min(MAX_BPM, Math.max(MIN_BPM, Math.round(value)));
}

/** The tempo one quick step up (`dir` 1) or down (-1): the next multiple of 5, inside 30–300. */
export function stepBpm(bpm: number, dir: 1 | -1): number {
  const next = dir > 0 ? Math.floor(bpm / BPM_STEP) * BPM_STEP + BPM_STEP : Math.ceil(bpm / BPM_STEP) * BPM_STEP - BPM_STEP;
  return Math.min(MAX_BPM, Math.max(MIN_BPM, next));
}
