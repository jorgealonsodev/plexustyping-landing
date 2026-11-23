---
title: "Turn on the AI to generate texts · PlexusTyping"
description: "How to turn on PlexusTyping's optional AI: add a provider, choose the model, save the key and test the connection. Without AI, the app works the same."
h1: "Turn on the AI to generate texts"
sidebarLabel: "Turn on the AI"
section: ia
order: 1
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: ["ia"]
lang: en
---

PlexusTyping's AI is optional: it makes the practice texts more varied, but the app works the same without it and offline, with its local corpus. To turn it on, go to Settings → AI, switch on “Use AI to generate texts” and add at least one provider with its model and its API key.

## Steps

1. Open “Settings” with <kbd>Ctrl</kbd>+<kbd>,</kbd> and go to the “AI” section.
2. Turn on “Use AI to generate texts”.
3. Click “Add provider” and choose one: Claude, OpenAI, Google Gemini, OpenCode Go or “ChatGPT (tu suscripción)” (your subscription).
4. Choose the model from the provider's list or type it with “Other…”.
5. Paste your API key and click “Save key”. ChatGPT has no key: click “Sign in with ChatGPT” ([sign in with ChatGPT](/en/docs/ai/sign-in-with-chatgpt)).
6. Click “Test connection”. If all goes well you see “Connection OK”.

From the next text on, above each generated text you see “AI-generated ·” followed by the provider and the model.

## Options of the AI section

| Option | What it does |
|---|---|
| Topic | An optional topic for the texts, for example “travel” (up to 60 characters). Left empty, a topic is drawn so texts do not repeat |
| Density | How many times more often than normal your targets appear in code mode: 2× to 5× (3× by default) |
| Fallback chain | Up to five providers, tried in order ([fallback chain, cache and usage](/en/docs/ai/fallback-cache-and-usage)) |

## The “AI” button in the header

It is the same setting as “Use AI to generate texts”. On, new texts are generated with the AI. Off, no request is made: saved AI texts of the same language and mode are used, rotating so they do not repeat, or the local corpus if there are none.

## Before you turn it on

- Keys are stored in the system keychain: [providers and keys](/en/docs/ai/providers-and-keys).
- What you type is never sent: [what is sent and what is not](/en/docs/ai/what-is-sent).
- The “Words” mode never uses the AI, even when it is on.
