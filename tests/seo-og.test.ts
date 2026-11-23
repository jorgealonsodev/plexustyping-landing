import { describe, expect, it } from "vitest";
import { renderLogoPng, renderOgCard } from "../src/lib/og/render";

const pngSize = (b: Uint8Array) => {
  const v = Buffer.from(b);
  return { sig: v.toString("ascii", 1, 4), w: v.readUInt32BE(16), h: v.readUInt32BE(20), bytes: v.length };
};

describe("Open Graph images (docs/seo-2026.md §A: PNG, 1200×630, under 300 KB)", () => {
  it("renders a 1200×630 PNG card under 300 KB with accented Spanish text", async () => {
    const png = await renderOgCard({ title: "Mecanografía que se adapta a tus fallos", eyebrow: "Documentación", locale: "es" });
    const s = pngSize(png);
    expect(s.sig).toBe("PNG");
    expect([s.w, s.h]).toEqual([1200, 630]);
    expect(s.bytes).toBeLessThan(300 * 1024);
  }, 30_000);

  it("renders the logo as a 512×512 PNG (Organization logo, at least 112 px)", async () => {
    const s = pngSize(await renderLogoPng());
    expect([s.sig, s.w, s.h]).toEqual(["PNG", 512, 512]);
  }, 30_000);
});
