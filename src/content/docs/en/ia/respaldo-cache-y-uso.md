---
title: "AI fallback chain, cache and usage · PlexusTyping"
description: "What PlexusTyping does when an AI provider fails: a chain of up to five providers, time limits, cache, local corpus and a usage table."
h1: "AI fallback chain, cache and usage"
sidebarLabel: "Fallback, cache and usage"
section: ia
order: 4
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: ["ia"]
lang: en
---

The fallback chain is the ordered list of AI providers PlexusTyping tries for each text, up to five. If one fails or takes too long, it moves to the next; if all fail, the text comes from the cache or the local corpus, with a notice. So an AI failure never leaves you without a text.

## Building the chain

In Settings → AI → “Cadena de respaldo” (fallback chain):

1. Add providers with “Añadir proveedor” (add provider); each provider can appear only once.
2. Order them with the “Subir” and “Bajar” (up and down) arrows; they are tried from top to bottom.
3. Remove one with “Quitar” (remove).
4. Check each one with “Probar conexión” (test connection).

How to configure each provider is in [providers and keys](/en/docs/ai/providers-and-keys).

## What happens with each request

| Situation | What the app does |
|---|---|
| Slow request | Each provider has 30 seconds; the whole chain, 60 |
| A text that fails validation | One retry with the same provider and then the next one |
| All fail or there is no key | A cached AI text that has never been shown, or a new text from the local corpus |
| ChatGPT plan error | The chain stops, without using your keys ([sign in with ChatGPT](/en/docs/ai/sign-in-with-chatgpt)) |

A valid text must fit the length, use only characters your layout can type and contain no Markdown. When a text is rejected, its retry asks for any text in the language, without targets. Each failed attempt is written to the app's error output, never with the key.

## Notices and text source

If the text does not come from the AI, a short note above it explains why. The source is always shown:

- “Generado con IA · Claude · …” (generated with AI: provider and model)
- “Texto del caché” (cached text)
- “Corpus local” (local corpus)

## The usage table

The “Uso de la IA” (AI usage) table counts, per provider, the calls and the tokens of today and in total (“Llamadas”, “Tokens hoy”, “Tokens totales”: calls, tokens today, total tokens). “Actualizar” (refresh) reloads the data. It helps you watch what you spend with your keys. It is stored in the local database, like the cache of generated texts.

## No waiting

The next text is requested in the background as soon as you start typing the current one, so it is usually ready when you finish. More in [how it picks the texts](/en/docs/adaptive-engine/how-it-picks-texts).
