---
title: "Source code and contributing"
description: "PlexusTyping's code is on GitHub. Repository layout, requirements to build it, development commands and how to propose changes."
section: proyecto
order: 3
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: [motor-adaptativo, ia]
lang: en
---

PlexusTyping's source code is on GitHub, at [jorgealonsodev/plexustyping](https://github.com/jorgealonsodev/plexustyping), under the MIT or Apache-2.0 license. It is written in Rust with Tauri 2, and the interface in Svelte 5. To build it you need Rust 1.88 or later, Node 22 or later, pnpm and the system dependencies of Tauri 2.

## Repository layout

| Path | Contents |
|---|---|
| `crates/plexustyping-core` | Session engine: keystroke replay, error modes, statistics |
| `crates/plexustyping-layouts` | Keyboard layouts (TOML) and dead-key composition |
| `crates/plexustyping-corpus` | Local corpora (es, en, pt, fr, de) and the non-AI text generator |
| `crates/plexustyping-store` | Local SQLite store: profiles, sessions, keystrokes, statistics, AI cache and usage |
| `crates/plexustyping-ai` | AI providers, request, validation and fallback chain |
| `crates/plexustyping-audio` | Metronome audio |
| `crates/plexustyping-highlight` | Syntax highlighting of code snippets |
| `src-tauri` | The Tauri application (the `plexustyping` binary) |
| `src` | Svelte 5 interface |

## Build and test

```sh
pnpm install
pnpm tauri dev      # run the app
cargo test --workspace
pnpm check && pnpm test
pnpm tauri build    # installers: .deb on Linux, .exe (NSIS) on Windows
```

The Linux `.tar.gz` is built with `scripts/package-linux-tarball.sh`.

## Releases

When a `v*` tag is pushed, GitHub Actions builds the `.deb`, the `.tar.gz`, the `.exe` and the `SHA256SUMS` file, and attaches them to a draft release that a maintainer publishes.

## Proposing changes

Bugs and proposals are handled in the GitHub repository. To report a failure, follow [report a bug](/en/docs/help/report-a-bug).

## Related

- [Licenses and credits](/en/docs/project/licenses-and-credits)
- [Release notes](/en/docs/project/release-notes)
