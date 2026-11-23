---
title: "Report a bug"
description: "How to report a PlexusTyping bug on GitHub: which details to include (version, system, package, steps) and what never to share."
section: ayuda
order: 3
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: [motor-adaptativo, ia]
lang: en
---

PlexusTyping bugs are reported by opening an *issue* in the GitHub repository `jorgealonsodev/plexustyping`. First, check [troubleshooting](/en/docs/help/troubleshooting). In the report, include the version, your system, the package you installed, the steps to reproduce the failure and the exact message. Never share your API keys.

## Steps

1. Check that the problem is not in [troubleshooting](/en/docs/help/troubleshooting).
2. Open [the repository's issues](https://github.com/jorgealonsodev/plexustyping/issues) and search whether someone already reported it.
3. If not, create a new *issue* with the details below.

## What to include

| Detail | Where to find it |
|---|---|
| Version | In the downloaded file's name, for example `plexustyping_0.1.0_amd64.deb` |
| System | Linux distribution and its version, or Windows 10 or 11 |
| Package | `.deb`, `.tar.gz` or `.exe` installer |
| Steps | What you did, what you expected and what happened |
| Message | The exact text of the notice, for example “Metrónomo: No hay dispositivo de audio” |
| Settings involved | Mode (Prosa, Palabras or Código), layout, language, error mode |

If the failure is in the AI, give the provider and the model. On Linux, when you run `plexustyping` from a terminal, the AI's failed attempts are written to the error output, without the key: you can copy those lines.

## What not to share

- Your API keys.
- The `chatgpt-auth.json` file, which contains your ChatGPT session.
- Your `plexustyping.sqlite3` database, unless you want to share your history.

## Related

- [Source code and contributing](/en/docs/project/source-code-and-contributing)
- [Where data is stored](/en/docs/settings/where-data-is-stored)
