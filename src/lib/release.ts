/**
 * Latest PlexusTyping release, read at build time (PRD §6.12, §12; spec S6).
 *
 * The GitHub API is called only during the build, never from the browser. The Docker build in
 * Portainer may have no token and no network, so a committed snapshot (src/data/release-snapshot.json,
 * the API's own shape) is the fallback. RELEASE_SOURCE selects the behavior:
 * - "auto" (default): GitHub, falling back to the snapshot with a warning;
 * - "github": GitHub only, failing the build when it cannot be read (CI after a release event);
 * - "snapshot": the snapshot only, no network.
 * GITHUB_TOKEN, when set, is sent as a read-only bearer token (higher rate limit).
 * Refresh the snapshot after each release:
 *   curl -s https://api.github.com/repos/jorgealonsodev/plexustyping/releases/latest > (trim to the snapshot's fields)
 */
import snapshot from "../data/release-snapshot.json";

export const RELEASE_REPO = "jorgealonsodev/plexustyping";
export const RELEASE_API_URL = `https://api.github.com/repos/${RELEASE_REPO}/releases/latest`;

export type ReleaseMode = "auto" | "github" | "snapshot";
export type ReleaseSource = "github" | "snapshot";
export type AssetKind = "deb" | "tar.gz" | "exe" | "sums" | "other";

export interface ReleaseAsset {
  name: string;
  /** Bytes. */
  size: number;
  /** Lowercase hex SHA-256 of the file. */
  sha256: string;
  /** Download URL on GitHub Releases (the official origin). */
  url: string;
  kind: AssetKind;
  os: "linux" | "windows" | null;
}

export interface Release {
  /** "0.1.0" */
  version: string;
  /** "v0.1.0" */
  tag: string;
  /** ISO 8601 publication time, e.g. "2026-11-19T15:31:07Z". */
  publishedAt: string;
  /** Release page on GitHub. */
  url: string;
  assets: ReleaseAsset[];
  source: ReleaseSource;
}

function kindOf(name: string): AssetKind {
  if (name.endsWith(".deb")) return "deb";
  if (name.endsWith(".tar.gz")) return "tar.gz";
  if (name.endsWith(".exe")) return "exe";
  if (name === "SHA256SUMS") return "sums";
  return "other";
}

function osOf(kind: AssetKind): ReleaseAsset["os"] {
  if (kind === "deb" || kind === "tar.gz") return "linux";
  if (kind === "exe") return "windows";
  return null;
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

/** Validates a GitHub API release object (or the snapshot) and maps it to a Release. Throws on bad data. */
export function parseRelease(raw: unknown, source: ReleaseSource): Release {
  if (!isRecord(raw)) throw new Error("release: not an object");
  const tag = raw.tag_name;
  if (typeof tag !== "string" || !/^v\d+\.\d+\.\d+$/.test(tag)) throw new Error(`release: bad tag ${String(tag)}`);
  const publishedAt = raw.published_at;
  if (typeof publishedAt !== "string" || Number.isNaN(Date.parse(publishedAt))) {
    throw new Error("release: missing published_at");
  }
  const url = raw.html_url;
  if (typeof url !== "string" || !url.startsWith(`https://github.com/${RELEASE_REPO}/`)) {
    throw new Error("release: bad html_url");
  }
  if (!Array.isArray(raw.assets)) throw new Error("release: no assets");
  const assets = raw.assets.map((a: unknown): ReleaseAsset => {
    if (!isRecord(a) || typeof a.name !== "string" || typeof a.size !== "number") {
      throw new Error("release: bad asset");
    }
    const digest = typeof a.digest === "string" ? /^sha256:([0-9a-f]{64})$/.exec(a.digest) : null;
    if (!digest?.[1]) throw new Error(`release: asset ${a.name} has no SHA-256 digest`);
    const dl = a.browser_download_url;
    if (typeof dl !== "string" || !dl.startsWith(`https://github.com/${RELEASE_REPO}/releases/download/`)) {
      throw new Error(`release: asset ${a.name} has a bad download URL`);
    }
    const kind = kindOf(a.name);
    return { name: a.name, size: a.size, sha256: digest[1], url: dl, kind, os: osOf(kind) };
  });
  return { version: tag.slice(1), tag, publishedAt, url, assets, source };
}

export interface LoadOptions {
  mode?: ReleaseMode;
  token?: string | undefined;
  fetch?: (url: string, init: RequestInit) => Promise<Response>;
  timeoutMs?: number;
  warn?: (message: string) => void;
}

function envMode(): ReleaseMode {
  const m = process.env.RELEASE_SOURCE;
  return m === "github" || m === "snapshot" ? m : "auto";
}

/** Reads the latest release (see the module comment for modes). */
export async function loadLatestRelease(options: LoadOptions = {}): Promise<Release> {
  const mode = options.mode ?? envMode();
  const token = "token" in options ? options.token : process.env.GITHUB_TOKEN;
  const fetchFn = options.fetch ?? ((u: string, i: RequestInit) => fetch(u, i));
  const warn = options.warn ?? ((m: string) => console.warn(m));
  if (mode === "snapshot") return parseRelease(snapshot, "snapshot");
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "plexustyping-landing-build",
    };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetchFn(RELEASE_API_URL, { headers, signal: AbortSignal.timeout(options.timeoutMs ?? 8000) });
    if (!res.ok) throw new Error(`release: GitHub API answered ${res.status}`);
    return parseRelease(await res.json(), "github");
  } catch (error) {
    if (mode === "github") throw error;
    warn(`[release] ${error instanceof Error ? error.message : String(error)}; using the committed snapshot`);
    return parseRelease(snapshot, "snapshot");
  }
}

let cached: Promise<Release> | undefined;

/** The latest release, read once per build and shared by every page. */
export function getRelease(): Promise<Release> {
  cached ??= loadLatestRelease();
  return cached;
}
