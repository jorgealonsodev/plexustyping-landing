/**
 * On-page SEO check over the built site (spec S4, S8; docs/seo-2026.md §B and §C "Per-page template").
 * Each template line is one rule; the page type comes from `<body data-page-type>`, set by the layouts.
 *
 * Run by scripts/check-onpage.ts (Node, type stripping) and by tests/seo-onpage.test.ts, so imports
 * carry explicit `.ts` extensions and the file uses only erasable TypeScript syntax.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { type HTMLElement, parse } from "node-html-parser";
import { PAGE_TYPES, PLANNED_PREFIXES, PLANNED_ROUTES } from "../../data/routes.ts";
import { englishSitePath, isEnglishPath, neutralPath } from "../../i18n/slugs.ts";

export { PAGE_TYPES };

export type Level = "error" | "pending";
export interface Issue {
  /** dist-relative file, e.g. "docs/empezar/instalar.html"; "" for site-wide rules. */
  file: string;
  rule: string;
  message: string;
  level: Level;
}
export interface CheckOptions {
  /** Origin the site was built for (astro.config `site`), e.g. "https://example.com". */
  site: string;
  /** Treat links to planned but unbuilt routes as errors (use once every page exists). */
  strictLinks?: boolean;
  /** Every indexable page must have its other-language mirror built (site-pages S7, once the mirror is complete). */
  requireMirrors?: boolean;
}
export interface Report {
  issues: Issue[];
  /** Indexable pages checked. */
  pages: number;
}



const TITLE_MAX = 60;
const DESCRIPTION_MAX = 155;
const LEAD_WORDS = [40, 60] as const;
const OG_MAX_BYTES = 300 * 1024;
const BAD_ANCHORS = new Set(["aquí", "aqui", "pulsa aquí", "haz clic aquí", "clic aquí", "here", "click here", "más", "leer más", "read more", "more"]);

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

/** "index.html" -> "/", "en.html" -> "/en", "docs/a/b.html" -> "/docs/a/b" (build.format "file"). */
export function urlPathOf(file: string): string {
  const p = `/${file.split(sep).join("/")}`.replace(/\.html$/, "");
  if (p === "/index") return "/";
  return p.replace(/\/index$/, "");
}

// English pages use English slugs (src/i18n/slugs.ts), so the mirror of a page comes from the mapping.
const localeOfPath = (p: string) => (isEnglishPath(p) ? "en" : "es");
const esPathOf = (p: string) => neutralPath(p);
const enPathOf = (p: string) => englishSitePath(neutralPath(p));
const words = (s: string) => s.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
const text = (el: HTMLElement | null | undefined) => (el?.text ?? "").replace(/\s+/g, " ").trim();

function readPngSize(file: string): { width: number; height: number } | null {
  const b = readFileSync(file);
  if (b.length < 24 || b.toString("ascii", 1, 4) !== "PNG" || b.toString("ascii", 12, 16) !== "IHDR") return null;
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

function jsonLdNodes(root: HTMLElement, add: (rule: string, msg: string) => void): Record<string, unknown>[] {
  const nodes: Record<string, unknown>[] = [];
  for (const s of root.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const data = JSON.parse(s.textContent) as Record<string, unknown>;
      const list = Array.isArray(data["@graph"]) ? (data["@graph"] as Record<string, unknown>[]) : [data];
      nodes.push(...list);
    } catch {
      add("json-ld", "invalid JSON-LD");
    }
  }
  return nodes;
}

