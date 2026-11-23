---
title: "AI providers and API keys · PlexusTyping"
description: "Which AI providers PlexusTyping supports and how it stores your API keys: only in the system keychain, never in plain text or in the database."
h1: "AI providers and API keys"
sidebarLabel: "Providers and keys"
section: ia
order: 2
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: ["ia"]
lang: en
---

PlexusTyping supports five AI providers: Claude (Anthropic), OpenAI, Google Gemini, OpenCode Go and ChatGPT (your subscription). The first four need your own API key; ChatGPT uses your plan with OpenAI's official sign-in. Keys are stored only in the operating system's keychain, never in plain text.

## Providers

| Provider | How it authenticates |
|---|---|
| Claude (Anthropic) | API key |
| OpenAI | API key |
| Google Gemini | API key |
| OpenCode Go | API key |
| “ChatGPT (tu suscripción)” (your subscription) | Sign-in in the browser, no key ([sign in with ChatGPT](/en/docs/ai/sign-in-with-chatgpt)) |

Each provider in the chain has its model: choose it from the provider's list or type it with “Other…”. With OpenCode Go's reasoning models, the app asks for the lowest reasoning effort so short texts arrive quickly.

## Saving and deleting a key

1. In Settings → AI, type the key in the provider's “API key” field.
2. Click “Save key”. The status changes to “Saved”.
3. To remove it, click “Delete key”. The status goes back to “No key”.

## Where they are stored

| System | Keychain |
|---|---|
| Linux | Secret Service |
| Windows | Credential Manager |

Keys are stored with the service `com.plexustyping.app` and the account `ai:<provider>`. They are never written to the database or the logs, and never returned to the interface.

If the system has no working keychain, you see “Keychain unavailable” and no key can be saved. The app keeps working with the local corpus.

## What each provider charges

Calls with an API key are billed to your account with the provider. The “AI usage” table counts calls and tokens per provider so you can watch the spending: [fallback chain, cache and usage](/en/docs/ai/fallback-cache-and-usage). What data each provider receives is in [what is sent and what is not](/en/docs/ai/what-is-sent).
