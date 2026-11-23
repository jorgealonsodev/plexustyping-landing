/**
 * The hourly release refresh (odd/tasks/site-pages.md S16, T13): scripts/refresh-release-snapshot.ts trims the
 * GitHub API's latest release to the committed snapshot's shape, rewrites src/data/release-snapshot.json only
 * when the release changed, and fails without touching it on an invalid response. No network: fixtures only.
 */
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { main, serializeSnapshot, trimRelease } from "../scripts/refresh-release-snapshot";

const ROOT = join(import.meta.dirname, "..");
const SNAPSHOT = join(ROOT, "src", "data", "release-snapshot.json");
/** The starting file of the write tests: the v0.1.0 snapshot, frozen (the committed one follows new releases). */
const FROZEN = join(ROOT, "tests", "fixtures", "release-v0.1.0.json");
const SCRIPT = join(ROOT, "scripts", "refresh-release-snapshot.ts");
const REPO = "https://github.com/jorgealonsodev/plexustyping";

/** The API answer for the committed release: the snapshot's fields plus the noise the API adds. */
function apiFrom(snapshot: Record<string, unknown>) {
  const assets = (snapshot.assets as Record<string, unknown>[]).map((a, i) => ({
    url: `https://api.github.com/repos/jorgealonsodev/plexustyping/releases/assets/${i}`,
    id: i,
    uploader: { login: "jorgealonsodev" },
    content_type: "application/octet-stream",
    download_count: 42,
    ...a,
  }));
  return { url: "x", id: 1, body: "notes", draft: false, prerelease: false, author: { login: "a" }, ...snapshot, assets };
}

const asset = (name: string, size: number, hex: string, tag = "v0.2.0") => ({
  id: size,
  name,
  size,
  digest: `sha256:${hex.repeat(64)}`,
  download_count: 0,
  browser_download_url: `${REPO}/releases/download/${tag}/${name}`,
});

const v020 = {
  id: 2,
  tag_name: "v0.2.0",
  name: "PlexusTyping 0.2.0",
  draft: false,
  published_at: "2027-01-10T09:00:00Z",
  html_url: `${REPO}/releases/tag/v0.2.0`,
  assets: [
    asset("plexustyping-0.2.0-linux-x86_64.tar.gz", 200, "b"),
    asset("plexustyping_0.2.0_amd64.deb", 100, "a"),
    asset("PlexusTyping_0.2.0_x64-setup.exe", 300, "c"),
    asset("SHA256SUMS", 40, "d"),
  ],
};

const V020_SNAPSHOT = `{
  "tag_name": "v0.2.0",
  "name": "PlexusTyping 0.2.0",
  "published_at": "2027-01-10T09:00:00Z",
  "html_url": "${REPO}/releases/tag/v0.2.0",
  "assets": [
    {
      "name": "plexustyping-0.2.0-linux-x86_64.tar.gz",
      "size": 200,
      "digest": "sha256:${"b".repeat(64)}",
      "browser_download_url": "${REPO}/releases/download/v0.2.0/plexustyping-0.2.0-linux-x86_64.tar.gz"
    },
    {
      "name": "plexustyping_0.2.0_amd64.deb",
      "size": 100,
      "digest": "sha256:${"a".repeat(64)}",
      "browser_download_url": "${REPO}/releases/download/v0.2.0/plexustyping_0.2.0_amd64.deb"
    },
    {
      "name": "PlexusTyping_0.2.0_x64-setup.exe",
      "size": 300,
      "digest": "sha256:${"c".repeat(64)}",
      "browser_download_url": "${REPO}/releases/download/v0.2.0/PlexusTyping_0.2.0_x64-setup.exe"
    },
    {
      "name": "SHA256SUMS",
      "size": 40,
      "digest": "sha256:${"d".repeat(64)}",
      "browser_download_url": "${REPO}/releases/download/v0.2.0/SHA256SUMS"
    }
  ]
}
`;

const committed = readFileSync(SNAPSHOT, "utf8");
const frozen = readFileSync(FROZEN, "utf8");

const invalid: [string, unknown][] = [
  ["no tag", { ...v020, tag_name: undefined }],
  ["a tag that is not a version", { ...v020, tag_name: "nightly" }],
  ["a missing .exe", { ...v020, assets: v020.assets.filter((a) => !a.name.endsWith(".exe")) }],
  ["a missing .deb", { ...v020, assets: v020.assets.filter((a) => !a.name.endsWith(".deb")) }],
  ["a missing .tar.gz", { ...v020, assets: v020.assets.filter((a) => !a.name.endsWith(".tar.gz")) }],
  ["a missing SHA256SUMS", { ...v020, assets: v020.assets.filter((a) => a.name !== "SHA256SUMS") }],
  ["a malformed sha256", { ...v020, assets: v020.assets.map((a, i) => (i === 1 ? { ...a, digest: "sha256:XYZ" } : a)) }],
  ["an asset without digest", { ...v020, assets: v020.assets.map((a, i) => (i === 0 ? { ...a, digest: null } : a)) }],
  ["a non-integer size", { ...v020, assets: v020.assets.map((a, i) => (i === 2 ? { ...a, size: -1 } : a)) }],
  ["an API error body", { message: "API rate limit exceeded", documentation_url: "https://docs.github.com" }],
];

