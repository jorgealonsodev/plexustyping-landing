---
title: "What is sent to the AI and what is not · PlexusTyping"
description: "What data PlexusTyping sends to an AI provider (language, length and topic) and what never leaves your computer: what you type and your keys."
h1: "What is sent to the AI and what is not"
sidebarLabel: "What is sent and what is not"
section: ia
order: 5
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: ["ia"]
lang: en
---

When the AI is on, PlexusTyping sends the provider only what it needs to ask for a text: the language, the length and the topic. In code mode it adds the target characters and the allowed characters. What you type never leaves your computer, and requests leave from the app's Rust core, not from the interface.

## What is sent

| Mode | Request data |
|---|---|
| Prose | Language, length range and topic |
| Prose with [progressive unlock](/en/docs/practice/progressive-unlock) | The above and the allowed characters |
| Code | Programming language, targets with how many times they must appear, and allowed characters |

The topic is the one you typed in Settings → AI or, if you left it empty, one drawn by the app.

## What is never sent

- What you type, or your keystrokes.
- Your statistics, your history or your profiles.
- One provider's keys to another: each key goes only to its provider.

## How keys and requests are protected

- Keys live in the system keychain, never in plain text or in the database: [providers and keys](/en/docs/ai/providers-and-keys).
- Requests leave the Rust core directly for the provider's servers; the interface has no network access.
- ChatGPT tokens are stored in a private file on your computer: [sign in with ChatGPT](/en/docs/ai/sign-in-with-chatgpt).

## Without AI

If you do not turn on the AI, no request is made: texts come from the local corpus and the app works offline. More in [turn on the AI](/en/docs/ai/turn-on-ai).
