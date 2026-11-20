// Copied verbatim from the PlexusTyping app: src/features/keyboard/heat.ts (app commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390).
// Do not edit by hand: re-copy from the app instead.
import { keyForChar } from "./keys";
import type { Layout } from "./types";

/** Score of one char, as the `heatmap` command returns it. */
export interface CharScore {
  ch: string;
  score: number;
}

/** Number of tint steps above zero; each has a `.heat-N` class. */
export const HEAT_LEVELS = 10;

/**
 * The highest score of the chars each key produces, on any layer; a composed char
 * (`á`, `ü`) counts for its base key. Chars no key produces are skipped.
 */
export function heatScores(layout: Layout, scores: CharScore[]): Map<string, number> {
  const heat = new Map<string, number>();
  for (const { ch, score } of scores) {
    const code = keyForChar(layout, ch);
    if (code) heat.set(code, Math.max(heat.get(code) ?? 0, score));
  }
  return heat;
}

/** Tint step of a 0..1 score: 0 (no tint) to `HEAT_LEVELS`. */
export function heatLevel(score: number): number {
  if (!(score > 0)) return 0;
  return Math.min(HEAT_LEVELS, Math.round(score * HEAT_LEVELS));
}

/** Numeric heat levels shown on the keys (a11y S5): two tint steps per level. */
export const HEAT_RANKS = 5;

/** Level 1–5 of a tint step 1–10 (0 without tint), shown on the key as a non-colour cue. */
export function heatRank(level: number): number {
  if (!(level > 0)) return 0;
  return Math.min(HEAT_RANKS, Math.ceil(level / (HEAT_LEVELS / HEAT_RANKS)));
}

export const HEAT_LEGEND_TITLE = "Errores por tecla";

/** The legend of the heatmap: each level, its name and the tint step its swatch is drawn with. */
export const HEAT_LEGEND: { rank: number; name: string; tint: number }[] = [
  "muy pocos",
  "pocos",
  "algunos",
  "bastantes",
  "muchos",
].map((name, i) => ({ rank: i + 1, name, tint: (i + 1) * (HEAT_LEVELS / HEAT_RANKS) }));

/** The legend as one line, e.g. for its accessible name. */
export const heatLegendText = () =>
  `${HEAT_LEGEND_TITLE}: ${HEAT_LEGEND.map(({ rank, name }) => `${rank} ${name}`).join(", ")}`;
