// Website-only helper of the code demos: the key press of a code char, read from the layout itself.
// The prose demos use KEY_SEQUENCES (data/sequences.ts, generated from the app's sequences for prose
// chars); code needs brackets, operators and newlines, which that table does not list.
import type { KeyPress, Layer, Layout } from "../keyboard/types";

const LAYERS: Layer[] = ["normal", "shift", "altgr"];

/** The one press that types `ch` on `layout` (Enter for a newline), or `null` when no key types it. */
export function pressFor(layout: Layout, ch: string | undefined): KeyPress[] | null {
  if (ch === undefined) return null;
  if (ch === "\n") return [{ code: "Enter", layer: "normal" }];
  for (const layer of LAYERS)
    for (const [code, layers] of Object.entries(layout.keys)) if (layers[layer] === ch) return [{ code, layer }];
  return null;
}
