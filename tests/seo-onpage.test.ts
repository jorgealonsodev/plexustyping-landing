/**
 * The on-page check (docs/seo-2026.md §C, "Per-page template (each line is a CI check)") over a
 * fixture dist/ written to a temporary directory: a valid site passes, and each template line fails
 * when its element is removed.
 */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { checkSite } from "../src/lib/onpage/check";
import { englishSitePath, neutralPath } from "../src/i18n/slugs";

const SITE = "https://plexus.example";
const SHA = "fea1b0988907d6e01755defa940c46b4e1263156d45e0fe22adf482afc1d000f";
const LEAD =
  "PlexusTyping es un tutor de mecanografía gratuito y libre para Linux y Windows que mide qué teclas y combinaciones de letras te cuestan más, por errores y por lentitud, y escribe el texto siguiente alrededor de ellas para que practiques justo lo que necesitas, sin conexión y sin cuenta.";

function png(width: number, height: number): Buffer {
  const b = Buffer.alloc(33);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(b, 0);
  b.writeUInt32BE(13, 8);
  b.write("IHDR", 12, "ascii");
  b.writeUInt32BE(width, 16);
  b.writeUInt32BE(height, 20);
  return b;
}

interface PageOpts {
  path: string;
  lang?: string;
  type: string;
  title: string;
  description?: string;
  hreflang?: boolean;
  noindex?: boolean;
  jsonLd?: unknown[];
  main: string;
  extraHead?: string;
  ogImage?: string;
}

