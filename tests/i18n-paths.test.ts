import { describe, expect, it } from "vitest";
import { localeFromPath, localizePath, mirrorPath } from "../src/i18n/paths";

describe("mirrorPath (language switch keeps the page)", () => {
  it.each([
    ["/", "/en"],
    ["/en", "/"],
    ["/descargar", "/en/download"],
    ["/en/download", "/descargar"],
    ["/docs/empezar/instalar-linux-deb", "/en/docs/getting-started/install-linux-deb"],
    ["/en/docs/getting-started/install-linux-deb", "/docs/empezar/instalar-linux-deb"],
  ])("%s -> %s", (from, to) => {
    expect(mirrorPath(from)).toBe(to);
  });

  it("never emits a trailing slash and tolerates one on input", () => {
    expect(mirrorPath("/descargar/")).toBe("/en/download");
    expect(mirrorPath("/en/")).toBe("/");
  });

  it("drops the .html suffix of file-format builds", () => {
    expect(mirrorPath("/descargar.html")).toBe("/en/download");
    expect(mirrorPath("/en.html")).toBe("/");
  });

  it("does not treat a Spanish page starting with 'en' as English", () => {
    expect(localeFromPath("/enlaces")).toBe("es");
    expect(mirrorPath("/enlaces")).toBe("/en/enlaces");
  });
});

describe("localizePath", () => {
  it("prefixes English and uses its English slug", () => {
    expect(localizePath("/", "es")).toBe("/");
    expect(localizePath("/", "en")).toBe("/en");
    expect(localizePath("/privacidad", "en")).toBe("/en/privacy");
    expect(localizePath("/privacidad", "es")).toBe("/privacidad");
  });
});
