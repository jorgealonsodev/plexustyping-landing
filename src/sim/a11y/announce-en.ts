// English translation of the PlexusTyping app's screen reader messages (announce.ts, copied from the app's
// src/features/practice/announce.ts at app commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390), for the
// English site's S10 demo (PRD S9 of site-pages: the app's interface labels translated on /en). The released
// app speaks Spanish only. Same functions, same structure; only the words change.
import { formatTime, formatWpm } from "../practice/format";

/** Spoken names of the chars a screen reader would skip or read ambiguously. */
const NAMES: Record<string, string> = {
  " ": "space",
  "\n": "line break",
  "\t": "tab",
  ",": "comma",
  ".": "period",
  ";": "semicolon",
  ":": "colon",
  "?": "question mark",
  "!": "exclamation mark",
  "(": "open parenthesis",
  ")": "close parenthesis",
  "[": "open bracket",
  "]": "close bracket",
  "{": "open brace",
  "}": "close brace",
  "<": "less than",
  ">": "greater than",
  '"': "quotation mark",
  "'": "apostrophe",
  "`": "backtick",
  "^": "caret",
  "~": "tilde",
  "-": "hyphen",
  _: "underscore",
  "–": "en dash",
  "—": "em dash",
  "…": "ellipsis",
  "/": "slash",
  "\\": "backslash",
  "|": "vertical bar",
  "@": "at sign",
  "#": "hash",
  $: "dollar",
  "€": "euro",
  "%": "percent",
  "&": "ampersand",
  "*": "asterisk",
  "+": "plus",
  "=": "equals",
};

/** How a char is spoken: invisible chars and punctuation by name, a capital letter as "capital e". */
export function spokenChar(c: string): string {
  const name = NAMES[c];
  if (name) return name;
  const lower = c.toLowerCase();
  return lower !== c ? `capital ${lower}` : c;
}

/** «next: a»; nothing once the text has no next char. */
export const nextCharMessage = (next: string | undefined) => (next === undefined ? "" : `next: ${spokenChar(next)}`);

/** «error: expected e, typed r». */
export const errorMessage = (expected: string, typed: string) =>
  `error: expected ${spokenChar(expected)}, typed ${spokenChar(typed)}`;

/** After a keystroke: the error of a wrong one, then the next char (after a wrong one only when the cursor moved). */
export function keystrokeMessage(
  wrong: { expected: string; typed: string } | null,
  next: string | undefined,
  moved: boolean,
): string {
  const following = nextCharMessage(next);
  if (!wrong) return following;
  const error = errorMessage(wrong.expected, wrong.typed);
  return moved && following ? `${error}. ${following}` : error;
}

/** The start of a new text: its length and the first char to type. */
export function newTextMessage(chars: readonly string[]): string {
  const length = `${chars.length} ${chars.length === 1 ? "character" : "characters"}`;
  const first = nextCharMessage(chars[0]);
  return first ? `New text of ${length}. ${first}` : `New text of ${length}.`;
}

/** An English percentage, e.g. `90.5%`. */
const percent = (ratio: number) => `${Math.round(ratio * 1000) / 10}%`;

/** The result line, with the figures the results screen shows first. */
export function resultMessage(stats: { netWpm: number; accuracy: number; durationMs: number; errors: number }): string {
  const errors = stats.errors === 0 ? "no errors" : `${stats.errors} ${stats.errors === 1 ? "error" : "errors"}`;
  return `Result: ${formatWpm(stats.netWpm)} net WPM, accuracy ${percent(stats.accuracy)}, time ${formatTime(stats.durationMs)}, ${errors}.`;
}
