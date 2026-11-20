// Copied verbatim from the PlexusTyping app: src/features/keyboard/types.ts (app commit 14f64cf2b9619deca9d99c2dbb3a2358586c5390).
// Do not edit by hand: re-copy from the app instead.
// Mirrors of the `plexustyping-layouts` types as the Tauri commands serialise them (camelCase).

export type Layer = "normal" | "shift" | "altgr";

/** One press of a physical key (`KeyboardEvent.code`) on a layer. */
export interface KeyPress {
  code: string;
  layer: Layer;
}

/** The char each layer of one physical key produces. */
export interface KeyLayers {
  normal: string | null;
  shift: string | null;
  altgr: string | null;
}

export interface Layout {
  id: string;
  name: string;
  deadKeys: string[];
  keys: Record<string, KeyLayers>;
}