describe("trimRelease / serializeSnapshot", () => {
  it("trims the API answer to the snapshot's fields, keys in a stable order, trailing newline", () => {
    expect(serializeSnapshot(trimRelease(v020))).toBe(V020_SNAPSHOT);
  });

  it("the committed snapshot and the frozen v0.1.0 one round-trip to identical bytes", () => {
    expect(serializeSnapshot(trimRelease(apiFrom(JSON.parse(committed))))).toBe(committed);
    expect(serializeSnapshot(trimRelease(apiFrom(JSON.parse(frozen))))).toBe(frozen);
  });

  it.each(invalid)("rejects %s", (_label, raw) => {
    expect(() => trimRelease(raw)).toThrow();
  });
});

describe("main (injected fetch)", () => {
  let dir: string;
  let file: string;
  const out: string[] = [];
  const err: string[] = [];
  const io = { log: (m: string) => out.push(m), error: (m: string) => err.push(m) };
  const answer = (body: unknown, status = 200) => async () =>
    new Response(typeof body === "string" ? body : JSON.stringify(body), { status });

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "refresh-release-"));
    file = join(dir, "release-snapshot.json");
    copyFileSync(FROZEN, file);
    out.length = 0;
    err.length = 0;
  });
  afterEach(() => rmSync(dir, { recursive: true, force: true }));

  it("a new release rewrites the snapshot and exits 0", async () => {
    const code = await main(["--snapshot", file], { fetch: answer(v020), ...io });
    expect(code).toBe(0);
    expect(readFileSync(file, "utf8")).toBe(V020_SNAPSHOT);
    expect(out).toEqual(["release snapshot: updated v0.1.0 -> v0.2.0"]);
    expect(err).toEqual([]);
  });

  it("the same release leaves identical bytes and does not write the file", async () => {
    const before = statSync(file).mtimeMs;
    const code = await main(["--snapshot", file], { fetch: answer(apiFrom(JSON.parse(frozen))), ...io });
    expect(code).toBe(0);
    expect(readFileSync(file, "utf8")).toBe(frozen);
    expect(statSync(file).mtimeMs).toBe(before);
    expect(out).toEqual(["release snapshot: unchanged (v0.1.0)"]);
  });

  it.each([...invalid, ["not JSON", "<html>"] as [string, unknown]])(
    "%s exits 1 and leaves the file untouched",
    async (_label, raw) => {
      const code = await main(["--snapshot", file], { fetch: answer(raw), ...io });
      expect(code).toBe(1);
      expect(readFileSync(file, "utf8")).toBe(frozen);
      expect(out).toEqual([]);
      expect(err).toHaveLength(1);
      expect(err[0]).toMatch(/^release snapshot: .+; snapshot left unchanged$/);
    },
  );

  it("an HTTP error exits 1 and leaves the file untouched", async () => {
    const code = await main(["--snapshot", file], { fetch: answer({ message: "Not Found" }, 404), ...io });
    expect(code).toBe(1);
    expect(readFileSync(file, "utf8")).toBe(frozen);
    expect(err).toEqual(["release snapshot: GitHub API answered 404; snapshot left unchanged"]);
  });

  it("sends GITHUB_TOKEN as a bearer token, and no Authorization without it", async () => {
    const seen: (string | undefined)[] = [];
    const fetch = async (_u: string, init: RequestInit) => {
      seen.push((init.headers as Record<string, string>).Authorization);
      return new Response(JSON.stringify(v020));
    };
    await main(["--snapshot", file], { fetch, token: "t0k", ...io });
    await main(["--snapshot", file], { fetch, token: undefined, ...io });
    expect(seen).toEqual(["Bearer t0k", undefined]);
  });
});

describe("CLI (node, --input fixture, no network)", () => {
  let dir: string;
  let file: string;
  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "refresh-release-cli-"));
    file = join(dir, "release-snapshot.json");
    copyFileSync(FROZEN, file);
  });
  afterEach(() => rmSync(dir, { recursive: true, force: true }));

  const run = (input: unknown) => {
    const fixture = join(dir, "api.json");
    writeFileSync(fixture, typeof input === "string" ? input : JSON.stringify(input));
    return spawnSync(process.execPath, [SCRIPT, "--input", fixture, "--snapshot", file], { encoding: "utf8" });
  };

  it("changed release: exit 0, file rewritten", () => {
    const r = run(v020);
    expect([r.status, r.stdout, r.stderr]).toEqual([0, "release snapshot: updated v0.1.0 -> v0.2.0\n", ""]);
    expect(readFileSync(file, "utf8")).toBe(V020_SNAPSHOT);
  });

  it("unchanged release: exit 0, identical bytes", () => {
    const r = run(apiFrom(JSON.parse(frozen)));
    expect([r.status, r.stdout, r.stderr]).toEqual([0, "release snapshot: unchanged (v0.1.0)\n", ""]);
    expect(readFileSync(file, "utf8")).toBe(frozen);
  });

  it("invalid response: exit 1, file untouched", () => {
    const r = run({ ...v020, assets: [] });
    expect(r.status).toBe(1);
    expect(r.stdout).toBe("");
    expect(r.stderr).toMatch(/^release snapshot: .+; snapshot left unchanged\n$/);
    expect(readFileSync(file, "utf8")).toBe(frozen);
  });

  it("package.json runs it as refresh:release", () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
    expect(pkg.scripts["refresh:release"]).toBe("node scripts/refresh-release-snapshot.ts");
  });
});
