// Copied from the PlexusTyping app: src/features/unlock/unlock.ts (app commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390).
// Demo edit: `PracticeMode` and `UnlockStatus` are imported from ./api, which holds only their types (the app's
// ../code/api and ./api call Tauri). Otherwise verbatim: re-copy from the app instead of editing by hand.
import type { PracticeMode, UnlockStatus } from "./api";
import type { Layout } from "../keyboard/types";

// Progressive unlock (S1, S6): settings, the progress line, the dimmed keys and the unlock notice.

/** Allowed target speeds (S1), as the backend accepts them. */
export const TARGET_WPMS: readonly number[] = [20, 30, 40, 50];
export const DEFAULT_TARGET_WPM = 30;

export const UNLOCK_SETTING = {
  label: "Desbloqueo progresivo",
  hint: "Empieza por la fila base y añade una tecla cada vez que dominas las activas",
} as const;

export const TARGET_SETTING = {
  label: "Velocidad objetivo",
  hint: "Velocidad a la que una tecla cuenta como dominada.",
} as const;

/** The mode shapes only prose texts: words and code ignore it (S1). */
export const unlockApplies = (status: UnlockStatus | null, practice: PracticeMode): status is UnlockStatus =>
  status !== null && status.enabled && practice === "prose";

const isLowerLetter = (ch: string) => /^\p{Ll}$/u.test(ch);

/** Distinct lowercase letters among the active chars, at most `total`. */
const activeLetters = (status: UnlockStatus) =>
  Math.min(new Set(status.active.filter(isLowerLetter)).size, status.total);

const allUnlocked = (status: UnlockStatus) => status.next === null && activeLetters(status) >= status.total;

/** "Teclas: 9/27 · siguiente: e" ("Teclas: 27/27" once done); `null` with the mode off. */
export function progressLine(status: UnlockStatus | null): string | null {
  if (!status?.enabled) return null;
  const count = `Teclas: ${activeLetters(status)}/${status.total}`;
  return status.next === null ? count : `${count} · siguiente: ${status.next}`;
}

/**
 * Codes of the keys to dim: those whose chars (on any layer) are all locked. Space is always
 * active and an uppercase letter is active with its lowercase (S2, S4); keys without chars stay lit.
 */
export function lockedKeys(layout: Layout | null, status: UnlockStatus | null): Set<string> {
  const locked = new Set<string>();
  if (!layout || !status?.enabled || allUnlocked(status)) return locked;
  const active = new Set(status.active);
  const isActive = (ch: string) => ch === " " || active.has(ch) || active.has(ch.toLowerCase());
  for (const [code, layers] of Object.entries(layout.keys)) {
    const chars = [layers.normal, layers.shift, layers.altgr].filter((c): c is string => c !== null);
    if (chars.length > 0 && !chars.some(isActive)) locked.add(code);
  }
  return locked;
}

/** Shown on the result screen of the session that unlocked `unlocked` (S6). */
export const unlockNotice = (unlocked: string | null | undefined): string | null =>
  unlocked ? `Nueva tecla desbloqueada: ${unlocked}` : null;
