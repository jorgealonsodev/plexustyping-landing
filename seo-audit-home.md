# On-page SEO audit: home (`/`)

- **URL:** `/` (Spanish home; English mirror `/en` is out of scope)
- **Target query:** «programa para aprender mecanografía»
- **Role:** commercial / navigational entry point (Persuade surface)
- **Audited build:** commit `a07ec9d`, `pnpm build` in a scratch copy, file `dist/index.html`
- **Date:** 2026-11-23

## Summary

The page is technically sound: one h1, a clean hierarchy, a unique title and description within limits, reciprocal hreflang, JSON-LD and Open Graph are all present. The gap is **relevance to the target query**. The visible text never says «programa» or «aprender», the word «mecanografía» appears once (in the h1), and the first paragraph is 18 words long, while the project's own rule (PRD §10, site-pages S4) asks for a 40–60 word direct answer. The page speaks to people who already type and want to fix weak keys. Someone searching for «programa para aprender mecanografía» is often a beginner, and the beginner path that does exist (progressive unlock) is not mentioned or linked from the home page.

## Score

| # | Dimension | Score | Finding |
|---|---|---|---|
| 1 | Title tag | Needs work | «PlexusTyping: mecanografía que se adapta a tus fallos» (53 chars). It is unique, but the brand comes first and «programa» and «aprender» are missing. |
| 2 | Meta description | Needs work | 151 chars, clear value («gratis, libre y sin conexión para Linux y Windows»), but it says «Tutor» rather than «programa para aprender» and does not address beginners. |
| 3 | Header structure | Pass | One h1, four h2s, nine h3s under «Todo lo que hace», no skipped levels. The h1 contains «mecanografía». |
| 4 | Body content | Needs work | First paragraph is 18 words (rule: 40–60). Query words: «mecanografía» ×1, «aprender» ×0, «programa» ×0 in `<main>`. About 1,700 words in `<main>`, mostly simulation text. |
| 5 | Internal links | Needs work | 18 links out of `<main>` with descriptive anchors, and 82 of 88 built pages link back to `/`. Missing: a link to `/docs/practicar/desbloqueo-progresivo` («Desbloqueo progresivo para principiantes»), the page that answers the beginner intent. |
| 6 | Images and media | Pass | Only SVG images with width and height set. The decorative logo has `alt=""` and the wordmark has alt text. The Open Graph image is a PNG. |
| 7 | URL slug | Pass | `/`. |
| 8 | On-page schema | Pass | `WebSite`, `Organization` and `SoftwareApplication` (`EducationalApplication`, price 0, licences, `featureList`). The schema matches the visible content; «Texto ilimitado» is correctly left out of `featureList` because it ships in 0.1.1. |

## Critical

1. **The canonical, hreflang and Open Graph URLs use `https://example.com`.** No on-page change can rank while the domain is a placeholder. A Docker build without `SITE_URL` is also deliberately `noindex` site-wide. Fix: set the real `SITE_URL` in Portainer before any SEO work counts. This is an open decision for the owner.

## Important

2. **Rewrite the title with the query first and the brand last** (draft A below). Keep the h1 as it is, so the title and the h1 stay distinct.
3. **Rewrite the meta description to match the query and cover both audiences** (draft B).
4. **Extend the first paragraph to a 40–60 word direct answer** that states what the product is, in the query's own words, and names the beginner path (draft C). Every claim in the draft is backed by the docs: it is free, open source (MIT/Apache-2.0), works offline, runs on Linux and Windows, and has progressive unlock for beginners. Progressive unlock is **off by default**, so the copy must say «actívalo» and must not imply it is automatic.
5. **Link to `/docs/practicar/desbloqueo-progresivo` from the home page**, either in the first paragraph or in the «Todo lo que hace» section, with a descriptive anchor such as «desbloqueo progresivo para principiantes».

## Nice-to-have

6. Add one short beginner-oriented line to the download close (h2 «Descárgalo y practica hoy»), for example «Sirve tanto si empiezas desde cero como si quieres corregir tus teclas débiles.»
7. No other page targets this query (checked across all 88 built pages), so there is no cannibalization. Keep it that way: feature and docs pages should link to the home page with this query as the anchor rather than compete for it.
8. Re-measure after deploy in Search Console: impressions and position for «programa para aprender mecanografía», «aprender mecanografía» and «programa de mecanografía gratis».

## Drafted replacements

**A. Title** (57 chars)

```
Programa gratis para aprender mecanografía · PlexusTyping
```

**B. Meta description** (154 chars)

```
Programa gratis y sin conexión para aprender mecanografía en Linux y Windows. Empieza desde cero o practica las teclas y combinaciones que más te cuestan.
```

**C. First paragraph** (about 50 words)

```
PlexusTyping es un programa gratuito y de código abierto para aprender mecanografía en Linux y Windows, sin conexión. Si empiezas desde cero, activa el desbloqueo progresivo: empiezas con la fila central y la app añade teclas según las dominas. Si ya escribes, mide qué teclas te cuestan y practica justo esas.
```

The h1 stays «Mecanografía que se adapta a tus fallos.»

## Notes for applying

- Applying these drafts changes `/` and must be mirrored on `/en`, which is being built right now (site-pages T6).
- After applying: run `pnpm build`, then `pnpm test` and `check:seo`. The title and description limits are already enforced by `check:seo`.
