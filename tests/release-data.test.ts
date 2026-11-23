import { describe, expect, it, vi } from "vitest";
import snapshot from "../src/data/release-snapshot.json";
import { loadLatestRelease, parseRelease, RELEASE_API_URL } from "../src/lib/release";

const live = {
  tag_name: "v0.2.0",
  name: "PlexusTyping 0.2.0",
  published_at: "2027-01-10T09:00:00Z",
  html_url: "https://github.com/jorgealonsodev/plexustyping/releases/tag/v0.2.0",
  assets: [
    {
      name: "plexustyping_0.2.0_amd64.deb",
      size: 100,
      digest: `sha256:${"a".repeat(64)}`,
      browser_download_url: "https://github.com/jorgealonsodev/plexustyping/releases/download/v0.2.0/plexustyping_0.2.0_amd64.deb",
    },
    {
      name: "plexustyping-0.2.0-linux-x86_64.tar.gz",
      size: 200,
      digest: `sha256:${"b".repeat(64)}`,
      browser_download_url: "https://github.com/jorgealonsodev/plexustyping/releases/download/v0.2.0/plexustyping-0.2.0-linux-x86_64.tar.gz",
    },
    {
      name: "PlexusTyping_0.2.0_x64-setup.exe",
      size: 300,
      digest: `sha256:${"c".repeat(64)}`,
      browser_download_url: "https://github.com/jorgealonsodev/plexustyping/releases/download/v0.2.0/PlexusTyping_0.2.0_x64-setup.exe",
    },
    {
      name: "SHA256SUMS",
      size: 40,
      digest: `sha256:${"d".repeat(64)}`,
      browser_download_url: "https://github.com/jorgealonsodev/plexustyping/releases/download/v0.2.0/SHA256SUMS",
    },
  ],
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

describe("parseRelease", () => {
  it("parses the committed snapshot (Log L2: v0.1.0, 2026-11-19, four assets with sizes and SHA-256)", () => {
    const r = parseRelease(snapshot, "snapshot");
    expect(r.version).toBe("0.1.0");
    expect(r.tag).toBe("v0.1.0");
    expect(r.publishedAt).toBe("2026-11-19T15:31:07Z");
    expect(r.url).toBe("https://github.com/jorgealonsodev/plexustyping/releases/tag/v0.1.0");
    expect(r.source).toBe("snapshot");
    expect(r.assets.map((a) => [a.name, a.size, a.kind, a.os])).toEqual([
      ["plexustyping-0.1.0-linux-x86_64.tar.gz", 12358708, "tar.gz", "linux"],
      ["plexustyping_0.1.0_amd64.deb", 12512330, "deb", "linux"],
      ["PlexusTyping_0.1.0_x64-setup.exe", 9701277, "exe", "windows"],
      ["SHA256SUMS", 299, "sums", null],
    ]);
    for (const a of r.assets) expect(a.sha256).toMatch(/^[0-9a-f]{64}$/);
    expect(r.assets.find((a) => a.kind === "deb")?.sha256).toBe(
      "fea1b0988907d6e01755defa940c46b4e1263156d45e0fe22adf482afc1d000f",
    );
  });

  it("rejects a release without a semantic version tag or a date", () => {
    expect(() => parseRelease({ ...live, tag_name: "nightly" }, "github")).toThrow(/tag/);
    expect(() => parseRelease({ ...live, published_at: null }, "github")).toThrow(/published_at/);
  });

  it("rejects an asset without a SHA-256 digest", () => {
    const assets = [{ ...live.assets[0], digest: undefined }];
    expect(() => parseRelease({ ...live, assets }, "github")).toThrow(/SHA-256/);
  });
});

describe("loadLatestRelease", () => {
  it("reads the latest release from the GitHub API, sending the token when there is one", async () => {
    const fetchFn = vi.fn(async () => jsonResponse(live));
    const r = await loadLatestRelease({ fetch: fetchFn, token: "t0k", mode: "auto" });
    expect(r.version).toBe("0.2.0");
    expect(r.source).toBe("github");
    expect(fetchFn).toHaveBeenCalledTimes(1);
    const [url, init] = fetchFn.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(RELEASE_API_URL);
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer t0k");
  });

  it("sends no Authorization header without a token", async () => {
    const fetchFn = vi.fn(async () => jsonResponse(live));
    await loadLatestRelease({ fetch: fetchFn, mode: "auto" });
    const [, init] = fetchFn.mock.calls[0] as unknown as [string, RequestInit];
    expect((init.headers as Record<string, string>).Authorization).toBeUndefined();
  });

  it("falls back to the committed snapshot when the network fails", async () => {
    const warn = vi.fn();
    const fetchFn = vi.fn(async () => {
      throw new TypeError("fetch failed");
    });
    const r = await loadLatestRelease({ fetch: fetchFn, mode: "auto", warn });
    expect(r.source).toBe("snapshot");
    expect(r.version).toBe("0.1.0");
    expect(warn).toHaveBeenCalledWith(expect.stringMatching(/snapshot/));
  });

  it("falls back to the snapshot on an HTTP error or an invalid body", async () => {
    const warn = vi.fn();
    const r1 = await loadLatestRelease({ fetch: async () => jsonResponse({}, 403), mode: "auto", warn });
    const r2 = await loadLatestRelease({ fetch: async () => jsonResponse({ tag_name: "x" }), mode: "auto", warn });
    expect([r1.source, r2.source]).toEqual(["snapshot", "snapshot"]);
  });

  it("never touches the network in snapshot mode", async () => {
    const fetchFn = vi.fn();
    const r = await loadLatestRelease({ fetch: fetchFn, mode: "snapshot" });
    expect(r.source).toBe("snapshot");
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it("fails instead of falling back in github mode", async () => {
    await expect(
      loadLatestRelease({ fetch: async () => jsonResponse({}, 500), mode: "github" }),
    ).rejects.toThrow(/500/);
  });
});
