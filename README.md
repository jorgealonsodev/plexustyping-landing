<p align="center">
  <img src="src/assets/logo-wordmark.svg" alt="PlexusTyping" width="360">
</p>

# PlexusTyping website

Source of the public website of [PlexusTyping](https://github.com/jorgealonsodev/plexustyping), a free, open-source, local typing tutor for Linux and Windows. The site's jobs are the landing page, the downloads page and the user documentation. It is a static site built with Astro 6 and Svelte 5 islands.

This repository holds only the website. The app lives in its own repository, which this one expects to find checked out as the sibling directory `../plexustyping`. The site never builds or runs the app: it copies the app's appearance (styles, components, fonts, layouts) from that repository at a pinned commit.

## Status

Early development, on branch `feat/site-base-home`. Nothing is deployed yet.

| Area | State |
|------|-------|
| Site base: layout, header, footer, theme toggle, Spanish and English routing, security headers file | Built |
| Home page hero with the S1 simulation (practice screen, live stats, on-screen keyboard, heatmap) | Built |
| Pages | `/`, `/en`, `404`, `/sim-preview/s2` to `/sim-preview/s7` |
| Simulations S2 to S7 (PRD §8) as Svelte islands, each with a preview page at `/sim-preview/s2` to `/sim-preview/s7` | Built |
| Simulations S8 to S10 | Pending |
| Rest of the home page (feature sections, download call to action) | Pending |
| Downloads page, documentation, search (Pagefind), MDX content | Pending |
| `DESIGN.md` and the design finish pass | Pending |
| Deployment | Docker image and Portainer stack (`Dockerfile`, `docker-compose.yml`, `deploy/nginx/`) exist; nothing is deployed yet |
| CI (Lighthouse, Playwright, axe, link checker), domain | Not set up |

The feature log with tasks and evidence is in [`odd/tasks/site-base-home.md`](odd/tasks/site-base-home.md). The full product requirements are in [`PRD.md`](PRD.md) (Spanish).

## Quick start

Requirements:

- Node.js `>=22.12.0` (from `package.json` `engines`). Running `scripts/gen-sim-data.ts` directly needs Node 24 (TypeScript type stripping). Development currently uses Node 24.22.3.
- pnpm `10.34.5` (pinned in `package.json` `packageManager`; Corepack picks it up).

```bash
pnpm install          # install dependencies (CI should use --frozen-lockfile)
pnpm dev              # astro dev: local dev server
pnpm build            # astro build: static output in dist/
pnpm preview          # astro preview: serve the built dist/
pnpm test             # vitest run: unit tests in tests/
pnpm check            # astro check: type and template checks
```

## Project structure

```text
.
├── astro.config.mjs        # static output, i18n, built-in CSP, SITE_URL
├── public/
│   ├── _headers            # host security and cache headers (Cloudflare Pages format)
│   ├── favicon.svg
│   └── robots.txt
├── scripts/
│   └── gen-sim-data.ts     # authoring-time generator of src/sim/data/{es-qwerty,sequences}.ts
├── src/
│   ├── assets/             # app logos, used as is
│   ├── components/         # SiteHeader, SiteFooter, HomeHero, HeroSim (the S1 island)
│   ├── i18n/               # paths.ts (URL helpers), ui.ts (UI strings per language)
│   ├── layouts/Base.astro  # page shell, meta, canonical/hreflang, inline theme script
│   ├── pages/              # index.astro (es), en/index.astro, 404.astro
│   ├── scripts/theme.ts    # inline theme script and its CSP hash
│   ├── sim/                # code copied or extracted from the app (see below)
│   └── styles/             # tokens.css (app theme tokens), fonts.css, global.css
├── tests/                  # Vitest: i18n paths, replay, key sequences
├── PRD.md                  # product requirements (Spanish)
└── PRODUCT.md              # design context for the impeccable process
```

## Simulations

The simulations show the app working, with its real appearance. The rule: they are built from the app's own code and styles, never redrawn by eye.

| What | Where it comes from |
|------|---------------------|
| Typing engine (`TypingSession`) | `src/sim/practice/engine.ts`, verbatim copy |
| Keyboard component and helpers | `src/sim/keyboard/` (`Keyboard.svelte`, `geometry.ts`, `keys.ts`, `heat.ts`, `flash.ts`, `types.ts`), verbatim copies |
| Practice screen markup and CSS | `src/sim/practice/PracticeScreen.svelte`, extracted from the app's `App.svelte`, `ModeSwitch.svelte` and `Practice.svelte` |
| App base styles | `src/sim/app.css`, the app's `src/app.css` scoped to `.pt-app` |
| Theme colors | `src/styles/tokens.css`, generated with the app's `typingColors()` on Catppuccin Mocha (dark) and Catppuccin Latte (light) |
| Font | JetBrains Mono from `@fontsource/jetbrains-mono` 5.3.0, the same package and version the app bundles |
| Key positions per character | `src/sim/keyboard/locate.ts`, a TypeScript port of the app's Rust `Layout::locate` |

The pinned app commit is `14f64cf2b9619deca9d99c2dbb3a2358586c5390`. Every copied file names its source path and that commit in its header comment.

Rules for contributors:

- **Verbatim copies** say "Do not edit by hand: re-copy from the app instead". Update them by copying the file again from `../plexustyping` and updating the commit in the header.
- **Extracted code** keeps the app's class names, variables and values. Every deviation is marked with a `Demo edit:` comment that explains why (for example: no `<main>` or `<h1>` inside the demo, no `style` attributes because of the CSP).
- **Data is prerecorded.** The site has no Rust and calls no Tauri command. What Rust would compute (key sequences, heat scores, targets) is generated at authoring time or written as sample data, and the demo is labeled "demostración". Demo texts come unchanged from the app's Spanish corpus (`src/sim/data/texts.ts`); heat scores in `src/sim/data/demo.ts` are invented sample data.
- **Motion:** a recorded replay (`src/sim/replay.ts`) types when the visitor does not and stops when the visitor types. Under `prefers-reduced-motion` it never starts on its own.

### Regenerating copied data

Keyboard data (`src/sim/data/es-qwerty.ts` and `src/sim/data/sequences.ts`) is generated from the app's `layouts/es-qwerty.toml`. Run it by hand, never at build time:

```bash
node scripts/gen-sim-data.ts ../plexustyping
```

Theme tokens (`src/styles/tokens.css`) were generated by running the app's `typingColors()` at the pinned commit. This repository has no script for that step yet; regenerate them from the app and do not edit them by hand.

When you move to a newer app commit, update the commit in every header comment you touched.

## Deploy with Docker / Portainer

The repository builds its own image: `docker-compose.yml` runs the multi-stage `Dockerfile` (Node 22 and pnpm build the site, then unprivileged nginx serves `dist/`). The build needs only this repository, not the sibling `../plexustyping` checkout. The nginx config in `deploy/nginx/` carries the headers from `public/_headers`, the cache rules and the clean URLs (`/en` serves `en.html`).

The container serves plain HTTP on one host port. HTTPS comes from a reverse proxy in front of it, such as Nginx Proxy Manager.

| Variable | Default | Used for |
|----------|---------|----------|
| `SITE_URL` | `https://example.com` | Build argument: canonical and `hreflang` URLs. Changing it needs a rebuild |
| `SITE_PORT` | `14834` | Host port published for the container's port 8080 |

### As a Portainer Stack from Git

1. In Portainer, go to **Stacks > Add stack** and choose **Repository**.
2. Set the repository URL and the reference (for example `refs/heads/main`). For a private repository, add credentials.
3. Set **Compose path** to `docker-compose.yml`.
4. Under **Environment variables**, set `SITE_URL` to the public origin (no trailing slash) and, if 14834 is taken, `SITE_PORT`.
5. Optional: turn on **GitOps updates** (polling or webhook) to redeploy on new commits.
6. Deploy. Portainer builds the image on the server.

The service sets `pull_policy: build`, so every redeploy (**Pull and redeploy**, or a GitOps update) rebuilds the image from the new commit instead of reusing the old one.

### Behind Nginx Proxy Manager

1. Add a **Proxy Host** for your domain with scheme `http`, forward host `<server-ip>` and forward port `SITE_PORT`.
2. On the **SSL** tab, request or pick a certificate and turn on **Force SSL**.
3. Leave the **HSTS** toggle off in Nginx Proxy Manager. The site already sends `Strict-Transport-Security`; turning it on in both places sends the header twice.

Redirects from the container (for example `/en/` to `/en`) use relative `Location` headers, so they never expose the internal port.

### Locally

```bash
# Optional: create an env file with SITE_URL and SITE_PORT (for example `env-prod`,
# which is git-ignored) and pass it with --env-file. Defaults: https://example.com and 14834.
docker compose --env-file env-prod up -d --build
curl -I http://localhost:14834/
docker compose down
```

## Languages

| Language | URL | Source |
|----------|-----|--------|
| Spanish (default) | `/` | `src/pages/index.astro` |
| English | `/en` | `src/pages/en/index.astro` |

Both languages use the same slugs, and URLs never end in a slash (`trailingSlash: "never"`, `build.format: "file"`). `src/i18n/paths.ts` maps a path between languages; `src/i18n/ui.ts` holds the UI strings. The app's UI is Spanish only, and the English site must say so.

## Performance budgets

From PRD §2 and §11 (JS budget revised in PRD 0.1.2). None of them is checked automatically yet.

| Budget | Limit |
|--------|-------|
| JavaScript on the home page (gzip) | ≤ 60 KB total, ≤ 40 KB before scrolling |
| Shared Svelte runtime | ≤ 17 KB, counted once |
| Hero island's own chunk | ≤ 20 KB |
| Each other simulation's own chunks | ≤ 12 KB |
| Documentation pages without a simulation | 0 KB JavaScript |
| Home HTML (gzip) | ≤ 50 KB |
| Fonts on first paint | ≤ 2 files |

Pages are static HTML and work without JavaScript; islands only enhance them.

**No third parties at runtime:** no external fonts, scripts, analytics, iframes or CDNs. Everything is self-hosted.

## Security

- **Content Security Policy.** Astro's built-in CSP (`security.csp` in `astro.config.mjs`) writes a `<meta>` CSP on every page with hashes of every script and style it emits.
- **Inline theme script.** `src/scripts/theme.ts` holds the render-blocking theme script and computes its SHA-256 hash. Astro cannot hash a script inlined verbatim, so `src/layouts/Base.astro` adds it with `Astro.csp?.insertScriptHash(THEME_SCRIPT_HASH)`. If you change the script, the hash follows automatically.
- **No `ClientRouter`.** Astro's `<ClientRouter />` is not compatible with its built-in CSP. Page transitions use the native cross-document View Transitions API from CSS (`@view-transition`), which needs no JavaScript.
- **Host headers.** `public/_headers` (Cloudflare Pages format) sets HSTS, `X-Content-Type-Options`, `Referrer-Policy`, a restrictive `Permissions-Policy`, COOP, CORP, `X-Frame-Options` and a header CSP. The header CSP carries what a `<meta>` CSP cannot (`frame-ancestors`) and has no `script-src` or `style-src`, because the hashes differ per page. Hashed assets under `/_astro/*` are cached as immutable. The headers are unverified until the site is deployed.

## Design process

Design uses the impeccable skill:

- [`PRODUCT.md`](PRODUCT.md): users, positioning, brand commitments, constraints.
- [`.impeccable/surfaces/src-pages-index-astro.md`](.impeccable/surfaces/src-pages-index-astro.md): direction brief for the home page.
- `DESIGN.md`: pending; it is written from the finished build.

The site wears the app's own skin: Catppuccin Mocha by default, JetBrains Mono, the app's components. The logos in `src/assets/` are the app's, used as is.

## Configuration

| Variable | Used for | Default |
|----------|----------|---------|
| `SITE_URL` | Absolute URLs for canonical and `hreflang` links | `https://example.com` (placeholder until the domain is decided) |

```bash
SITE_URL=https://your-domain.example pnpm build
```

## License

This repository does not declare a license yet (there is no `LICENSE` file).
