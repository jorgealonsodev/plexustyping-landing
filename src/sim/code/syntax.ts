// Copied verbatim from the PlexusTyping app: src/features/code/syntax.ts (app commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390).
// Do not edit by hand: re-copy from the app instead.
// Code mode helpers (S3, S4): syntax classes per char and the keys that type code.

import type { CharState, InputEvent, KeyAction } from "../practice/engine";

/** Semantic classes of `plexustyping-highlight`, each coloured by a `--syntax-<class>` variable. */
export const SYNTAX_CLASSES = [
  "plain",
  "keyword",
  "string",
  "number",
  "comment",
  "function",
  "type",
  "variable",
  "constant",
  "operator",
  "punctuation",
  "tag",
  "attribute",
  "property",
] as const;

export type TokenClass = (typeof SYNTAX_CLASSES)[number];

/** A run of code: char indices, `end` exclusive (`plexustyping-highlight::Token`). */
export interface Token {
  start: number;
  end: number;
  class: TokenClass;
}

/** The class of each of `length` chars; chars no token covers are plain. */
export function tokenClasses(length: number, tokens: readonly Token[] | undefined): TokenClass[] {
  const classes: TokenClass[] = Array.from({ length }, () => "plain");
  for (const t of tokens ?? []) for (let i = Math.max(t.start, 0); i < Math.min(t.end, length); i++) classes[i] = t.class;
  return classes;
}

/**
 * The event that Enter or Tab types in code mode (Enter = a measured newline, Tab = a Tab
 * event); `null` in prose and for every other key.
 */
export function codeKeyEvent(action: KeyAction | null, code: boolean, tMs: number): InputEvent | null {
  if (!code) return null;
  if (action === "enter") return { kind: "char", ch: "\n", tMs };
  if (action === "tab") return { kind: "tab", tMs };
  return null;
}

/** A subtle `↵` on a newline at the cursor or typed wrong; nothing elsewhere. */
export const newlineMark = (ch: string, state: CharState, cursor: boolean) =>
  ch === "\n" && (cursor || state === "error") ? "↵" : "";