export function checkSite(distDir: string, options: CheckOptions): Report {
  const site = options.site.replace(/\/+$/, "");
  const issues: Issue[] = [];
  const files = walk(distDir).map((f) => relative(distDir, f));
  const htmlFiles = files.filter((f) => f.endsWith(".html")).sort();
  const pathSet = new Set(files.map((f) => `/${f.split(sep).join("/")}`));
  const pageExists = (p: string) => pathSet.has(p === "/" ? "/index.html" : `${p}.html`) || pathSet.has(`${p}/index.html`);
  const targetExists = (p: string) => pageExists(p) || pathSet.has(p);
  const isPlanned = (p: string) => PLANNED_ROUTES.includes(p) || PLANNED_PREFIXES.some((pre) => p.startsWith(pre));

  const titles = new Map<string, string[]>();
  /** hreflang alternates of each indexable page, for the reciprocity check after the loop. */
  const alternatesOf = new Map<string, { file: string; alternates: Map<string, string> }>();
  const descriptions = new Map<string, string[]>();
  const indexable = new Set<string>();

  for (const file of htmlFiles) {
    const urlPath = urlPathOf(file);
    const add = (rule: string, message: string, level: Level = "error") => issues.push({ file, rule, message, level });
    const root = parse(readFileSync(join(distDir, file), "utf8"));
    const head = root.querySelector("head");
    const meta = (sel: string) => head?.querySelector(sel)?.getAttribute("content")?.trim() ?? "";
    const robots = meta('meta[name="robots"]');
    if (/noindex/.test(robots)) continue;
    if (urlPath === "/404") {
      add("noindex", "the 404 page must carry robots noindex");
      continue;
    }
    indexable.add(urlPath);
    const locale = localeOfPath(urlPath);
    const url = `${site}${urlPath === "/" ? "/" : urlPath}`;
    const main = root.querySelector("main");
    const body = root.querySelector("body");

    // All pages.
    const lang = root.querySelector("html")?.getAttribute("lang");
    if (lang !== locale) add("lang", `<html lang="${lang ?? ""}"> should be "${locale}"`);

    const title = text(head?.querySelector("title"));
    if (!title) add("title", "missing <title>");
    else if (title.length > TITLE_MAX) add("title", `title has ${title.length} characters (max ${TITLE_MAX})`);
    titles.set(title, [...(titles.get(title) ?? []), file]);

    const description = meta('meta[name="description"]');
    if (!description) add("description", "missing meta description");
    else if (description.length > DESCRIPTION_MAX) {
      add("description", `description has ${description.length} characters (max ${DESCRIPTION_MAX})`);
    }
    descriptions.set(description, [...(descriptions.get(description) ?? []), file]);

    const canonicals = head?.querySelectorAll('link[rel="canonical"]') ?? [];
    const canonical = canonicals[0]?.getAttribute("href");
    if (canonicals.length !== 1 || canonical !== url) add("canonical", `canonical should be exactly one ${url}, got ${canonical ?? "none"}`);

    const alternates = new Map<string, string>();
    for (const l of head?.querySelectorAll('link[rel="alternate"][hreflang]') ?? []) {
      alternates.set(l.getAttribute("hreflang") ?? "", l.getAttribute("href") ?? "");
    }
    alternatesOf.set(urlPath, { file, alternates });
    const mirror = locale === "es" ? enPathOf(urlPath) : esPathOf(urlPath);
    if (options.requireMirrors && !pageExists(mirror)) add("mirror", `no ${locale === "es" ? "English" : "Spanish"} mirror built at ${mirror}`);
    for (const [hl, href] of alternates) {
      const p = href.startsWith(site) ? href.slice(site.length) || "/" : null;
      if (p === null || !pageExists(p)) add("hreflang", `hreflang ${hl} points to a missing page ${href}`);
    }
    if (pageExists(mirror)) {
      const want = { es: `${site}${esPathOf(urlPath) === "/" ? "/" : esPathOf(urlPath)}`, en: `${site}${enPathOf(urlPath)}` };
      if (alternates.get("es") !== want.es || alternates.get("en") !== want.en || alternates.get("x-default") !== want.es) {
        add("hreflang", "a page with a mirror needs hreflang es, en and x-default (= es)");
      }
    } else if (alternates.size > 0 && [...alternates.keys()].some((k) => k !== locale && k !== "x-default")) {
      add("hreflang", "hreflang to another language without a built mirror");
    }

    const h1s = root.querySelectorAll("h1");
    if (h1s.length !== 1) add("h1", `${h1s.length} <h1> elements (exactly one required)`);

    if (!robots.includes("max-image-preview:large")) add("robots-meta", 'robots meta needs "max-image-preview:large"');

    for (const p of ["og:title", "og:description", "og:url", "og:type", "og:site_name", "og:locale", "og:image", "og:image:alt"]) {
      if (!meta(`meta[property="${p}"]`)) add("og", `missing ${p}`);
    }
    if (meta('meta[property="og:url"]') && meta('meta[property="og:url"]') !== url) add("og", "og:url must equal the canonical");
    if (meta('meta[name="twitter:card"]') !== "summary_large_image") add("og", "twitter:card must be summary_large_image");
    const ogImage = meta('meta[property="og:image"]');
    if (ogImage) {
      const p = ogImage.startsWith(`${site}/`) ? ogImage.slice(site.length) : null;
      if (p === null) add("og", `og:image must be an absolute URL on ${site}`);
      else if (!pathSet.has(p)) add("og", `og:image ${p} is not in the build`);
      else {
        const f = join(distDir, p);
        const size = readPngSize(f);
        const ow = Number(meta('meta[property="og:image:width"]'));
        const oh = Number(meta('meta[property="og:image:height"]'));
        if (!size || size.width !== 1200 || size.height !== 630) add("og", `og:image ${p} must be a 1200×630 PNG`);
        else if (ow !== size.width || oh !== size.height) add("og", "og:image:width/height must match the image");
        if (statSync(f).size > OG_MAX_BYTES) add("og", `og:image ${p} is over 300 KB`);
      }
    }

    for (const tag of ["header", "nav", "main", "footer"]) {
      if (!root.querySelector(tag)) add("landmarks", `missing <${tag}>`);
    }
    if (root.querySelectorAll("main").length > 1) add("landmarks", "more than one <main>");

    for (const img of root.querySelectorAll("img")) {
      const src = img.getAttribute("src") ?? "";
      if (!img.hasAttribute("alt")) add("images", `<img src="${src}"> has no alt`);
      if (!img.getAttribute("width") || !img.getAttribute("height")) add("images", `<img src="${src}"> needs width and height`);
    }

    let prev = 0;
    for (const h of root.querySelectorAll("h1, h2, h3, h4, h5, h6")) {
      const level = Number(h.tagName.slice(1));
      if (prev && level > prev + 1) add("headings", `<${h.tagName.toLowerCase()}> "${text(h)}" skips a level after <h${prev}>`);
      prev = level;
    }

    const ld = jsonLdNodes(root, add);
    const ofType = (t: string) => ld.filter((n) => n["@type"] === t);

    for (const a of root.querySelectorAll("a[href]")) {
      const href = a.getAttribute("href") ?? "";
      const label = text(a).toLowerCase();
      if (BAD_ANCHORS.has(label)) add("anchor-text", `link text "${label}" is not descriptive (${href})`);
      if (!href.startsWith("/") || href.startsWith("//")) continue;
      const target = href.split(/[?#]/, 1)[0] || "/";
      if (target !== "/" && target.endsWith("/")) add("links", `internal link with a trailing slash: ${href}`);
      else if (!targetExists(target)) {
        if (isPlanned(target)) add("links", `${target} (planned, not built yet)`, options.strictLinks ? "error" : "pending");
        else add("links", `broken internal link ${href}`);
      }
    }

    // Answer first: the lead paragraph (S4: 40–60 words). The home opens with its hero instead.
    const type = body?.getAttribute("data-page-type") ?? "";
    if (!(PAGE_TYPES as readonly string[]).includes(type)) {
      add("page-type", `unknown data-page-type "${type}" (one of ${PAGE_TYPES.join(", ")})`);
      continue;
    }
    if (type !== "home") {
      const lead =
        main?.querySelector("[data-lead]") ?? main?.querySelector("[data-content] p") ?? main?.querySelector("p");
      const n = words(text(lead));
      if (n < LEAD_WORDS[0] || n > LEAD_WORDS[1]) {
        add("lead", `the first paragraph has ${n} words (${LEAD_WORDS[0]}–${LEAD_WORDS[1]} required)`);
      }
    }

    const mainLinks = (main?.querySelectorAll("a[href]") ?? []).map((a) => a.getAttribute("href") ?? "");
    const docsPrefix = locale === "en" ? "/en/docs/" : "/docs/";
    const featuresPrefix = locale === "en" ? `${englishSitePath("/funciones")}/` : "/funciones/";
    const visibleCrumbs = !!main?.querySelector("nav[aria-label] ol");
    const updatedTime = main?.querySelector("[data-updated] time[datetime]")?.getAttribute("datetime") ?? "";
    const pageText = (main?.structuredText ?? "").replace(/\s+/g, " ");
    const t = (rule: string, ok: boolean, msg: string) => ok || add(rule, msg);

    if (type === "home") {
      const loc = (p: string) => (locale === "en" ? englishSitePath(p) : p);
      const sw = ofType("SoftwareApplication")[0];
      t("home", !!sw, "home needs SoftwareApplication JSON-LD");
      if (locale === "es") {
        t("home", ofType("WebSite").length === 1, "the Spanish home needs WebSite JSON-LD");
        const org = ofType("Organization")[0];
        t("home", Array.isArray(org?.sameAs) && (org.sameAs as unknown[]).length > 0, "the Spanish home needs Organization with sameAs");
      } else {
        t("home", ofType("WebSite").length === 0, "WebSite JSON-LD belongs on the Spanish home only");
      }
      const version = typeof sw?.softwareVersion === "string" ? sw.softwareVersion : "";
      t("home", !!version && (body?.structuredText ?? "").includes(version), "the current version must appear as text");
      const allLinks = root.querySelectorAll("a[href]").map((a) => a.getAttribute("href"));
      for (const p of ["/descargar", "/funciones", "/docs"]) t("home", allLinks.includes(loc(p)), `home must link to ${loc(p)}`);
    }

    if (type === "feature" || type === "docs") {
      t(type, ofType("BreadcrumbList").length === 1, "needs BreadcrumbList JSON-LD");
      t(type, visibleCrumbs, "needs visible breadcrumbs (<nav aria-label><ol>) in <main>");
      t(type, !!updatedTime, 'needs a visible "Actualizado" date: [data-updated] <time datetime>');
    }

    if (type === "feature") {
      t("feature", !!main?.querySelector("figure"), "needs a screenshot or demonstration <figure>");
      t("feature", mainLinks.some((h) => h.startsWith(docsPrefix)), `needs a link to its documentation (${docsPrefix}…)`);
    }

    if (type === "docs") {
      const art = ofType("TechArticle")[0];
      t("docs", !!art?.datePublished && !!art.dateModified && !!art.author, "needs TechArticle with datePublished, dateModified and author");
      t("docs", !art || art.dateModified === updatedTime, "the visible updated date must match TechArticle dateModified");
      t("docs", text(main?.querySelector("[data-app-version]")).length > 0, "needs the app version it applies to ([data-app-version])");
      const edit = (main?.querySelectorAll("a[href]") ?? []).some(
        (a) => /^(Editar|Edit) en GitHub$|^Edit on GitHub$/.test(text(a)) && /github\.com\/.+\/edit\//.test(a.getAttribute("href") ?? ""),
      );
      t("docs", edit, 'needs an "Editar en GitHub" link to the source file');
      t("docs", mainLinks.some((h) => h.startsWith(featuresPrefix)), `needs a link to a related feature (${featuresPrefix}…)`);
      t("docs", title.endsWith(" · PlexusTyping"), 'the <title> must end in " · PlexusTyping"');
    }

    if (type === "download") {
      const sw = ofType("SoftwareApplication")[0];
      t("download", !!sw?.downloadUrl && !!sw.softwareVersion, "needs SoftwareApplication with downloadUrl and softwareVersion");
      const h2 = (main?.querySelectorAll("h2") ?? []).map(text);
      for (const os of ["Linux", "Windows"]) t("download", h2.some((h) => h.includes(os)), `needs an <h2> for ${os}`);
      t("download", /\b[0-9a-f]{64}\b/.test(pageText), "needs the SHA-256 sums as text");
      t("download", !!main?.querySelector("table"), "needs the system requirements as a <table>");
      t("download", !!main?.querySelector("time[datetime]"), "needs the release date as <time datetime>");
    }

    if (type === "faq") {
      const details = main?.querySelectorAll("details") ?? [];
      const blocks = details.length
        ? details.map((d) => d.innerHTML)
        : (main?.innerHTML ?? "").split(/<h2[\s>]/).slice(1);
      t("faq", blocks.length > 0, "needs questions as <details> or <h2>");
      blocks.forEach((b, i) => {
        t("faq", b.includes(`href="${docsPrefix}`), `answer ${i + 1} must link to its documentation`);
      });
    }

    if (type === "release-notes") {
      const versions = main?.querySelectorAll("h2[data-version]") ?? [];
      t("release-notes", versions.length > 0, 'needs one <h2 data-version="…"> per version');
      const dates = versions.map((h) => h.querySelector("time[datetime]")?.getAttribute("datetime") ?? "");
      t("release-notes", dates.every(Boolean), "every version <h2> needs a <time datetime>");
      t("release-notes", dates.every((d, i) => i === 0 || d <= (dates[i - 1] ?? "")), "versions must be newest first");
      const rss = mainLinks.some((h) => h.endsWith("/rss.xml")) || !!head?.querySelector('link[type="application/rss+xml"]');
      t("release-notes", rss, "needs a link to the RSS feed");
      const gh = mainLinks.filter((h) => h.startsWith("https://github.com/jorgealonsodev/plexustyping/releases")).length;
      t("release-notes", gh >= versions.length, "every version needs a link to its GitHub release");
    }
  }

  // hreflang reciprocity: when page A names page B as its alternate in B's language, B names A back.
  for (const [urlPath, { file, alternates }] of alternatesOf) {
    const self = `${site}${urlPath === "/" ? "/" : urlPath}`;
    for (const [hl, href] of alternates) {
      if (hl === "x-default" || hl === localeOfPath(urlPath) || !href.startsWith(site)) continue;
      const other = alternatesOf.get(href.slice(site.length) || "/");
      if (other && other.alternates.get(localeOfPath(urlPath)) !== self) {
        issues.push({ file, rule: "hreflang", message: `hreflang ${hl} ${href} does not point back to ${self}`, level: "error" });
      }
    }
  }

  for (const [label, map] of [
    ["title", titles],
    ["description", descriptions],
  ] as const) {
    for (const [value, where] of map) {
      if (value && where.length > 1) {
        for (const file of where) issues.push({ file, rule: label, message: `${label} "${value}" is not unique (${where.join(", ")})`, level: "error" });
      }
    }
  }

  // Sitemap: exactly the indexable pages.
  const sitemapFiles = files.filter((f) => /^sitemap-\d+\.xml$/.test(f));
  if (!files.includes("sitemap-index.xml") || sitemapFiles.length === 0) {
    issues.push({ file: "", rule: "sitemap", message: "missing sitemap-index.xml or sitemap-N.xml", level: "error" });
  } else {
    const locs = new Set<string>();
    for (const f of sitemapFiles) {
      for (const m of readFileSync(join(distDir, f), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)) {
        const loc = m[1] ?? "";
        locs.add(loc.startsWith(site) ? loc.slice(site.length) || "/" : loc);
      }
    }
    for (const p of indexable) {
      if (!locs.has(p)) issues.push({ file: "", rule: "sitemap", message: `indexable page ${p} is not in the sitemap`, level: "error" });
    }
    for (const p of locs) {
      if (!indexable.has(p)) issues.push({ file: "", rule: "sitemap", message: `sitemap lists ${p}, which is not an indexable page`, level: "error" });
    }
  }

  const robotsFile = join(distDir, "robots.txt");
  const robotsTxt = existsSync(robotsFile) ? readFileSync(robotsFile, "utf8") : "";
  if (!robotsTxt.includes(`Sitemap: ${site}/sitemap-index.xml`)) {
    issues.push({ file: "robots.txt", rule: "robots", message: `robots.txt must reference ${site}/sitemap-index.xml`, level: "error" });
  }

  return { issues, pages: indexable.size };
}
