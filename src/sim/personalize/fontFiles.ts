// The practice fonts' files, after the PlexusTyping app's src/features/settings/fontFiles.ts (app commit
// 14f64cf2b9619deca9d99c2dbb3a2358586c5390): the same @fontsource packages and versions, latin and latin-ext
// (OpenDyslexic ships latin only). Demo edits: weight 400 only (the practice text's), and nothing is loaded up
// front: the app bundles every @font-face, the demo adds a family through the FontFace API from same-origin
// files only when the visitor chooses it. JetBrains Mono (the default) is already on the site (src/styles/fonts.css).
import atkinsonLatin from "@fontsource/atkinson-hyperlegible-mono/files/atkinson-hyperlegible-mono-latin-400-normal.woff2?url&no-inline";
import atkinsonExt from "@fontsource/atkinson-hyperlegible-mono/files/atkinson-hyperlegible-mono-latin-ext-400-normal.woff2?url&no-inline";
import firaLatin from "@fontsource/fira-code/files/fira-code-latin-400-normal.woff2?url&no-inline";
import firaExt from "@fontsource/fira-code/files/fira-code-latin-ext-400-normal.woff2?url&no-inline";
import plexLatin from "@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2?url&no-inline";
import plexExt from "@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-ext-400-normal.woff2?url&no-inline";
import inconsolataLatin from "@fontsource/inconsolata/files/inconsolata-latin-400-normal.woff2?url&no-inline";
import inconsolataExt from "@fontsource/inconsolata/files/inconsolata-latin-ext-400-normal.woff2?url&no-inline";
import intelLatin from "@fontsource/intel-one-mono/files/intel-one-mono-latin-400-normal.woff2?url&no-inline";
import intelExt from "@fontsource/intel-one-mono/files/intel-one-mono-latin-ext-400-normal.woff2?url&no-inline";
import lexendLatin from "@fontsource/lexend-deca/files/lexend-deca-latin-400-normal.woff2?url&no-inline";
import lexendExt from "@fontsource/lexend-deca/files/lexend-deca-latin-ext-400-normal.woff2?url&no-inline";
import dyslexicLatin from "@fontsource/opendyslexic/files/opendyslexic-latin-400-normal.woff2?url&no-inline";
import robotoLatin from "@fontsource/roboto-mono/files/roboto-mono-latin-400-normal.woff2?url&no-inline";
import robotoExt from "@fontsource/roboto-mono/files/roboto-mono-latin-ext-400-normal.woff2?url&no-inline";
import sourceLatin from "@fontsource/source-code-pro/files/source-code-pro-latin-400-normal.woff2?url&no-inline";
import sourceExt from "@fontsource/source-code-pro/files/source-code-pro-latin-ext-400-normal.woff2?url&no-inline";

/** @fontsource's unicode ranges of its latin and latin-ext subsets (as in src/styles/fonts.css). */
const LATIN =
  "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";
const LATIN_EXT =
  "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF";

/** Each PRACTICE_FONTS family (fonts.ts) and its [latin, latin-ext] files; the default and JetBrains Mono need none. */
const FILES: Record<string, [string, string, string | null]> = {
  "roboto-mono": ["Roboto Mono", robotoLatin, robotoExt],
  "fira-code": ["Fira Code", firaLatin, firaExt],
  "source-code-pro": ["Source Code Pro", sourceLatin, sourceExt],
  "ibm-plex-mono": ["IBM Plex Mono", plexLatin, plexExt],
  inconsolata: ["Inconsolata", inconsolataLatin, inconsolataExt],
  "atkinson-hyperlegible-mono": ["Atkinson Hyperlegible Mono", atkinsonLatin, atkinsonExt],
  "intel-one-mono": ["Intel One Mono", intelLatin, intelExt],
  "lexend-deca": ["Lexend Deca", lexendLatin, lexendExt],
  opendyslexic: ["OpenDyslexic", dyslexicLatin, null],
};

const loaded = new Map<string, Promise<void>>();

/** Adds the font `id`'s faces to the document and waits for the latin one; a no-op for fonts already there. */
export function loadPracticeFont(id: string): Promise<void> {
  const files = FILES[id];
  if (!files) return Promise.resolve();
  let done = loaded.get(id);
  if (!done) {
    const [family, latin, ext] = files;
    const faces = [new FontFace(family, `url(${latin}) format("woff2")`, { unicodeRange: LATIN, display: "swap" })];
    if (ext) faces.push(new FontFace(family, `url(${ext}) format("woff2")`, { unicodeRange: LATIN_EXT, display: "swap" }));
    for (const face of faces) document.fonts.add(face);
    done = faces[0]!.load().then(() => undefined);
    loaded.set(id, done);
  }
  return done;
}
