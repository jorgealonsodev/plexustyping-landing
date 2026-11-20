# Feature: site base and home with app-faithful simulations
Objective: Astro 6 + Svelte 5 static site base and the home page (`/`), whose simulations copy the PlexusTyping app's appearance from its repository. Branch: `feat/site-base-home`. Delivery strategy: ask-on-risk.
Test runner: `pnpm test` (Vitest) and `pnpm build`; Playwright later (PRD §16). App source pinned at `../plexustyping` commit `14f64cf2b9619deca9d99c2dbb3a2358586c5390`.

## Specs

- S1. "lee el prd y comienza el diseñoss de la web": the site follows PRD.md (stack §15, URLs §5, performance §11, security §12, accessibility §13). Design follows PRODUCT.md and the direction contract in `.impeccable/surfaces/src-pages-index-astro.md`; the home matches the chosen sketch `.impeccable/mocks/decision/canon.html`.
- S2. "quiero simulaciones de la app en movimiento, para que vean sus caracteristicas": simulations play in motion (a recorded replay when the visitor does not type); under `prefers-reduced-motion` they do not autoplay (PRD §8, §13).
- S3. "la simulaciones deben tener la apariecia exacta de plexustyping" / "lo que quiero es qeu copies eel aspecto de la app, que saques los estilos de su repo": simulation styles (CSS tokens, component styles, fonts, cursor, keyboard) are taken from the app repository, not redrawn. Fidelity scope confirmed by the user: "Solo el aspecto" (appearance only; data is prerecorded and labeled "demostración"; no Rust at build time).
- S4. The logo `../plexustyping/assets/logo.svg` and `logo-wordmark.svg` are used as is (user: "Sí, obligatorio tal cual").
- S5. Assumption (from PRD §2/§11, not restated by the user): home JS ≤ 35 KB gzip, hero island ≤ 20 KB gzip, no third-party runtime resources.

## Tasks

- [x] T1 · S1, S4, S5 · delegated (user instruction: orchestrator delegates to Opus agents) · Astro 6 + Svelte 5 scaffold, base layout, nav/footer, theme tokens from the app (Catppuccin Mocha default), fonts self-hosted, es/en routing skeleton, security headers file · commit: a886d1c
- [x] T2 · S2, S3 · delegated · `src/sim/`: styles and components extracted from the app (practice text + cursor, stats row, targets line, visual keyboard), engine copy, prerecorded demo data · commit: 42abb69
- [x] T3 · S1, S2, S3 · delegated · Home page with the S1 hero island (type or replay), matching canon.html; responsive; reduced motion · commit: 42abb69 (S5 budget NOT met)
- [ ] T4 · S1 · delegated · impeccable finish: detector, finish review, DESIGN.md · commit: —

## Log

- L1 (2026-11-20, user): "/mnt/1tb/Repos/Personal/20261116_plexustyping/20261116_plexustyping_git/plexustyping-landing/PRD.md  lee el prd y comienza el diseñoss de la web, si necesi/mnt/1tb/Repos/Personal/20261116_plexustyping/20261116_plexustyping_git/plexustypingta inforamcion sobre funcionalidades de demas, el repo de la app esta en"
- L2 (2026-11-20, user): "eres el orquestador, las tareas envialas a agentes con opus"
- L3 (2026-11-20): direction rounds; user chose the category canon (app skin); peers zed.dev, ghostty.org, Monkeytype/keybr, obsidian.md.
- L4 (2026-11-20, user): "revisa la documentacion, quiero simulaciones de la app en movimiento, para que vean sus caracteristicas"
- L5 (2026-11-20, user): "la simulaciones deben tener la apariecia exacta de plexustyping"
- L6 (2026-11-20, user): fidelity question answered "Solo el aspecto"; then "lo que quiero es qeu copies eel aspecto de la app, que saques los estilos de su repo".
- L7 (2026-11-20): app map (Opus explorer): pure TS reusable: practice/engine.ts, keyboard/Keyboard.svelte + geometry.ts + keys.ts + heat.ts, themes/colors.ts + themes.ts, code/CodeText.svelte, metronome/beat.ts + MetronomeQuick.svelte + BeatDot.svelte, practice/ghost.ts, announce.ts. Practice.svelte (1129 lines) is Tauri-bound: extract its markup and CSS. Layouts are TOML in `layouts/`; convert to the TS `Layout` JSON. Rust-only data (targets, heat scores, key sequences, syntect tokens, unlock states) is prerecorded.
- L8 (2026-11-20): T1 done (a886d1c). Parent re-ran `pnpm test` (10 passed) and `pnpm build` (3 pages). Worker notes: Astro 6.4.8 kept per PRD although 7.x exists; native CSS `@view-transition` instead of ClientRouter (incompatible with Astro CSP); header CSP omits script/style-src because hashes are per page (meta CSP carries them); canonical uses https://example.com until SITE_URL is set; headlines use the system UI font (display face still open); tokens generated with the app's typingColors() at app commit 14f64cf. Risk: item 5 (new dependencies, host headers unverified until deployed).
- L9 (2026-11-20): T2+T3 done (42abb69). Parent re-ran `pnpm test` (25 passed) and `pnpm build`; desktop dark screenshot matches the app. S5 FAILED: hero island ≈34.1 KB gzip (demo 17.8 + Svelte 5 runtime 15.7) vs 20; home ≈36.6 KB vs 35. Pending user decision: relax budget or drop the Svelte runtime. Copied verbatim from app 14f64cf: practice/engine.ts, format.ts, keyboard/{types,keys,geometry,heat,flash}.ts, Keyboard.svelte; PracticeScreen.svelte extracted from App/ModeSwitch/Practice.svelte ("Demo edit" comments); locate.ts ported from Rust Layout::locate; layout is layouts/es-qwerty.toml. Demo uses "Borrar con Retroceso" mode; heat scores are invented demo data. Risk: item 6 (island behaviour and visual fidelity have no automated test).
