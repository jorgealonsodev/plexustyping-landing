# SEO gaps from the 2026 audit

Objective: close the code-only gaps that five read-only audits found against `docs/seo-2026-guide.md` and `docs/seo-2026.md`.
Branch: feat/site-pages (on top of bd709fe). Delivery: ask-on-risk. Runner: `pnpm test` (vitest), `pnpm check`, `pnpm build`, `pnpm check:seo`.

## Specs

- S1 A deploy build (Docker) whose `SITE_URL` is unset or the `https://example.com` placeholder must never be indexable: every page gets `noindex`, and the build prints a warning. Local builds and tests keep today's behavior.
- S2 The sitemap built inside Docker carries `<lastmod>` from git commit dates (today `.git` is excluded from the build context, so it has none); a shallow clone gives no date rather than a wrong one.
- S3 Docs pages have no layout shift caused by the sidebar on phones: the article comes before the sidebar in the HTML.
- S4 Every docs page `<title>` ends in " · PlexusTyping"; `check:seo` fails a docs page that doesn't.
- S5 The four docs pages that repeat a hub (`/docs/ayuda/preguntas-frecuentes`, `/docs/proyecto/notas-de-version`, `/docs/proyecto/privacidad`, `/docs/proyecto/licencias-y-creditos`) are `noindex` and left out of the sitemap; they stay reachable (S10 slug contract of site-pages).
- S6 JSON-LD: pages that reference `#organization` carry a minimal Organization node (name, url); the app is one SoftwareApplication entity: the same `url`/`downloadUrl` (Spanish canonical pages) on every page that emits it, so the English home no longer links to the missing `/en/descargar`; `inLanguage: "es"` stays, as it is the app's own UI language; TechArticle has `image`; `/descargar` SoftwareApplication gets the same `featureList` as home.
- S7 Speculation Rules prefetch internal links with moderate eagerness, excluding `/pagefind/` and `/og/`, allowed by the CSP.
- S8 The home hero demo hydrates without blocking the first interaction (`client:idle`).
- S9 nginx: `GET /404` returns status 404; `*.html`, `/index` and `/index.html` get a 301 to the clean URL; hashed Pagefind files are cached `immutable`.
- S10 The wordmark alt text is in the page language. (Dropped, see L4.)

Deferred (need the owner or an external service, not in scope): real domain, release-triggered rebuild, IndexNow key and ping, real app screenshots, visible author and About page (author undecided in PRODUCT.md), HSTS `preload` decision, Brotli, favicon PNG/ICO.

## Tasks

| ID | Specs | Route | Status | Commit |
|---|---|---|---|---|
| T1 | S1 | inline | done, tests/seo-deploy-guard.test.ts | |
| T2 | S2 | inline | done, shallow-clone test | |
| T3 | S3 | inline | done, CLS 0.12 → 0 measured | |
| T4 | S4 | inline | done, check:seo rule | |
| T5 | S5 | inline | done (4 pages) | |
| T6 | S6 | inline | done | |
| T7 | S7 | inline | done, 0 CSP errors | |
| T8 | S8 | inline | done | |
| T9 | S9 | inline | pending live check | |
| T10 | S10 | inline | dropped (L4) | |

Route evidence: every unit is under ~100 changed lines, so no writer trigger applies; all run inline.

## Log

- L1 (2026-11-23) "ahora corre 5 agente de como aplicar los cambios" → five read-only audits (indexing, on-page, structured data, AI crawlers, performance). Then, after the prioritized plan: "has lo que creas mas optimo".
- L2 Decision: S1 uses `noindex` instead of failing the build, because the domain is still undecided (PRODUCT.md) and a failing build would break the current Portainer redeploys.
- L3 Audit miss found by the new title rule: `/docs/proyecto/licencias-y-creditos` duplicated the `/licencias` title and summarizes it, so it joined S5.
- L4 S10 dropped: the wordmark image shows the English tagline "Adaptive typing" as part of the binding logo (PRODUCT.md), and alt text should say what the image shows; translating it would describe text that isn't there.
- L5 Evidence: `pnpm test` 32 files / 613 tests pass; `pnpm check` 0 errors; `pnpm build` OK; `pnpm check:seo` 68 indexable pages, 0 errors, 9 pending /en links (P6). Playwright at 390×844, 4× CPU, ~1.6 Mbps, 150 ms: docs CLS 0 (was 0.12), /docs 0.007, home 0.002; home LCP 616–660 ms warm (text element); speculation rules present, 0 CSP console errors; desktop docs grid keeps the sidebar left of the article.
- L6 S6 refined while implementing: `inLanguage` on SoftwareApplication describes the app (its UI is Spanish), not the page, so it was kept; the contradiction was the per-locale `url`/`downloadUrl` under one `@id`.
