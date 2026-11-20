// TypeScript port of the PlexusTyping app's Rust `Layout::locate` (crates/plexustyping-layouts/src/lib.rs,
// app commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390), which the `key_sequences` command (src-tauri/src/commands.rs) maps over each char.
// The app gets these presses from Rust over IPC; the website has no Rust, so scripts/gen-sim-data.ts
// runs this port at authoring time and the demo ships its output (src/sim/data/sequences.ts).
import type { KeyPress, Layer, Layout } from "./types";

/** Layers in lookup preference order (`KeyLayers::layers`). */
const LAYERS: Layer[] = ["normal", "shift", "altgr"];

/** Combining mark applied by a dead-key character (`combining_mark`). */
const COMBINING: Record<string, string> = { "´": "́", "`": "̀", "^": "̂", "¨": "̈", "~": "̃" };

/** All presses, ordered by layer preference, then code (Rust's BTreeMap order; codes are ASCII). */
function presses(layout: Layout): { code: string; layer: Layer; ch: string }[] {
  const codes = Object.keys(layout.keys).sort();
  return LAYERS.flatMap((layer) =>
    codes.flatMap((code) => {
      const ch = layout.keys[code]?.[layer];
      return ch ? [{ code, layer, ch }] : [];
    }),
  );
}

/** Preferred single press producing `ch` (`single_press`). */
function singlePress(layout: Layout, ch: string): KeyPress | null {
  const found = presses(layout).find((p) => p.ch === ch);
  return found ? { code: found.code, layer: found.layer } : null;
}

/** The char typed by the dead key `dead` then `base`, if it is one precomposed char (`compose`). */
export function compose(layout: Layout, dead: string, base: string): string | null {
  if (!layout.deadKeys.includes(dead)) return null;
  const mark = COMBINING[dead];
  if (!mark) return null;
  const composed = (base + mark).normalize("NFC");
  return [...composed].length === 1 ? composed : null;
}

/**
 * Shortest key sequence that types `ch`: one press (preferring Normal, then Shift, then AltGr) or a dead
 * key followed by its base. A space falls back to Space and a newline to Enter; a dead key alone is not
 * typeable (`null`).
 */
export function locate(layout: Layout, ch: string): KeyPress[] | null {
  if (layout.deadKeys.includes(ch)) return null;
  const single = singlePress(layout, ch);
  if (single) return [single];
  if (ch === " ") return [{ code: "Space", layer: "normal" }];
  if (ch === "\n") return [{ code: "Enter", layer: "normal" }];
  for (const dead of layout.deadKeys) {
    const deadPress = singlePress(layout, dead);
    if (!deadPress) continue;
    const base = presses(layout).find((p) => !layout.deadKeys.includes(p.ch) && compose(layout, dead, p.ch) === ch);
    if (base) return [deadPress, { code: base.code, layer: base.layer }];
  }
  return null;
}
