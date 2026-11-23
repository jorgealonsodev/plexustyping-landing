/**
 * Build-time Open Graph images (docs/seo-2026.md §A, §B6): satori lays the card out as SVG, resvg
 * (WebAssembly) rasterizes it to PNG. PNG only (AVIF breaks several link previews), 1200×630.
 * Colors are the app's default theme (Catppuccin Mocha, src/styles/tokens.css); type is JetBrains Mono.
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { inflateSync } from "node:zlib";
import { initWasm, Resvg } from "@resvg/resvg-wasm";
import satori from "satori";
import logoSvg from "../../assets/logo.svg?raw";
import { OG_SIZE, SITE_NAME } from "../../data/site";
import type { Locale } from "../../i18n/paths";

const require = createRequire(import.meta.url);
const font = (weight: 400 | 700) =>
  readFileSync(require.resolve(`@fontsource/jetbrains-mono/files/jetbrains-mono-latin-${weight}-normal.woff`));

let wasmReady: Promise<void> | undefined;
const ready = () => (wasmReady ??= initWasm(readFileSync(require.resolve("@resvg/resvg-wasm/index_bg.wasm"))));

let fonts: { name: string; data: Buffer; weight: 400 | 700; style: "normal" }[] | undefined;
const getFonts = () =>
  (fonts ??= [
    { name: "JetBrains Mono", data: font(400), weight: 400, style: "normal" },
    { name: "JetBrains Mono", data: font(700), weight: 700, style: "normal" },
  ]);

/**
 * WOFF 1.0 -> OpenType (resvg reads only TTF/OTF; @fontsource ships WOFF/WOFF2). Each table is
 * inflated when compressed and laid out again behind a plain sfnt header.
 */
export function woffToSfnt(woff: Uint8Array): Uint8Array {
  const src = Buffer.from(woff);
  if (src.toString("ascii", 0, 4) !== "wOFF") throw new Error("not a WOFF 1.0 font");
  const numTables = src.readUInt16BE(12);
  const tables = Array.from({ length: numTables }, (_, i) => {
    const e = 44 + i * 20;
    const offset = src.readUInt32BE(e + 4);
    const compLength = src.readUInt32BE(e + 8);
    const origLength = src.readUInt32BE(e + 12);
    const raw = src.subarray(offset, offset + compLength);
    return {
      tag: src.subarray(e, e + 4),
      checksum: src.readUInt32BE(e + 16),
      data: compLength < origLength ? inflateSync(raw) : raw,
    };
  });
  const pad = (n: number) => (n + 3) & ~3;
  let size = 12 + numTables * 16;
  for (const t of tables) size += pad(t.data.length);
  const out = Buffer.alloc(size);
  out.writeUInt32BE(src.readUInt32BE(4), 0);
  out.writeUInt16BE(numTables, 4);
  const maxPow2 = 2 ** Math.floor(Math.log2(numTables));
  out.writeUInt16BE(maxPow2 * 16, 6);
  out.writeUInt16BE(Math.log2(maxPow2), 8);
  out.writeUInt16BE(numTables * 16 - maxPow2 * 16, 10);
  let offset = 12 + numTables * 16;
  tables.forEach((t, i) => {
    const r = 12 + i * 16;
    t.tag.copy(out, r);
    out.writeUInt32BE(t.checksum, r + 4);
    out.writeUInt32BE(offset, r + 8);
    out.writeUInt32BE(t.data.length, r + 12);
    t.data.copy(out, offset);
    offset += pad(t.data.length);
  });
  return out;
}

/**
 * The logo's "P" is SVG text in a system sans (Inter, Segoe UI, Helvetica, Arial). resvg has no
 * system fonts here, so it gets the closest bundled heavy sans, Lexend Deca 800.
 */
let logoFont: Uint8Array | undefined;
const getLogoFont = () =>
  (logoFont ??= woffToSfnt(readFileSync(require.resolve("@fontsource/lexend-deca/files/lexend-deca-latin-800-normal.woff"))));

const C = { bg: "#1e1e2e", surface: "#252536", border: "#3a3b4e", text: "#cdd6f4", muted: "#8f94ae", accent: "#89b4fa" };
const TAGLINE: Record<Locale, string> = {
  es: "Mecanografía adaptativa · Linux y Windows · Libre y sin conexión",
  en: "Adaptive typing · Linux and Windows · Free and offline",
};

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): Node => ({
  type,
  props: { style, children, ...extra },
});

async function toPng(svg: string, width: number): Promise<Uint8Array> {
  await ready();
  return new Resvg(svg, {
    fitTo: { mode: "width", value: width },
    font: { fontBuffers: [getLogoFont()], defaultFontFamily: "Lexend Deca", sansSerifFamily: "Lexend Deca" },
  })
    .render()
    .asPng();
}

export type OgCard = {
  /** Main line, usually the page's h1. */
  title: string;
  /** Small line above the title (section), optional. */
  eyebrow?: string;
  locale: Locale;
};

export async function renderOgCard(card: OgCard): Promise<Uint8Array> {
  const { width, height } = OG_SIZE;
  // The logo goes in as a PNG: resvg does not pass its fonts to nested SVG images, which would drop the "P".
  const logoUri = `data:image/png;base64,${Buffer.from(await renderLogoPng(176)).toString("base64")}`;
  const titleSize = card.title.length > 48 ? 56 : 68;
  const tree = h(
    "div",
    {
      width,
      height,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "64px 72px",
      background: C.bg,
      color: C.text,
      fontFamily: "JetBrains Mono",
      borderBottom: `12px solid ${C.accent}`,
    },
    [
      h("div", { display: "flex", alignItems: "center", gap: 24 }, [
        h("img", { width: 88, height: 88 }, undefined, { src: logoUri, width: 88, height: 88 }),
        h("div", { fontSize: 40, fontWeight: 700 }, SITE_NAME),
      ]),
      h("div", { display: "flex", flexDirection: "column", gap: 20 }, [
        ...(card.eyebrow ? [h("div", { fontSize: 28, color: C.accent }, card.eyebrow)] : []),
        h("div", { fontSize: titleSize, fontWeight: 700, lineHeight: 1.12, letterSpacing: -1 }, card.title),
      ]),
      h("div", { fontSize: 26, color: C.muted }, TAGLINE[card.locale]),
    ],
  );
  const svg = await satori(tree as Parameters<typeof satori>[0], { width, height, fonts: getFonts() });
  return toPng(svg, width);
}

/** The keycap logo as a 512×512 PNG (Organization logo: a raster image of at least 112×112). */
export async function renderLogoPng(size = 512): Promise<Uint8Array> {
  return toPng(logoSvg, size);
}
