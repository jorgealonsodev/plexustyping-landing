/**
 * Refreshes src/data/release-snapshot.json from the latest GitHub release (odd/tasks/site-pages.md S16, S6).
 *   pnpm refresh:release                         # GitHub API; GITHUB_TOKEN, when set, is sent as a bearer token
 *   node scripts/refresh-release-snapshot.ts --input api.json   # a saved API answer instead of the network
 *   … --snapshot <path>                          # another target file (tests)
 * The answer is trimmed to the snapshot's fields (the API's own shape: tag_name, name, published_at, html_url
 * and each asset's name, size, digest, browser_download_url, in the API's order), validated with the build's
 * parser (src/lib/release.ts: semantic tag, sha256 digests from the API, download URLs) plus the download
 * page's model (a .deb, a .tar.gz, an .exe and SHA256SUMS), and written with a stable key order and a trailing
 * newline only when the bytes differ. An invalid answer exits 1 and never touches the file.
 * Run hourly by .github/workflows/refresh-release.yml.
 */
import { readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { downloadModel } from "../src/components/download/model.ts";
import { fetchLatestReleaseJson, parseRelease } from "../src/lib/release.ts";

export const DEFAULT_SNAPSHOT = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "data", "release-snapshot.json");

export interface SnapshotAsset {
  name: string;
  size: number;
  digest: string;
  browser_download_url: string;
}

export interface Snapshot {
  tag_name: string;
  name: string | null;
  published_at: string;
  html_url: string;
  assets: SnapshotAsset[];
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

/** Trims a GitHub API release object to the snapshot's shape. Throws when it is not a usable release. */
export function trimRelease(raw: unknown): Snapshot {
  const release = parseRelease(raw, "github");
  downloadModel(release);
  const r = raw as Record<string, unknown>;
  const assets = (r.assets as unknown[]).map((a): SnapshotAsset => {
    if (!isRecord(a)) throw new Error("release: bad asset");
    if (!Number.isSafeInteger(a.size) || (a.size as number) <= 0) throw new Error(`release: asset ${String(a.name)} has a bad size`);
    return {
      name: a.name as string,
      size: a.size as number,
      digest: a.digest as string,
      browser_download_url: a.browser_download_url as string,
    };
  });
  const name = r.name;
  if (name !== null && typeof name !== "string") throw new Error("release: bad name");
  return { tag_name: release.tag, name, published_at: release.publishedAt, html_url: release.url, assets };
}

/** The file's bytes: keys in the order of the Snapshot type, two-space indent, trailing newline. */
export function serializeSnapshot(s: Snapshot): string {
  const ordered: Snapshot = {
    tag_name: s.tag_name,
    name: s.name,
    published_at: s.published_at,
    html_url: s.html_url,
    assets: s.assets.map((a) => ({ name: a.name, size: a.size, digest: a.digest, browser_download_url: a.browser_download_url })),
  };
  return `${JSON.stringify(ordered, null, 2)}\n`;
}

export interface MainDeps {
  fetch?: (url: string, init: RequestInit) => Promise<Response>;
  token?: string | undefined;
  log?: (message: string) => void;
  error?: (message: string) => void;
}

function option(args: string[], flag: string): string | undefined {
  const i = args.indexOf(flag);
  if (i === -1) return undefined;
  const v = args[i + 1];
  if (!v || v.startsWith("--")) throw new Error(`${flag} needs a path`);
  return v;
}

const tagOf = (text: string): string => {
  try {
    const t = (JSON.parse(text) as { tag_name?: unknown }).tag_name;
    return typeof t === "string" ? t : "?";
  } catch {
    return "?";
  }
};

/** Runs the refresh; returns the process exit code (0 written or unchanged, 1 invalid answer or error). */
export async function main(args: string[], deps: MainDeps = {}): Promise<number> {
  const log = deps.log ?? ((m: string) => console.log(m));
  const error = deps.error ?? ((m: string) => console.error(m));
  try {
    const target = resolve(option(args, "--snapshot") ?? DEFAULT_SNAPSHOT);
    const input = option(args, "--input");
    const raw: unknown = input
      ? JSON.parse(readFileSync(input, "utf8"))
      : await fetchLatestReleaseJson({
          ...("token" in deps ? { token: deps.token } : {}),
          ...(deps.fetch ? { fetch: deps.fetch } : {}),
          timeoutMs: 20_000,
        });
    const next = serializeSnapshot(trimRelease(raw));
    const current = readFileSync(target, "utf8");
    if (next === current) {
      log(`release snapshot: unchanged (${tagOf(next)})`);
      return 0;
    }
    // Write next to the target, then rename: the snapshot is never left half-written.
    const tmp = `${target}.tmp-${process.pid}`;
    writeFileSync(tmp, next);
    renameSync(tmp, target);
    log(`release snapshot: updated ${tagOf(current)} -> ${tagOf(next)}`);
    return 0;
  } catch (e) {
    const message = (e instanceof Error ? e.message : String(e)).replace(/^release: /, "");
    error(`release snapshot: ${message}; snapshot left unchanged`);
    return 1;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = await main(process.argv.slice(2));
}
