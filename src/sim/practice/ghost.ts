// Copied from the PlexusTyping app: src/features/practice/ghost.ts (app commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390).
// Only the "Demo edit" lines differ: the Tauri `invoke` import and the command that used it are cut.
// Re-copy from the app instead of editing the rest by hand; exercised by tests/sim-s4.test.ts.
// Demo edit: no `invoke` (@tauri-apps/api/core) or `PracticeMode` (../code/api) imports.
import { formatWpm } from "./format";

// Ghost session (S1–S5): the profile's best earlier session with the same text races along.

/** `ghost_for_text`: the record session, its net PPM and the ms at which it passed each position. */
export interface Ghost {
  sessionId: number;
  netWpm: number;
  /** `times[i]`: ms after the record's first keystroke at which it passed position `i`; `null` if it never did. */
  times: (number | null)[];
}

// Demo edit: `ghostForText` (the `ghost_for_text` Tauri command) is cut; the demo's ghost is prerecorded
// (src/sim/data/s4.ts).

/**
 * The live difference with the record (S4): `+1,2 s` behind, `−0,8 s` ahead, `0,0 s` when equal;
 * one decimal (halves away from zero), Spanish comma, sign always shown.
 */
export function formatDelta(ms: number): string {
  const tenths = Math.round(Math.abs(ms) / 100);
  if (tenths === 0) return "0,0 s";
  const sign = ms > 0 ? "+" : "−";
  return `${sign}${(tenths / 10).toFixed(1).replace(".", ",")} s`;
}

/**
 * Where the ghost cursor is `elapsedMs` after the user's first keystroke (`null` before it): the
 * number of leading positions the record had passed by then. It waits at 0 before the first
 * keystroke, stays at `times.length` (the end) once there and stops before a position never reached.
 */
export function ghostPosition(times: (number | null)[], elapsedMs: number | null): number {
  if (elapsedMs === null) return 0;
  let i = 0;
  while (i < times.length && times[i] !== null && (times[i] as number) <= elapsedMs) i++;
  return i;
}

/** The user's side of the race: the delta at the last position the user passed for the first time. */
export class GhostRace {
  /** ms behind (positive) or ahead (negative) of the record; `null` until comparable. */
  delta: number | null = null;
  private reached = 0;

  constructor(private readonly times: (number | null)[]) {}

  /** The user's cursor is at `cursor`, `elapsedMs` after their first keystroke. */
  passed(cursor: number, elapsedMs: number) {
    if (cursor <= this.reached) return;
    this.reached = cursor;
    const record = this.times[cursor - 1];
    this.delta = record === null || record === undefined ? null : elapsedMs - record;
  }
}

export const NEW_RECORD = "¡Nuevo récord para este texto!";

/** Result lines of a raced text (S5); a saved session faster than the record is the new record. */
export function recordLines(recordWpm: number, netWpm: number, saved: boolean): string[] {
  const lines = [`Récord anterior: ${formatWpm(recordWpm)} PPM`];
  if (saved && netWpm > recordWpm) lines.push(NEW_RECORD);
  return lines;
}

/** Tooltip of the ghost button in the header. */
export const ghostToggleTitle = (on: boolean) =>
  on ? "Sesión fantasma activada: corres contra tu mejor sesión con el mismo texto" : "Sesión fantasma desactivada";
