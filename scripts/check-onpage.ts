/**
 * On-page SEO check over the built site (docs/seo-2026.md §C). Run after `pnpm build`:
 *   pnpm check:seo            # links to planned, unbuilt routes are reported as pending
 *   pnpm check:seo --strict   # pending links fail too (once every PRD §5 page exists)
 *   pnpm check:seo --allow-missing-mirrors   # a page without its es/en mirror is not an error
 * Every indexable page needs its mirror in the other language (site-pages S7) unless that flag is given.
 * SITE_URL must match the one used for the build (default https://example.com, as astro.config.mjs).
 * Exits 1 on any error.
 */
import { resolve } from "node:path";
import { checkSite } from "../src/lib/onpage/check.ts";

const args = process.argv.slice(2);
const strictLinks = args.includes("--strict");
const requireMirrors = !args.includes("--allow-missing-mirrors");
const dist = resolve(args.find((a) => !a.startsWith("--")) ?? "dist");
const site = process.env.SITE_URL ?? "https://example.com";

const { issues, pages } = checkSite(dist, { site, strictLinks, requireMirrors });
const errors = issues.filter((i) => i.level === "error");
const pending = issues.filter((i) => i.level === "pending");

for (const i of errors) console.error(`error   ${i.file || "(site)"}  [${i.rule}] ${i.message}`);
const pendingTargets = new Set(pending.map((i) => i.message));
if (pendingTargets.size) {
  console.log(`pending ${pendingTargets.size} planned route(s) linked but not built yet: ${[...pendingTargets].map((m) => m.split(" ")[0]).join(", ")}`);
}
console.log(`on-page check: ${pages} indexable page(s), ${errors.length} error(s), ${pending.length} pending link(s)`);
process.exit(errors.length ? 1 : 0);