function html(o: PageOpts): string {
  const lang = o.lang ?? (o.path === "/en" || o.path.startsWith("/en/") ? "en" : "es");
  const url = `${SITE}${o.path}`;
  const esPath = neutralPath(o.path);
  const enPath = englishSitePath(esPath);
  const head = o.noindex
    ? `<meta name="robots" content="noindex">`
    : `<link rel="canonical" href="${url}">
      ${o.hreflang === false ? "" : `<link rel="alternate" hreflang="es" href="${SITE}${esPath}"><link rel="alternate" hreflang="en" href="${SITE}${enPath}"><link rel="alternate" hreflang="x-default" href="${SITE}${esPath}">`}
      <meta name="robots" content="max-image-preview:large">
      <meta property="og:title" content="${o.title}"><meta property="og:description" content="${o.description ?? "Descripción"}">
      <meta property="og:url" content="${url}"><meta property="og:type" content="website"><meta property="og:site_name" content="PlexusTyping">
      <meta property="og:locale" content="es_ES"><meta property="og:image" content="${SITE}${o.ogImage ?? "/og/default-es.png"}">
      <meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="PlexusTyping">
      <meta name="twitter:card" content="summary_large_image">
      ${(o.jsonLd ?? []).length ? `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": o.jsonLd })}</script>` : ""}`;
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>${o.title}</title>
    <meta name="description" content="${o.description ?? `Descripción única de ${o.title}`}">${head}${o.extraHead ?? ""}</head>
    <body data-page-type="${o.type}"><header><nav aria-label="Principal"><a href="/">Inicio</a><a href="/descargar">Descargar</a><a href="/funciones">Funciones</a><a href="/docs">Documentación</a></nav></header>
    <main id="contenido">${o.main}</main><footer><p>PlexusTyping</p></footer></body></html>`;
}

const crumbs = (items: [string, string][]) =>
  `<nav aria-label="Migas de pan"><ol>${items.map(([n, p]) => `<li><a href="${p}">${n}</a></li>`).join("")}</ol></nav>`;
const breadcrumbLd = { "@type": "BreadcrumbList", itemListElement: [] };
const software = {
  "@type": "SoftwareApplication",
  softwareVersion: "0.1.0",
  downloadUrl: `${SITE}/descargar`,
};

type Fixture = Record<string, PageOpts>;

function validSite(): Fixture {
  return {
    "index.html": {
      path: "/",
      type: "home",
      title: "PlexusTyping: mecanografía que se adapta",
      jsonLd: [{ "@type": "WebSite" }, { "@type": "Organization", sameAs: ["https://github.com/x"] }, software],
      main: `<h1>Mecanografía</h1><p>Versión 0.1.0, 19 de noviembre de 2026.</p>`,
    },
    "en.html": {
      path: "/en",
      type: "home",
      title: "PlexusTyping: typing that adapts",
      jsonLd: [software],
      main: `<h1>Typing</h1><p>Version 0.1.0.</p><a href="/en/download">Download</a><a href="/en/features">Features</a><a href="/en/docs">Docs</a>`,
    },
    "funciones/motor-adaptativo.html": {
      path: "/funciones/motor-adaptativo",
      type: "feature",
      hreflang: false,
      title: "Motor adaptativo · PlexusTyping",
      jsonLd: [breadcrumbLd],
      main: `${crumbs([["Inicio", "/"], ["Funciones", "/funciones"]])}<div data-content><h1>Motor adaptativo</h1><p data-lead>${LEAD}</p>
        <figure><img src="/a.png" alt="Mapa de calor" width="10" height="10"><figcaption>Demostración</figcaption></figure>
        <h2>Documentación</h2><a href="/docs/motor-adaptativo/como-mide">Cómo mide tus debilidades</a>
        <p data-updated>Actualizado: <time datetime="2026-11-20">20 nov 2026</time></p></div>`,
    },
    "docs/empezar/instalar.html": {
      path: "/docs/empezar/instalar",
      type: "docs",
      hreflang: false,
      title: "Instalar en Linux · PlexusTyping",
      jsonLd: [
        breadcrumbLd,
        { "@type": "TechArticle", datePublished: "2026-11-19", dateModified: "2026-11-20", author: { "@id": "o" } },
      ],
      main: `${crumbs([["Inicio", "/"], ["Documentación", "/docs"]])}<article><h1>Instalar en Linux</h1>
        <p class="meta" data-updated>Actualizado: <time datetime="2026-11-20">20 nov 2026</time> · <span data-app-version>0.1.0</span></p>
        <div data-content><p>${LEAD}</p><h2>Pasos</h2><h3>Uno</h3><p>Ver <a href="/funciones/motor-adaptativo">motor adaptativo</a>.</p></div>
        <a href="https://github.com/jorgealonsodev/plexustyping-landing/edit/main/src/content/docs/empezar/instalar.md">Editar en GitHub</a></article>`,
    },
    "descargar.html": {
      path: "/descargar",
      type: "download",
      hreflang: false,
      title: "Descargar PlexusTyping",
      jsonLd: [software],
      main: `<h1>Descargar</h1><p data-lead>${LEAD}</p><h2>Linux</h2><p>${SHA}</p><h2>Windows</h2>
        <table><tr><th>Sistema</th><td>Linux</td></tr></table><p>Publicada el <time datetime="2026-11-19">19 nov</time></p>`,
    },
    "preguntas-frecuentes.html": {
      path: "/preguntas-frecuentes",
      type: "faq",
      hreflang: false,
      title: "Preguntas frecuentes · PlexusTyping",
      main: `<h1>Preguntas frecuentes</h1><p data-lead>${LEAD}</p>
        <details><summary>¿Es gratis?</summary><p>Sí. <a href="/docs/proyecto/licencias">Licencias</a></p></details>`,
    },
    "novedades.html": {
      path: "/novedades",
      type: "release-notes",
      hreflang: false,
      title: "Novedades · PlexusTyping",
      main: `<h1>Novedades</h1><p data-lead>${LEAD}</p><a href="/rss.xml">RSS</a>
        <h2 data-version="0.1.1">0.1.1 <time datetime="2026-12-01">1 dic</time></h2><a href="https://github.com/jorgealonsodev/plexustyping/releases/tag/v0.1.1">GitHub</a>
        <h2 data-version="0.1.0">0.1.0 <time datetime="2026-11-19">19 nov</time></h2><a href="https://github.com/jorgealonsodev/plexustyping/releases/tag/v0.1.0">GitHub</a>`,
    },
    "privacidad.html": {
      path: "/privacidad",
      type: "prose",
      hreflang: false,
      title: "Privacidad · PlexusTyping",
      main: `<h1>Privacidad</h1><p data-lead>${LEAD}</p>`,
    },
    "404.html": { path: "/404", type: "none", noindex: true, title: "No encontrada", main: "<h1>404</h1>" },
  };
}

const INDEXABLE = [
  "/",
  "/en",
  "/funciones/motor-adaptativo",
  "/docs/empezar/instalar",
  "/descargar",
  "/preguntas-frecuentes",
  "/novedades",
  "/privacidad",
];

const created: string[] = [];
afterAll(() => {
  for (const dir of created) rmSync(dir, { recursive: true, force: true });
});

function writeSite(fx: Fixture, opts: { sitemap?: string[]; robots?: string; skipOg?: boolean } = {}): string {
  const dir = mkdtempSync(join(tmpdir(), "onpage-"));
  created.push(dir);
  for (const [file, page] of Object.entries(fx)) {
    mkdirSync(dirname(join(dir, file)), { recursive: true });
    writeFileSync(join(dir, file), html(page));
  }
  mkdirSync(join(dir, "og"), { recursive: true });
  if (!opts.skipOg) writeFileSync(join(dir, "og/default-es.png"), png(1200, 630));
  writeFileSync(join(dir, "og/small.png"), png(600, 315));
  writeFileSync(join(dir, "rss.xml"), "<rss/>");
  writeFileSync(join(dir, "a.png"), png(10, 10));
  const locs = (opts.sitemap ?? INDEXABLE).map((p) => `<url><loc>${SITE}${p}</loc></url>`).join("");
  writeFileSync(join(dir, "sitemap-0.xml"), `<urlset>${locs}</urlset>`);
  writeFileSync(join(dir, "sitemap-index.xml"), `<sitemapindex><sitemap><loc>${SITE}/sitemap-0.xml</loc></sitemap></sitemapindex>`);
  writeFileSync(join(dir, "robots.txt"), opts.robots ?? `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap-index.xml\n`);
  return dir;
}

const errorsOf = (dir: string) => checkSite(dir, { site: SITE }).issues.filter((i) => i.level === "error");
const rulesFor = (dir: string, file: string) =>
  errorsOf(dir)
    .filter((i) => i.file === file)
    .map((i) => i.rule);

function mutate(file: string, change: (p: PageOpts) => PageOpts) {
  const fx = validSite();
  fx[file] = change(fx[file] as PageOpts);
  return fx;
}
const replaceMain = (from: string | RegExp, to: string) => (p: PageOpts) => ({ ...p, main: p.main.replace(from, to) });

describe("checkSite: a valid site", () => {
  it("passes with no errors and counts the indexable pages", () => {
    const dir = writeSite(validSite());
    const report = checkSite(dir, { site: SITE });
    expect(report.issues.filter((i) => i.level === "error")).toEqual([]);
    expect(report.pages).toBe(8);
  });

  it("reports a link to a planned but unbuilt route as pending, and as an error with strictLinks", () => {
    const dir = writeSite(validSite());
    const pending = checkSite(dir, { site: SITE }).issues.filter((i) => i.level === "pending");
    expect(pending.map((i) => i.message)).toContain("/funciones (planned, not built yet)");
    const strict = checkSite(dir, { site: SITE, strictLinks: true }).issues.filter((i) => i.rule === "links");
    expect(strict.every((i) => i.level === "error")).toBe(true);
    expect(strict.length).toBeGreaterThan(0);
  });
});

describe("checkSite: all pages", () => {
  const f = "privacidad.html";
  it.each([
    ["lang", (p: PageOpts) => ({ ...p, lang: "fr" })],
    ["title", (p: PageOpts) => ({ ...p, title: "x".repeat(61) })],
    ["description", (p: PageOpts) => ({ ...p, description: "x".repeat(156) })],
    ["h1", replaceMain("<h1>Privacidad</h1>", "<h1>A</h1><h1>B</h1>")],
    ["headings", replaceMain("</p>", "</p><h3>Salto</h3>")],
    ["images", replaceMain("</p>", '</p><img src="/a.png" alt="x">')],
    ["images", replaceMain("</p>", '</p><img src="/a.png" width="1" height="1">')],
    ["links", replaceMain("</p>", '</p><a href="/no-existe">Página inexistente</a>')],
    ["anchor-text", replaceMain("</p>", '</p><a href="/">aquí</a>')],
    ["lead", replaceMain(LEAD, "Demasiado corto.")],
    ["og", (p: PageOpts) => ({ ...p, ogImage: "/og/small.png" })],
    ["og", (p: PageOpts) => ({ ...p, ogImage: "/og/missing.png" })],
    ["robots-meta", (p: PageOpts) => ({ ...p, extraHead: "", main: p.main })],
  ])("%s fails", (rule, change) => {
    const fx = mutate(f, change);
    if (rule === "robots-meta") {
      const dir = writeSite(fx);
      // remove the robots meta from the written page
      const page = html(fx[f] as PageOpts).replace('<meta name="robots" content="max-image-preview:large">', "");
      writeFileSync(join(dir, f), page);
      expect(rulesFor(dir, f)).toContain(rule);
      return;
    }
    expect(rulesFor(writeSite(fx), f)).toContain(rule);
  });

  it("canonical must be self-referencing and absolute", () => {
    const dir = writeSite(validSite());
    writeFileSync(join(dir, f), html(validSite()[f] as PageOpts).replace(`${SITE}/privacidad"`, `${SITE}/privacidad/"`));
    expect(rulesFor(dir, f)).toContain("canonical");
  });

  it("hreflang must point to built pages and come in threes when a mirror exists", () => {
    expect(rulesFor(writeSite(mutate(f, (p) => ({ ...p, hreflang: true }))), f)).toContain("hreflang");
    expect(rulesFor(writeSite(mutate("index.html", (p) => ({ ...p, hreflang: false }))), "index.html")).toContain(
      "hreflang",
    );
  });

  it("hreflang alternates must be reciprocal: the other page's alternate points back", () => {
    const dir = writeSite(validSite());
    // /en claims a Spanish alternate that is not /, so / and /en no longer agree.
    writeFileSync(join(dir, "en.html"), html(validSite()["en.html"] as PageOpts).replace(`hreflang="es" href="${SITE}/"`, `hreflang="es" href="${SITE}/privacidad"`));
    expect(rulesFor(dir, "en.html")).toContain("hreflang");
  });

  it("titles and descriptions are unique across the site", () => {
    const fx = mutate(f, (p) => ({ ...p, title: "Novedades · PlexusTyping", description: "Descripción única de Novedades · PlexusTyping" }));
    const rules = rulesFor(writeSite(fx), f);
    expect(rules).toContain("title");
    expect(rules).toContain("description");
  });

  it("landmarks header, nav, main and footer are required", () => {
    const dir = writeSite(validSite());
    writeFileSync(join(dir, f), html(validSite()[f] as PageOpts).replace(/<footer>.*<\/footer>/, ""));
    expect(rulesFor(dir, f)).toContain("landmarks");
  });

  it("every indexable page is in the sitemap and the sitemap holds only indexable pages", () => {
    const dir = writeSite(validSite(), { sitemap: [...INDEXABLE.filter((p) => p !== "/privacidad"), "/404"] });
    const rules = errorsOf(dir).map((i) => i.rule);
    expect(rules.filter((r) => r === "sitemap")).toHaveLength(2);
  });

  it("robots.txt must reference the sitemap index", () => {
    const dir = writeSite(validSite(), { robots: "User-agent: *\nAllow: /\n" });
    expect(errorsOf(dir).map((i) => i.rule)).toContain("robots");
  });

  it("a noindex page needs no SEO elements, but 404 must be noindex", () => {
    const fx = mutate("404.html", (p) => ({ ...p, noindex: false, type: "prose" }));
    expect(rulesFor(writeSite(fx), "404.html")).toContain("noindex");
  });
});

describe("checkSite: English mirror with English slugs (site-pages S7)", () => {
  /** The valid site plus the English mirror of the feature page, at its English slug. */
  function withMirror(): Fixture {
    const fx = validSite();
    fx["funciones/motor-adaptativo.html"] = { ...(fx["funciones/motor-adaptativo.html"] as PageOpts), hreflang: true };
    fx["en/features/adaptive-engine.html"] = {
      path: "/en/features/adaptive-engine",
      type: "feature",
      title: "Adaptive engine · PlexusTyping",
      jsonLd: [breadcrumbLd],
      main: `${crumbs([["Home", "/en"], ["Features", "/en"]])}<div data-content><h1>Adaptive engine</h1><p data-lead>${LEAD}</p>
        <figure><img src="/a.png" alt="Heatmap" width="10" height="10"><figcaption>Demo</figcaption></figure>
        <a href="/en/docs/adaptive-engine/how">How it measures weak spots</a>
        <p data-updated>Updated: <time datetime="2026-11-20">20 Nov 2026</time></p></div>`,
    };
    return fx;
  }
  const sitemap = [...INDEXABLE, "/en/features/adaptive-engine"];

  it("accepts reciprocal es/en/x-default alternates between Spanish and English slugs", () => {
    const dir = writeSite(withMirror(), { sitemap });
    expect(errorsOf(dir).filter((i) => i.file.includes("adaptive") || i.file.includes("motor"))).toEqual([]);
  });

  it("wants the English feature page to link to its English documentation (/en/docs/…)", () => {
    const fx = withMirror();
    const f = "en/features/adaptive-engine.html";
    fx[f] = replaceMain('href="/en/docs/adaptive-engine/how"', 'href="/docs/motor-adaptativo/como-mide"')(fx[f] as PageOpts);
    expect(rulesFor(writeSite(fx, { sitemap }), f)).toContain("feature");
  });

  it("with requireMirrors, an indexable page without its built mirror fails", () => {
    const dir = writeSite(withMirror(), { sitemap });
    const missing = checkSite(dir, { site: SITE, requireMirrors: true }).issues.filter((i) => i.rule === "mirror");
    expect(missing.map((i) => i.file)).toContain("privacidad.html");
    expect(missing.map((i) => i.file)).not.toContain("funciones/motor-adaptativo.html");
    expect(missing.map((i) => i.file)).not.toContain("en/features/adaptive-engine.html");
    expect(checkSite(dir, { site: SITE }).issues.filter((i) => i.rule === "mirror")).toEqual([]);
  });
});

describe("checkSite: per page type", () => {
  it("home: WebSite + Organization (Spanish home only), SoftwareApplication, version as text, key links", () => {
    expect(rulesFor(writeSite(mutate("index.html", (p) => ({ ...p, jsonLd: [software] }))), "index.html")).toContain(
      "home",
    );
    expect(
      rulesFor(writeSite(mutate("en.html", (p) => ({ ...p, jsonLd: [software, { "@type": "WebSite" }] }))), "en.html"),
    ).toContain("home");
    expect(rulesFor(writeSite(mutate("index.html", replaceMain("0.1.0", "x"))), "index.html")).toContain("home");
  });

  it("feature: breadcrumbs, a figure, a docs link and a visible updated date", () => {
    const f = "funciones/motor-adaptativo.html";
    for (const change of [
      (p: PageOpts) => ({ ...p, jsonLd: [] }),
      replaceMain(/<nav aria-label="Migas de pan">.*?<\/nav>/, ""),
      replaceMain(/<figure>.*?<\/figure>/s, ""),
      replaceMain('href="/docs/motor-adaptativo/como-mide"', 'href="/funciones"'),
      replaceMain(/<p data-updated>.*?<\/p>/, ""),
    ]) {
      expect(rulesFor(writeSite(mutate(f, change)), f)).toContain("feature");
    }
  });

  it("docs: TechArticle with dates matching the visible date, version, edit link, feature link", () => {
    const f = "docs/empezar/instalar.html";
    for (const change of [
      (p: PageOpts) => ({ ...p, jsonLd: [breadcrumbLd] }),
      (p: PageOpts) => ({
        ...p,
        jsonLd: [breadcrumbLd, { "@type": "TechArticle", datePublished: "2026-11-19", dateModified: "2026-11-21", author: {} }],
      }),
      replaceMain("<span data-app-version>0.1.0</span>", ""),
      replaceMain("Editar en GitHub", "Código"),
      replaceMain('href="/funciones/motor-adaptativo"', 'href="/docs"'),
      (p: PageOpts) => ({ ...p, title: "Instalar en Linux" }),
    ]) {
      expect(rulesFor(writeSite(mutate(f, change)), f)).toContain("docs");
    }
  });

  it("download: SoftwareApplication, per-OS h2, SHA-256 text, a table and a release date", () => {
    const f = "descargar.html";
    for (const change of [
      (p: PageOpts) => ({ ...p, jsonLd: [{ "@type": "SoftwareApplication" }] }),
      replaceMain("<h2>Windows</h2>", ""),
      replaceMain(SHA, "sin suma"),
      replaceMain(/<table>.*<\/table>/s, ""),
      replaceMain(/<time[^>]*>.*?<\/time>/, ""),
    ]) {
      expect(rulesFor(writeSite(mutate(f, change)), f)).toContain("download");
    }
  });

  it("faq: each answer links to its documentation", () => {
    const f = "preguntas-frecuentes.html";
    expect(rulesFor(writeSite(mutate(f, replaceMain('href="/docs/proyecto/licencias"', 'href="/"'))), f)).toContain("faq");
  });

  it("release notes: h2 per version with a date, newest first, RSS and GitHub links", () => {
    const f = "novedades.html";
    for (const change of [
      replaceMain('<time datetime="2026-12-01">1 dic</time>', ""),
      replaceMain("2026-12-01", "2026-10-01"),
      replaceMain('<a href="/rss.xml">RSS</a>', ""),
      replaceMain(/https:\/\/github\.com[^"]*/g, "/novedades"),
    ]) {
      expect(rulesFor(writeSite(mutate(f, change)), f)).toContain("release-notes");
    }
  });

  it("an indexable page without a known data-page-type fails", () => {
    expect(rulesFor(writeSite(mutate("privacidad.html", (p) => ({ ...p, type: "" }))), "privacidad.html")).toContain(
      "page-type",
    );
  });
});
