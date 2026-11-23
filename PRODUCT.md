# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro 6 (static output) with Svelte 5 islands, strict TypeScript, content collections + MDX, Shiki at build time, Pagefind search, `astro:assets`, modern CSS (layers, `@container`, `color-mix`, custom properties; no utility framework unless the design process decides otherwise). Hosting on a static host with configurable headers and CDN (Cloudflare Pages recommended); domain pending. Source: PRD.md §15.

## Users

Primary job of every visitor: understand within 10 seconds what PlexusTyping does differently, see it working, and download it for their OS. Confirmed audiences (PRD §3):

- People who want to type better and faster (students, office workers, exam candidates) searching for free typing courses/practice. They need to see it is free, offline, and adapts to their mistakes.
- Programmers looking for typing practice for code: code mode, symbols, Dvorak/Colemak, open source, privacy.
- Monkeytype/keybr users who want more: familiar cursor and fonts, unlimited text, heatmap, weak-spot analysis.
- People with accessibility needs: high-contrast themes, screen reader, color-blind mode, adjustable type, reduced motion.
- Linux users: `.deb`, `.tar.gz`, no AppImage; clear dependencies and SHA-256 sums.

Physical scene: most arrive at night or on a break, from a laptop or desktop, often with system dark mode on. About a third arrive on mobile; they read rather than download, so the site must let them send or remember the link.

## Product Purpose

PlexusTyping is a free, open-source, local desktop typing tutor for Linux and Windows. Unlike speed tests, it measures which keys and letter combinations cost you (errors and slowness, per character and per bigram) and generates texts that practice them, from a local corpus or with optional AI.

The website has three jobs: convince and get the download; host all user documentation, searchable and linkable; be found by search engines and AI assistants (2026 SEO/GEO). Success metrics are in PRD §2 (≥15 % download clicks per home visit, median <30 s to first download/simulation click, Lighthouse 100×4, A+ security headers, WCAG 2.2 AA with zero axe violations, ≤35 KB JS on the home).

## Positioning

It diagnoses your personal weak characters and bigrams (EMA of error and slowness, uncertainty bonus) and writes the next text around them, offline, with no account and no telemetry. When AI is used, what you type is never sent; requests leave only from the Rust core. Speed-test sites cannot truthfully claim both the per-bigram adaptive loop and the fully local, private desktop model.

## Operating Context

- Evaluation happens on the website through interactive simulations (S1–S10, PRD §8) that reuse the app's real logic (`TypingSession`, derived themes with contrast guard, heatmap levels) with synthetic, labeled "demostración" data. No AI calls from the web; AI texts are prerecorded samples.
- Downloads point to GitHub Releases artifacts; release data and SHA-256 sums are read at build time.
- Usage happens in the desktop app: keyboard-only, shortcuts (`Ctrl+,`, `Ctrl+H`, `F2`, `F4`, `F5`, `F6`, `Esc`, `Enter`).
- App source: `../plexustyping` (README.md is the truth for features).

## Capabilities and Constraints

- Feature inventory and its truth rules: PRD.md §6 is the single source of content, checked against app tag `v0.2.0` (released 2026-11-23). The site states everything the app does today and nothing it does not. The former *(próxima versión 0.1.1)* items (lengths 800–2000 and «Ilimitado») shipped in 0.2.0; §6.13 planned items appear only labeled as such.
- The app UI comes in five languages since v0.2.0 (Español, English, Português (Brasil), Français, Deutsch; it follows the computer's language, English when unsupported; Settings → Appearance, separate from the practice-text language). Spanish pages quote the app's Spanish labels, English pages its English labels.
- Platforms: Linux x86_64 (`.deb` for Ubuntu 22.04+, package `plexus-typing`; `.tar.gz` needing WebKitGTK 4.1 + GTK 3) and Windows 10/11 x64 (unsigned per-user installer; SmartScreen warning explained honestly). No macOS, no AppImage, no auto-update in v1.
- Licenses: code MIT or Apache-2.0; fonts OFL-1.1; word lists CC BY-SA 4.0; Common Voice CC0; themes MIT; syntect MIT.
- Hard technical constraints: static HTML, 0 KB JS by default, islands hydrated on visibility (≤12 KB gzip each, hero ≤20 KB), no third-party runtime resources, strict CSP with hashes, full security headers, self-hosted WOFF2 fonts (≤2 files on first paint).
- Languages: Spanish primary at `/`, full English mirror at `/en/`. URLs without trailing slash.
- Out of scope v1: accounts, rankings, blog, full app in the browser.
- Undecided: domain and final host; analytics (recommendation: none or self-hosted cookieless); visible author/organization name for `Organization`/`Person` and privacy page; whether further app versions ship before the site.

## Brand Commitments

- Name: PlexusTyping. Tagline in the existing wordmark: "Adaptive typing".
- **Binding logo, used as is** (confirmed by the user 2026-11-20): the keycap mark with a bold "P" and a pink F/J homing bump, `../plexustyping/assets/logo.svg` and `../plexustyping/assets/logo-wordmark.svg`. Its colors are fixed: keycap top gradient `#b4cdff`→`#7aa2f7`, side `#4f6fa8`→`#2a3b66`, glyph `#1e1e2e`, homing bump `#f5c2e7`.
- The app has its own identity (terminal themes, Catppuccin Mocha default, JetBrains Mono, bar cursor). Simulations show the app as it is; the website may extend that identity, and the direction contract must state how the two coexist (PRD §9).
- Standing visual preference (confirmed by the user 2026-11-20): the category standard, played straight. The website wears the app's own skin (Catppuccin Mocha, JetBrains Mono, app components). Peers that set the craft bar: zed.dev, ghostty.org, Monkeytype/keybr, obsidian.md.
- **Simulations look exactly like the app** (confirmed by the user 2026-11-20): every simulation of PlexusTyping on the website reproduces the app's real appearance (its components, CSS tokens, themes, fonts, cursor, keyboard), in motion, so visitors see the actual features. They are built from the app's own components and styles, never redrawn by eye.
- Voice: plain, honest, verifiable; no claims about third parties that cannot be verified.

## Evidence on Hand

- Product inventory: PRD.md §6, verified against the app on 2026-11-19.
- Logo assets: `../plexustyping/assets/`; app icons in `../plexustyping/src-tauri/icons/`.
- Real screenshots: to be generated with the app's e2e script (Xvfb, isolated data). None exist yet; never invent screenshots.
- No testimonials, user counts, reviews, press, or benchmarks exist. Do not fabricate any.

## Product Principles

1. Truth over pitch: every claim traces to the shipped app (tag `v0.2.0`) or carries a "planeado" label.
2. Show, don't tell: the app working (simulations) is the argument; copy supports it.
3. Private and local by construction: the site mirrors the product, with no third parties, no tracking, no accounts.
4. Fast and complete without JavaScript: static HTML is the whole page; islands only enhance.
5. Accessible as a feature, not a checkbox: the audience includes people who rely on it.

## Accessibility & Inclusion

WCAG 2.2 AA across both color schemes, reusing the app's contrast guard for site colors. Full keyboard navigation, visible focus, skip link, correct `lang` per page and fragment. Simulations are pausable, keyboard-operable, have a text alternative, and do not autoplay under `prefers-reduced-motion`; no automatic sound. Checked with axe in CI and manually with Orca and NVDA.
