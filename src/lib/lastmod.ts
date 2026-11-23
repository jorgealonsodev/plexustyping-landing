/**
 * Sitemap <lastmod> from the git history (docs/seo-2026.md §B5): the commit date of the file a page
 * is built from, never the build time. Without git, in a shallow clone (where every file would get the
 * date of the one fetched commit) or for an uncommitted file there is no date, and the URL is listed
 * without <lastmod>. The Docker build keeps .git in its context and installs git for this.
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

/** Repository-relative source candidates of a language-neutral or localized URL path, most specific first. */
export function sourceCandidates(pathname: string): string[] {
  const p = pathname.replace(/\/+$/, "") || "/";
  const en = p === "/en" || p.startsWith("/en/");
  const neutral = en ? p.slice(3) || "/" : p;
  const out: string[] = [];
  const content = (dir: string, slug: string) =>
    [".md", ".mdx"].map((ext) => `src/content/${dir}/${en ? "en/" : ""}${slug}${ext}`);
  if (neutral.startsWith("/docs/")) out.push(...content("docs", neutral.slice(6)));
  if (neutral.startsWith("/funciones/")) out.push(...content("features", neutral.slice(11)));
  const page = p === "/" ? "/index" : p;
  out.push(...[".astro", ".md", ".mdx"].map((ext) => `src/pages${page}${ext}`), `src/pages${p === "/" ? "" : p}/index.astro`);
  return out;
}

const shallow = new Map<string, boolean>();

/** True when cwd is not a git work tree with full history (no git, not a repo, or a shallow clone). */
function lacksHistory(cwd: string): boolean {
  let value = shallow.get(cwd);
  if (value === undefined) {
    try {
      const out = execFileSync("git", ["rev-parse", "--is-shallow-repository"], { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
      value = out.trim() !== "false";
    } catch {
      value = true;
    }
    shallow.set(cwd, value);
  }
  return value;
}

export function gitLastModified(file: string, cwd = process.cwd()): string | undefined {
  if (lacksHistory(cwd)) return undefined;
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", file], { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    return out.trim() || undefined;
  } catch {
    return undefined;
  }
}

/** ISO date of the last commit touching the page's source, or undefined. */
export function lastModifiedFor(pathname: string, cwd = process.cwd()): string | undefined {
  const file = sourceCandidates(pathname).find((f) => existsSync(join(cwd, f)));
  return file ? gitLastModified(file, cwd) : undefined;
}
