// Copied from the PlexusTyping app: src/features/practice/announce.ts (app commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390).
// Verbatim except the import path of format.ts (the app has it beside this file; here it is in ../practice/).
// Do not edit by hand: re-copy from the app instead.
// What the screen reader mode (a11y S3) says in its polite `aria-live` region. Pure, so the wording is tested.
import { formatPercent, formatTime, formatWpm } from "../practice/format";

/** Spoken names of the chars a screen reader would skip or read ambiguously. */
const NAMES: Record<string, string> = {
  " ": "espacio",
  "\n": "salto de línea",
  "\t": "tabulador",
  ",": "coma",
  ".": "punto",
  ";": "punto y coma",
  ":": "dos puntos",
  "¿": "abre interrogación",
  "?": "cierra interrogación",
  "¡": "abre exclamación",
  "!": "cierra exclamación",
  "(": "abre paréntesis",
  ")": "cierra paréntesis",
  "[": "abre corchete",
  "]": "cierra corchete",
  "{": "abre llave",
  "}": "cierra llave",
  "<": "menor que",
  ">": "mayor que",
  "«": "abre comillas angulares",
  "»": "cierra comillas angulares",
  '"': "comillas",
  "'": "apóstrofo",
  "`": "acento grave",
  "´": "acento agudo",
  "^": "circunflejo",
  "¨": "diéresis",
  "~": "virgulilla",
  "-": "guion",
  "_": "guion bajo",
  "–": "guion medio",
  "—": "raya",
  "…": "puntos suspensivos",
  "/": "barra",
  "\\": "barra invertida",
  "|": "barra vertical",
  "@": "arroba",
  "#": "almohadilla",
  $: "dólar",
  "€": "euro",
  "%": "por ciento",
  "&": "et",
  "*": "asterisco",
  "+": "más",
  "=": "igual",
  "·": "punto medio",
  "º": "ordinal masculino",
  "ª": "ordinal femenino",
};

/** How a char is spoken: invisible chars and punctuation by name, a capital letter as "e mayúscula". */
export function spokenChar(c: string): string {
  const name = NAMES[c];
  if (name) return name;
  const lower = c.toLowerCase();
  return lower !== c ? `${lower} mayúscula` : c;
}

/** «siguiente: a»; nothing once the text has no next char. */
export const nextCharMessage = (next: string | undefined) => (next === undefined ? "" : `siguiente: ${spokenChar(next)}`);

/** «error: esperaba e, pulsaste r». */
export const errorMessage = (expected: string, typed: string) =>
  `error: esperaba ${spokenChar(expected)}, pulsaste ${spokenChar(typed)}`;

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
  const length = `${chars.length} ${chars.length === 1 ? "carácter" : "caracteres"}`;
  const first = nextCharMessage(chars[0]);
  return first ? `Texto nuevo de ${length}. ${first}` : `Texto nuevo de ${length}.`;
}

/** The result line, with the figures the results screen shows first. */
export function resultMessage(stats: { netWpm: number; accuracy: number; durationMs: number; errors: number }): string {
  const errors = stats.errors === 0 ? "sin errores" : `${stats.errors} ${stats.errors === 1 ? "error" : "errores"}`;
  return `Resultado: ${formatWpm(stats.netWpm)} PPM netas, precisión ${formatPercent(stats.accuracy)}, tiempo ${formatTime(stats.durationMs)}, ${errors}.`;
}

/** `message`, changed invisibly when it repeats `previous`: a live region announces only changed text. */
export const freshen = (message: string, previous: string) => (message === previous ? `${message}\u00a0` : message);

/** The live region's text: nothing while the setting is off. */
export const liveText = (enabled: boolean, message: string) => (enabled ? message : "");
