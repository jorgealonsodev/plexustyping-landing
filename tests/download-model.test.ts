/**
 * The download page's data (spec S6, PRD §6.12): artifacts, sizes and SHA-256 sums grouped by OS,
 * straight from the release the build read, and the commands that verify them.
 */
import { describe, expect, it } from "vitest";
import { downloadModel, installSteps } from "../src/components/download/model";
import snapshot from "../src/data/release-snapshot.json";
import { parseRelease } from "../src/lib/release";

const release = parseRelease(snapshot, "snapshot");

describe("downloadModel", () => {
  it("groups the snapshot's artifacts by OS with their size and SHA-256", () => {
    const m = downloadModel(release);
    expect(m.version).toBe("0.1.0");
    expect(m.publishedAt).toBe("2026-11-19T15:31:07Z");
    expect(m.linux.deb.name).toBe("plexustyping_0.1.0_amd64.deb");
    expect(m.linux.deb.size).toBe(12512330);
    expect(m.linux.deb.sha256).toBe("fea1b0988907d6e01755defa940c46b4e1263156d45e0fe22adf482afc1d000f");
    expect(m.linux.tar.name).toBe("plexustyping-0.1.0-linux-x86_64.tar.gz");
    expect(m.linux.tar.sha256).toBe("dc4e79a5af27a44771daceff4afda6e8ff3092811bbaa863cfbc6dfceb31a2be");
    expect(m.windows.exe.name).toBe("PlexusTyping_0.1.0_x64-setup.exe");
    expect(m.windows.exe.size).toBe(9701277);
    expect(m.sums.name).toBe("SHA256SUMS");
    for (const a of [m.linux.deb, m.linux.tar, m.windows.exe, m.sums]) {
      expect(a.url.startsWith("https://github.com/jorgealonsodev/plexustyping/releases/download/v0.1.0/")).toBe(true);
    }
  });

  it("follows a newer release without hard-coded names", () => {
    const next = parseRelease(
      {
        ...snapshot,
        tag_name: "v0.2.0",
        html_url: "https://github.com/jorgealonsodev/plexustyping/releases/tag/v0.2.0",
        assets: snapshot.assets.map((a) => ({
          ...a,
          name: a.name.replaceAll("0.1.0", "0.2.0"),
          browser_download_url: a.browser_download_url.replaceAll("0.1.0", "0.2.0"),
        })),
      },
      "github",
    );
    const m = downloadModel(next);
    expect(m.version).toBe("0.2.0");
    expect(m.linux.deb.name).toBe("plexustyping_0.2.0_amd64.deb");
    expect(m.windows.exe.name).toBe("PlexusTyping_0.2.0_x64-setup.exe");
  });

  it("fails the build when an artifact is missing", () => {
    const broken = { ...release, assets: release.assets.filter((a) => a.kind !== "exe") };
    expect(() => downloadModel(broken)).toThrow(/exe/);
  });
});

describe("installSteps", () => {
  it("installs the .deb with apt and verifies it against SHA256SUMS", () => {
    const steps = installSteps(downloadModel(release));
    expect(steps.map((s) => s.name)).toEqual([
      "Descarga el paquete y SHA256SUMS",
      "Comprueba la suma SHA-256",
      "Instala el paquete",
      "Ábrelo",
    ]);
    expect(steps[1]?.text).toContain("sha256sum -c SHA256SUMS --ignore-missing");
    expect(steps[2]?.text).toContain("sudo apt install ./plexustyping_0.1.0_amd64.deb");
  });
});
