// Types of the PlexusTyping app's progressive unlock, at app commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390:
// - UnlockStatus: src/features/unlock/api.ts, verbatim.
// - PracticeMode: src/features/code/api.ts, verbatim.
// Demo edit: only the types. The app's commands (`unlock_status`, `unlock_set`) call Tauri; the website has no
// backend, so its statuses are prerecorded (src/sim/data/s6.ts).

export type PracticeMode = "prose" | "words" | { kind: "code"; lang: string };

/** The beginner mode of one language and layout: whether it is on, its target speed and the unlock progress. */
export interface UnlockStatus {
  enabled: boolean;
  /** PPM a key must be typed at to count as mastered (20, 30, 40 or 50). */
  targetWpm: number;
  /** The chars that may appear in texts (the home row first, then one key at a time). */
  active: string[];
  mastered: string[];
  /** The key the next unlock adds; `null` once every letter is unlocked. */
  next: string | null;
  /** Letters of the full unlock order. */
  total: number;
  /** Sessions in a row without a newly mastered key (3 unlock the next one). */
  stalledSessions: number;
}
