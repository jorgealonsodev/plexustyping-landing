// Copied verbatim from the PlexusTyping app: src/features/keyboard/keys.ts (app commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390).
// Do not edit by hand: re-copy from the app instead.
// @ts-nocheck: verbatim app code, type-checked in the app under its own tsconfig (without this site's
// noUncheckedIndexedAccess), and exercised here by tests/sim-*.test.ts.
import { fingerOf, handOf } from "./geometry";
import type { KeyLayers, KeyPress, Layer, Layout } from "./types";

export type HighlightRole = "primary" | "modifier" | "secondary";

export interface Highlight {
  code: string;
  role: HighlightRole;
}

/** A typed key to flash; a new object flashes again, even on the same key. */
export interface Flash {
  code: string;
  ok: boolean;
}

/** The modifier key held for `press`: Shift of the opposite hand, or AltGr. */
function modifierFor(press: KeyPress): string | null {
  if (press.layer === "altgr") return "AltRight";
  if (press.layer !== "shift") return null;
  const finger = fingerOf(press.code);
  return finger && handOf(finger) === "right" ? "ShiftLeft" : "ShiftRight";
}

/**
 * Keys to highlight for the next expected char: its first press (with its modifier) to press now,
 * then, for a dead-key sequence, the base press as secondary. Each key appears once.
 */
export function highlightsFor(sequence: KeyPress[] | null | undefined): Highlight[] {
  const out: Highlight[] = [];
  const add = (code: string | null, role: HighlightRole) => {
    if (code && !out.some((h) => h.code === code)) out.push({ code, role });
  };
  sequence?.forEach((press, i) => {
    add(press.code, i === 0 ? "primary" : "secondary");
    add(modifierFor(press), i === 0 ? "modifier" : "secondary");
  });
  return out;
}

const LAYERS: Layer[] = ["normal", "shift", "altgr"];

/** The key whose layout produces `ch` (a composed char maps to its base key), for flashing it. */
export function keyForChar(layout: Layout, ch: string): string | null {
  const direct = (c: string) => {
    for (const layer of LAYERS)
      for (const [code, layers] of Object.entries(layout.keys)) if (layers[layer] === c) return code;
    return null;
  };
  const found = direct(ch);
  if (found) return found;
  const [base] = ch.normalize("NFD");
  return base !== ch ? direct(base) : null;
}

export interface KeyLabel {
  text: string;
  dead: boolean;
}

export interface KeyLabels {
  main: KeyLabel | null;
  shift: KeyLabel | null;
  altgr: KeyLabel | null;
}

/** Labels of one key from its layers; a shift char that only capitalises the letter is left out. */
export function keyLabels(layers: KeyLayers | undefined, deadKeys: string[]): KeyLabels {
  const label = (text: string | null | undefined): KeyLabel | null =>
    text && text.trim() ? { text, dead: deadKeys.includes(text) } : null;
  const normal = layers?.normal ?? null;
  const capitalOnly = !!normal && layers?.shift === normal.toUpperCase() && layers.shift !== normal;
  return { main: label(normal), shift: capitalOnly ? null : label(layers?.shift), altgr: label(layers?.altgr) };
}
