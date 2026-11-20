// S7 "Hazla tuya": the theme files written by scripts/gen-sim-themes.ts (the app's own typingColors()).
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CURSOR_STYLES } from "../src/sim/personalize/cursor";
import { PRACTICE_FONTS, fontStyleVars } from "../src/sim/personalize/fonts";
import { THEMES } from "../src/sim/personalize/themes.generated";

const root = join(import.meta.dirname, "..");
const themeFile = (id: string): Record<string, string> =>
  JSON.parse(readFileSync(join(root, "public/sim/themes", `${id}.json`), "utf8"));

/** The variables of tokens.css's dark block (`:root, :root[data-theme="dark"]`): the app's default theme. */
function tokensDark(): Record<string, string> {
  const css = readFileSync(join(root, "src/styles/tokens.css"), "utf8");
  const block = /:root,\s*:root\[data-theme="dark"\]\s*\{([^}]*)\}/.exec(css)?.[1] ?? "";
  return Object.fromEntries([...block.matchAll(/([\w-]+):\s*([^;]+);/g)].map((m) => [m[1]!, m[2]!.trim()]));
}

describe("generated themes", () => {
  it("lists the app's 59 themes with their real names, the two high-contrast ones included", () => {
    expect(THEMES).toHaveLength(59);
    expect(new Set(THEMES.map((t) => t.id)).size).toBe(59);
    expect(THEMES[0]).toMatchObject({ id: "plexusterm", name: "PlexusTerm", dark: true });
    expect(THEMES.find((t) => t.id === "catppuccin-mocha")?.name).toBe("Catppuccin Mocha");
    const high = THEMES.filter((t) => t.highContrast).map((t) => [t.id, t.name, t.dark]);
    expect(high).toEqual([
      ["alto-contraste-oscuro", "Alto contraste oscuro", true],
      ["alto-contraste-claro", "Alto contraste claro", false],
    ]);
    const index = JSON.parse(readFileSync(join(root, "public/sim/themes/index.json"), "utf8"));
    expect(index.themes).toEqual(THEMES);
  });

  it("gives the default theme exactly the variables already in tokens.css", () => {
    const tokens = tokensDark();
    expect(Object.keys(tokens).length).toBeGreaterThan(70);
    expect(themeFile("catppuccin-mocha")).toEqual(tokens);
  });

  it("writes the full variable set for every theme", () => {
    const keys = Object.keys(themeFile("catppuccin-mocha")).sort();
    for (const { id, dark } of THEMES) {
      expect(existsSync(join(root, "public/sim/themes", `${id}.json`)), id).toBe(true);
      const vars = themeFile(id);
      expect(Object.keys(vars).sort(), id).toEqual(keys);
      for (const [name, value] of Object.entries(vars)) {
        if (name === "color-scheme") expect(value, id).toBe(dark ? "dark" : "light");
        else expect(value, `${id} ${name}`).toMatch(/^#[0-9a-f]{6}([0-9a-f]{2})?$/);
      }
    }
  });
});

describe("copied settings", () => {
  it("keeps the app's ten bundled fonts after the default and its five cursor styles", () => {
    expect(PRACTICE_FONTS.map((f) => f.name)).toEqual([
      "Predeterminada",
      "Roboto Mono",
      "JetBrains Mono",
      "Fira Code",
      "Source Code Pro",
      "IBM Plex Mono",
      "Inconsolata",
      "Atkinson Hyperlegible Mono",
      "Intel One Mono",
      "Lexend Deca",
      "OpenDyslexic",
    ]);
    expect(CURSOR_STYLES.map((c) => c.name)).toEqual(["Barra", "Resaltado", "Bloque", "Subrayado", "Contorno"]);
  });

  it("sets the practice font variables as the app's fontStyle does (Fira Code without ligatures)", () => {
    const fira = PRACTICE_FONTS.find((f) => f.id === "fira-code")!;
    expect(fontStyleVars(fira)).toEqual({ "--practice-font": '"Fira Code", var(--mono)', "--practice-features": '"liga" 0, "calt" 0' });
    expect(fontStyleVars(PRACTICE_FONTS[0]!)).toEqual({ "--practice-font": "var(--mono)", "--practice-features": "normal" });
  });
});
