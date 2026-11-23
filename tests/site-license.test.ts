// S13 of odd/tasks/site-pages.md: the site is licensed MIT OR Apache-2.0, like the app.
import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("site license (S13)", () => {
  it("ships both license texts and declares them in package.json", () => {
    expect(readFileSync("LICENSE-MIT", "utf8")).toMatch(/^MIT License/);
    expect(readFileSync("LICENSE-APACHE", "utf8")).toContain("Apache License");
    expect(JSON.parse(readFileSync("package.json", "utf8")).license).toBe("MIT OR Apache-2.0");
  });

  it("README states the license", () => {
    const readme = readFileSync("README.md", "utf8");
    expect(readme).not.toContain("does not declare a license");
    expect(readme).toContain("MIT OR Apache-2.0");
  });

  describe.skipIf(!existsSync("dist/licencias.html"))("built licenses pages", () => {
    it.each([
      ["dist/licencias.html", "no declara una licencia", "MIT o Apache-2.0"],
      ["dist/en/licenses.html", "does not declare a license", "MIT or Apache-2.0"],
    ])("%s names the site license", (file, stale, current) => {
      const html = readFileSync(file, "utf8");
      expect(html).not.toContain(stale);
      const section = html.slice(html.indexOf('id="esta-web"') >= 0 ? html.indexOf('id="esta-web"') : html.indexOf('id="this-website"'));
      expect(section.slice(0, 1200)).toContain(current);
    });
  });
});
