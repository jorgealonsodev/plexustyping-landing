---
title: "Privacy in PlexusTyping"
description: "A summary of PlexusTyping's privacy: data only on your computer, no account or telemetry, keys in the keychain and what is sent to the AI."
h1: "Privacy"
section: proyecto
order: 1
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: [ia, progreso]
lang: en
---

PlexusTyping stores everything on your computer, with no account and no telemetry, and what you type never leaves it. The only internet connection is the one for AI texts, which is optional: then only the text's language, length and topic are sent. This page sums it up; the full policy is in [privacy](/en/privacy).

## In short

| Topic | What PlexusTyping does |
|---|---|
| Account | There is none. Profiles are local. |
| Telemetry | There is none. |
| What you type | Never leaves your computer. |
| Practice data | In a local SQLite database. |
| AI keys | In the system keychain, never in plain text or in the database. |
| Network requests | Only for the AI, and they leave only from the Rust core; the interface has no network access. |

## What is sent to the AI

Only if you turn on the AI:

- **Prose:** language, length and topic; with progressive unlock, also the allowed characters.
- **Code:** in addition, the targets and the allowed characters.

With “ChatGPT (tu suscripción)” (your subscription), the session tokens are stored in a private file on your computer, `chatgpt-auth.json`, never in the database, the logs or the interface. Details in [what is sent and what is not](/en/docs/ai/what-is-sent).

## Related

- [Full privacy policy](/en/privacy)
- [Where data is stored](/en/docs/settings/where-data-is-stored)
- [Providers and keys](/en/docs/ai/providers-and-keys)
