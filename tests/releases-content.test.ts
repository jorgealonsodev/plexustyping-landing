// Release notes (src/content/releases): each file matches its real GitHub release (spec S2).
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import snapshot from "../src/data/release-snapshot.json";

const raw = readFileSync(join(import.meta.dirname, "../src/content/releases/0.1.0.md"), "utf8");
const fm = raw.match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? "";
const field = (k: string) => fm.match(new RegExp(`^${k}:\\s*"?(.*?)"?$`, "m"))?.[1] ?? "";

describe("release 0.1.0", () => {
  it("has the version, publication date and GitHub release of v0.1.0", () => {
    expect(field("version")).toBe("0.1.0");
    expect(field("date")).toBe("2026-11-19");
    expect(field("github")).toBe("https://github.com/jorgealonsodev/plexustyping/releases/tag/v0.1.0");
  });

  it("agrees with the committed release snapshot", () => {
    const s = snapshot as { tag_name?: string; published_at?: string };
    expect(s.tag_name).toBe("v0.1.0");
    expect(s.published_at?.slice(0, 10)).toBe(field("date"));
  });

  it("names the four published files", () => {
    for (const f of ["plexustyping_0.1.0_amd64.deb", "plexustyping-0.1.0-linux-x86_64.tar.gz", "PlexusTyping_0.1.0_x64-setup.exe", "SHA256SUMS"]) {
      expect(raw).toContain(f);
    }
  });
});
