---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/en/index.astro"]
---

# Surface brief: home (`/`)

Scope: the landing page at `/` (and its `/en/` mirror). Visitor mode: **Persuade**.

Audience and job: someone arriving from a search engine or AI assistant must understand in 10 seconds that PlexusTyping finds THEIR weak keys and bigrams and writes the next text for them, see it working, and download it for their OS.
Proof: the S1 hero simulation (real typing, synthetic data labeled "demostración"), then S2 (weak spots) and S3 (unlimited text). No real screenshots exist yet.
Constraint from the user: a polished result fails if it reads as "just another speed test". The user then chose the category standard on purpose; the diagnosis (targets line, heatmap, next text) must therefore be visible inside the hero demo, not below the fold.
User requirement (2026-11-20): simulations run in motion to show the app's features and must have the exact appearance of PlexusTyping (app components, CSS tokens, themes, fonts); with `prefers-reduced-motion` they wait for the visitor to start them.
Quality bar (user-named peers): zed.dev, ghostty.org, Monkeytype/keybr, obsidian.md.
Chosen sketch (composition the build matches): `.impeccable/mocks/decision/canon.html`.

Unresolved: display/UI typeface (must be self-hosted, not Inter-as-display); light theme palette (Catppuccin Latte is the natural counterpart); domain; visible author name.

## Direction contract

THESIS: The website wears the app's own skin, so what you see is what you download; the hero is the app working, and it shows the diagnosis ("Practicando: ñ · qu · z", heatmap) rather than only speed. It refuses decoration that the app itself would not have.

OWN-WORLD: Catppuccin Mocha: ground #1e1e2e, surface #313244, text #cdd6f4, muted #6c7086, accent blue #89b4fa, pink #f5c2e7, next-key yellow #f9e2af; light theme from Catppuccin Latte. JetBrains Mono for practice text, keys and numbers; a quiet sans for prose. Components borrowed from the app: segmented mode switch, bordered keycaps, bar cursor, stats row, app-window panel with hairline borders. The binding keycap logo, unmodified.

STORY: "It adapts to my mistakes" → I type and see it happen → it is free, local and private → I download for my OS (or send myself the link on mobile).

FIRST VIEWPORT: Top nav (logo, Funciones, Documentación, Novedades, blue Descargar button). Centered headline "Mecanografía que se adapta a tus fallos." with the second line in blue, one line of subcopy, primary "Descargar para Linux/Windows" (OS-detected) plus secondary outline button. Below, centered app-window panel with the live S1 simulation: stats row, targets line, monospace practice text with bar cursor, ISO keyboard with next key in yellow and heat tint. Three short proof labels at the bottom edge.

FORM: The category standard, chosen by the user as the standing exit (canon), executed at the craft level of the named peers. Signature interaction: typing in the hero tints the keyboard heatmap and rewrites the "Practicando" targets. Motion: View Transitions between pages; in-demo motion only (cursor, key flashes), none under reduced motion. seed:321456f21acb5765

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
