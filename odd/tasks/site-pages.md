# Feature: remaining pages of the site
Objective: build every page of PRD §5 that does not exist yet (Spanish first): download, features, documentation with search, release notes, FAQ, privacy, licenses, the full home, plus simulations S8–S10 and the machine-readable files. Branch: `feat/site-pages` (merged into `main`, the deploy branch, when the user asks). Delivery strategy: ask-on-risk.
Test runner: `pnpm test` (Vitest), `pnpm check`, `pnpm build`. Predecessor feature: `odd/tasks/site-base-home.md` (read its Specs and Log for the simulation rules).

## Specs

- S1. "hay que hacer las demas paginas": the pages and URLs of PRD.md §5: `/descargar`, `/funciones` and its nine pages, `/docs` and every page of the §7 table, `/novedades`, `/preguntas-frecuentes`, `/privacidad`, `/licencias`, and `/llms.txt`, `/llms-full.txt`, `/robots.txt`, `/sitemap-index.xml`, `/rss.xml`.
- S2. Content truth (PRD §6, PRODUCT.md): every statement comes from PRD §6 or the app repository `../plexustyping` (README.md, THIRD_PARTY_NOTICES.md, source). Nothing the app does not do; "próxima versión 0.1.1" and "planeado" items are labeled as such; no invented testimonials, numbers, screenshots or author details.
- S3. Visual world is settled (PRODUCT.md "Standing visual preference", `.impeccable/surfaces/src-pages-index-astro.md`): app skin, tokens in `src/styles/tokens.css`. Home, features and download are Persuade surfaces; docs, FAQ, release notes, privacy and licenses are Read surfaces (PRD §9). Simulations follow site-base-home S2/S3 (app appearance copied from the app repo, in motion, prerecorded data labeled "demostración").
- S4. SEO (PRD §10): one h1, unique title ≤ 60 and description ≤ 155 characters, canonical + hreflang, JSON-LD per page type (SoftwareApplication, BreadcrumbList, FAQPage, HowTo, TechArticle, WebSite), a direct 40–60 word answer in the first paragraph, internal links between each feature and its documentation.
- S5. Budgets and safety (PRD 0.1.2 §2, §11, §12, §13): 0 KB JS on documentation pages without a simulation (search loads only when opened); no third-party runtime requests; Astro CSP stays on; WCAG 2.2 AA.
- S6. Download page (PRD §6.12, §12): artifacts, sizes and SHA-256 sums of the latest GitHub release of `jorgealonsodev/plexustyping`, read at build time with a committed snapshot as fallback (the Docker build in Portainer may have no token or network).
- S8. "mira las tendencias en seo en 2026, y haz que la web sea lo mas optima posible" / "es importate que el seo on page sea lo mas optimo posible": SEO follows current (late 2026) guidance verified with sources, on top of PRD §10; every page type has an on-page template (title, description, h1–h3, first-paragraph answer, internal links, breadcrumbs, alt text, dates, JSON-LD, Open Graph) enforced by an automated check over the built HTML.
- S9. English simulations: user reported "los textos no cambian a ingles cuando pasamos a ingles" and decided "todo en ingles": on `/en` pages every simulation shows English everywhere: the app's interface labels translated, English practice text from the app's English corpus, and the English (US) keyboard layout. The Spanish pages keep the app's real Spanish UI. The English pages keep the statement that the released app's interface is in Spanish (PRODUCT.md).
- S7. Assumption: English mirror (`/en/…`, PRD F6) is a later task of this feature, after the Spanish content is approved; until then English routes exist only for the home.

## Tasks

- [ ] P0 · S3, S4, S5, S8 · delegated (parallel with P1, P1b; in progress 2026-11-23) · shared foundation: content collections + schema, layouts (FeatureLayout, DocsLayout with sidebar/breadcrumbs/TOC, ProsePage), SEO/JSON-LD helpers, nav wired to real routes, sitemap + robots + RSS plumbing, release-data module with snapshot · commit: —
- [x] P1 · S3 · delegated, worktree agent-ae1054 (resumed 2026-11-23 from uncommitted S8 partial) · simulations S8 (code mode), S9 (AI privacy diagram), S10 (accessibility) with preview pages · commit: eaf49f7, 88981df, a3182d4 (worktree branch, not merged yet)
- [ ] P1b · S9 · delegated, worktree agent-aa2e6 (in progress 2026-11-23) · localize simulations S1–S7 for `/en` (labels, English corpus text, en-US layout and key sequences) · commit: —
- [ ] P2 · S1–S4 · delegated, worktree · home below the hero (S2, S3 sections, feature overview, download close) and `/funciones` + nine feature pages mounting the simulations · commit: —
- [ ] P3 · S1, S2, S6 · delegated, worktree · `/descargar` · commit: —
- [ ] P4 · S1, S2, S4, S5 · delegated, worktrees · documentation content (Spanish), split by section across writers · commit: —
- [ ] P5 · S1, S2, S4 · delegated, worktree · `/novedades` (+ roadmap, RSS), `/preguntas-frecuentes`, `/privacidad`, `/licencias`, `llms.txt`, `llms-full.txt`, Pagefind search · commit: —
- [ ] P6 · S7 · delegated · English mirror · commit: —
- [ ] P7 · all · delegated · impeccable finish (detector, finish review, DESIGN.md) and one independent verifier (covers site-base-home T4 too) · commit: —

## Log

- L1 (2026-11-20, user): "hay que hacer las demas paginas"
- L2 (2026-11-20): latest app release checked with `gh`: v0.1.0, published 2026-11-19T15:31:07Z, assets `plexustyping-0.1.0-linux-x86_64.tar.gz` (12358708 B), `plexustyping_0.1.0_amd64.deb` (12512330 B), `PlexusTyping_0.1.0_x64-setup.exe` (9701277 B), `SHA256SUMS` (299 B). Routes: P0 runs first (shared files); P1 runs in parallel with P0 (disjoint surfaces); P2–P5 fan out after P0. No per-surface direction round: the world is settled and the PRD specifies each page's structure.
- L3 (2026-11-20, user): "mira las tendencias en seo en 2026, y haz que la web sea lo mas optima posible"; "es importate que el seo on page sea lo mas optimo posible". An Opus research worker gathers sourced 2026 SEO guidance; its checklist feeds P0 (helpers + an automated on-page check) before the page writers start.
- L4 (2026-11-20, user): screenshot of `/en` hero: "los textos no cambian a ingles cuando pasamos a ingles". Parent explained the app UI is Spanish-only (PRD §6.4, §6.13) and offered text+keyboard in English with Spanish labels vs. everything in English; user chose "todo en ingles".
- L5 (2026-11-23, user): "donde lo dejamos? continua con lo que consideres mas optimo". State found: no task done; P0 had only deps installed, P1 had an uncommitted S8 partial, P1b untouched. Writer trigger (a): P0, P1, P1b relaunched in parallel with disjoint edit surfaces. P2–P5 wait for P0's layout/helper API.
- L6 (2026-11-23): P1 done: pnpm test 114 passed/1 skipped (corpus check needs app repo), check 0 errors, build ok, islands ~4 KB gzip. S10 RED not observed (tests written first, run after). S9 dropped claims the app does not support (keys and stats do leave to the provider). Gaps: en-US layout comes from P1b; no English preview pages; English app labels are site translations. Merge waits until P0 stops writing in the main checkout.
