/**
 * Sitemap <lastmod> from the git history (docs/seo-2026.md §B5): the commit date of the file a page
 * is built from, never the build time. Without git (the Docker build excludes .git) or for an
 * uncommitted file there is no date, and the URL is listed without <lastmod>.
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

export function gitLastModified(file: string, cwd = process.cwd()): string | undefined {
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
