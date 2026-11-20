// Copied from the PlexusTyping app: src/features/practice/unlimited.ts (app commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390).
// Only the "Demo edit" lines differ: the app's Tauri/settings import chain is cut. Re-copy from the app
// instead of editing the rest by hand; exercised by tests/sim-s3.test.ts.
// @ts-nocheck: verbatim app code, type-checked in the app under its own tsconfig (without this site's
// noUncheckedIndexedAccess), as src/sim/practice/engine.ts.
// The "Ilimitado" length (unlimited S2, S3): a prose or words text that grows while it is typed.

// Demo edit: no `../code/api` or `../settings/settings` imports (they reach Tauri), so `requestLength` and
// `isUnlimited`, which need them, are left out. Everything else is the app's code unchanged.
import { type ErrorMode, type IndentMode, type InputEvent, TypingSession } from "./engine";

/** Chars of the first text, and about of each continuation, in unlimited mode. */
export const UNLIMITED_START = 600;
/** The continuation request carries at most this many chars of the current text (S4). */
export const TAIL_CHARS = 400;
/** After a failed continuation, the next one is asked this many chars later. */
export const RETRY_AFTER_CHARS = 50;
/** A continuation is also asked when at most this many chars remain ahead of the cursor (S5). */
export const CONTINUE_AHEAD = 400;
/** Near the end, a failed or empty continuation is asked again after this delay (S5). */
export const RETRY_DELAY_MS = 2500;
/** Longest wait for one continuation; a provider still silent by then counts as a failure (S5). */
export const CONTINUE_DEADLINE_MS = 25_000;

/** `promise`, or a rejection once `ms` pass without a reply (a stuck provider never stalls the text). */
export function withDeadline<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const late = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("La IA tardó demasiado en responder")), ms);
  });
  return Promise.race([promise, late]).finally(() => clearTimeout(timer));
}

export interface ContinueState {
  cursor: number;
  /** Chars of the current text. */
  length: number;
  /** A continuation is under way. */
  pending: boolean;
  /** No new request before the cursor gets here (after a failure; 0 otherwise). */
  retryFrom: number;
}

/**
 * Whether to ask for a continuation now: the cursor reached half of the current text or at most
 * 400 chars remain ahead of it (S5), one at a time and not before the retry point.
 */
export const shouldContinue = ({ cursor, length, pending, retryFrom }: ContinueState) =>
  length > 0 && !pending && cursor >= retryFrom && (cursor * 2 >= length || length - cursor <= CONTINUE_AHEAD);

/**
 * How the next continuation is asked after a failed or empty one (S5). Far from the end, 50 chars
 * later. At the end the cursor cannot move, so within 400 chars of it a timer asks again after
 * 2.5 s and no keystroke asks before it (`retryFrom` is unreachable until the timer resets it).
 */
export function retryPlan(cursor: number, length: number): { retryFrom: number; delayMs: number | null } {
  if (length - cursor <= CONTINUE_AHEAD) return { retryFrom: Number.POSITIVE_INFINITY, delayMs: RETRY_DELAY_MS };
  return { retryFrom: cursor + RETRY_AFTER_CHARS, delayMs: null };
}

/** The non-blocking notice of a failed continuation (S5). */
export const continuationFailureNotice = (reason: string) => `No se pudo continuar el texto: ${reason}; reintentando…`;

/** The notice above the text, and whether a continuation set it. */
export interface NoticeState {
  text: string | null;
  continuation: boolean;
}

/**
 * The notice after a continuation arrives (S5): its own notice, if any; without one, a previous
 * continuation notice is cleared and the text's own notice kept.
 */
export function noticeAfterContinuation(current: NoticeState, incoming: string | null | undefined): NoticeState {
  if (incoming) return { text: incoming, continuation: true };
  return current.continuation ? { text: null, continuation: false } : current;
}

/** The last ≤ 400 chars (Unicode scalars) of the current text. */
export const continuationTail = (chars: readonly string[]) => chars.slice(-TAIL_CHARS).join("");

/** What to append: the continuation, trimmed, after a single space (none when the text already ends in one). */
export function continuationPiece(chars: readonly string[], more: string): string {
  const body = more.trim();
  if (!body) return "";
  const last = chars.at(-1);
  return last === undefined || /\s/.test(last) ? body : ` ${body}`;
}

/** The text a finished unlimited session is scored against: chars 0..cursor (S3). */
export const typedPrefix = (chars: readonly string[], cursor: number) => chars.slice(0, cursor).join("");

/**
 * The events (and their metronome offsets) an ended session is scored with (S5): those up to the
 * one that first brought the cursor to the end of `prefix`, which is where the replay of the prefix
 * stops. A wrong key at the cursor under stop-on-error, or chars typed past it and erased, are
 * dropped, so the replay of chars 0..cursor completes for every error mode.
 */
export function prefixEvents<O>(
  prefix: string,
  mode: ErrorMode,
  events: readonly InputEvent[],
  offsets: readonly O[],
  indent: IndentMode = "manual",
): { events: InputEvent[]; offsets: O[] } {
  const replayed = new TypingSession(prefix, mode, indent);
  let kept = 0;
  while (kept < events.length && !replayed.completed) replayed.apply(events[kept++]);
  return { events: events.slice(0, kept), offsets: offsets.slice(0, kept) };
}

/** Ending with nothing typed discards the session unscored (S3). */
export const endAction = (cursor: number): "discard" | "score" => (cursor === 0 ? "discard" : "score");
