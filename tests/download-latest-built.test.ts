/**
 * The download pages link to GitHub's «latest release» page (odd/tasks/site-pages.md S16), which always shows
 * the newest release even when the page's data is stale. Over the built site; skipped without dist/.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "node-html-parser";
import { describe, expect, it } from "vitest";

const DIST = join(import.meta.dirname, "..", "dist");
const LATEST = "https://github.com/jorgealonsodev/plexustyping/releases/latest";

describe.skipIf(!existsSync(join(DIST, "descargar.html")))("latest release link on the download pages (S16)", () => {
  it.each([
    ["descargar.html", "Ver la última versión en GitHub"],
    ["en/download.html", "See the latest release on GitHub"],
  ])("%s links to releases/latest as «%s», next to the version facts", (file, label) => {
    const root = parse(readFileSync(join(DIST, file), "utf8"));
    const links = root.querySelectorAll(`a[href="${LATEST}"]`);
    expect(links.map((a) => a.text.trim())).toEqual([label]);
    expect(links[0]?.closest(".facts")).not.toBeNull();
  });
});
