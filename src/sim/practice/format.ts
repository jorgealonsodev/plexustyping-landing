// Copied verbatim from the PlexusTyping app: src/features/practice/format.ts (app commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390).
// Do not edit by hand: re-copy from the app instead.
/** `m:ss` from milliseconds. */
export function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export const formatWpm = (wpm: number) => String(Math.round(wpm));

/** A `0..=1` ratio as a Spanish percentage, e.g. `90,5 %`. */
export const formatPercent = (ratio: number) => `${String(Math.round(ratio * 1000) / 10).replace(".", ",")} %`;

const VISIBLE: Record<string, string> = { " ": "␣", "\n": "↵", "\t": "⇥" };

/** A char made visible in lists: a space shows as `␣`, a newline as `↵`, a tab as `⇥`. */
export const charLabel = (c: string) => VISIBLE[c] ?? c;
