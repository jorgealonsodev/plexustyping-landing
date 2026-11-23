---
title: "Where data is stored"
description: "Your sessions, statistics and settings are stored only on your computer, in an SQLite database. Paths on Linux and Windows, AI keys and temporary mode."
section: ajustes
order: 3
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: [progreso, ia]
lang: en
---

PlexusTyping stores everything on your computer, with no account and no telemetry. Sessions, keystrokes, statistics, profiles and settings are in the `plexustyping.sqlite3` file, inside the application's data folder: on Linux, `~/.local/share/com.plexustyping.app/`. AI keys are kept apart, in the system keychain.

## Paths

| What | Linux | Windows |
|---|---|---|
| Database `plexustyping.sqlite3` | `~/.local/share/com.plexustyping.app/` | `%APPDATA%\com.plexustyping.app\` |
| ChatGPT session `chatgpt-auth.json` | `~/.config/com.plexustyping.app/` | `%APPDATA%\com.plexustyping.app\` |
| CSV exports | Downloads folder | Downloads folder |

On Linux, if you have `XDG_DATA_HOME` or `XDG_CONFIG_HOME` set, the folders are inside them instead of `~/.local/share` and `~/.config`.

## What is in the database

- Profiles, with their daily goal, and which one is active.
- Each profile's sessions, keystrokes and statistics.
- Interface and practice settings (theme, keyboard, metronome, typography…). They are written as soon as they change, so closing the app never loses the last change.
- AI settings, without the keys.
- The cache of generated texts and the AI usage counters.

## AI keys

API keys are stored only in the system keychain: Credential Manager on Windows and Secret Service on Linux, with the service `com.plexustyping.app` and the account `ai:<provider>`. They are never stored in plain text or in the database, and never go back to the interface. Without a working keychain no key can be saved. More in [providers and keys](/en/docs/ai/providers-and-keys).

The `chatgpt-auth.json` file stores the tokens of [sign in with ChatGPT](/en/docs/ai/sign-in-with-chatgpt), readable only by your user.

## Temporary mode

If the database cannot be opened, the app keeps working with a temporary in-memory store and the header shows “Not saving: temporary mode”. In that mode:

- Sessions last until you close the app.
- The history shows “No saved sessions yet.”.
- The daily goal and progressive unlock only last until you close the app.

## When uninstalling

`./install.sh --uninstall`, the uninstaller of the `.tar.gz` version, keeps your data in `~/.local/share/com.plexustyping.app/`. See [update and uninstall](/en/docs/getting-started/update-and-uninstall).

## Related

- [Export the history to CSV](/en/docs/progress/export-csv)
- [Privacy](/en/docs/project/privacy)
