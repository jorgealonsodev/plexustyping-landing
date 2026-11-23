---
title: "Turn on the AI to generate texts · PlexusTyping"
description: "How to turn on PlexusTyping's optional AI: add a provider, choose the model, save the key and test the connection. Without AI, the app works the same."
h1: "Turn on the AI to generate texts"
sidebarLabel: "Turn on the AI"
section: ia
order: 1
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: ["ia"]
lang: en
---

PlexusTyping's AI is optional: it makes the practice texts more varied, but the app works the same without it and offline, with its local corpus. To turn it on, go to Settings → AI, switch on “Usar IA para generar textos” (use AI to generate texts) and add at least one provider with its model and its API key.

## Steps

1. Open “Ajustes” (settings) with <kbd>Ctrl</kbd>+<kbd>,</kbd> and go to the “IA” (AI) section.
2. Turn on “Usar IA para generar textos”.
3. Click “Añadir proveedor” (add provider) and choose one: Claude, OpenAI, Google Gemini, OpenCode Go or “ChatGPT (tu suscripción)” (your subscription).
4. Choose the model from the provider's list or type it with “Otro…” (other).
5. Paste your API key and click “Guardar clave” (save key). ChatGPT has no key: click “Iniciar sesión con ChatGPT” (sign in with ChatGPT) ([sign in with ChatGPT](/en/docs/ai/sign-in-with-chatgpt)).
6. Click “Probar conexión” (test connection). If all goes well you see “Conexión correcta” (connection OK).

From the next text on, above each generated text you see “Generado con IA ·” (generated with AI) followed by the provider and the model.

## Options of the AI section

| Option | What it does |
|---|---|
| Tema (topic) | An optional topic for the texts, for example “viajes” (travel; up to 60 characters). Left empty, a topic is drawn so texts do not repeat |
| Densidad (density) | How many times more often than normal your targets appear in code mode: 2× to 5× (3× by default) |
| Cadena de respaldo (fallback chain) | Up to five providers, tried in order ([fallback chain, cache and usage](/en/docs/ai/fallback-cache-and-usage)) |

## The “IA” button in the header

It is the same setting as “Usar IA para generar textos”. On, new texts are generated with the AI. Off, no request is made: saved AI texts of the same language and mode are used, rotating so they do not repeat, or the local corpus if there are none.

## Before you turn it on

- Keys are stored in the system keychain: [providers and keys](/en/docs/ai/providers-and-keys).
- What you type is never sent: [what is sent and what is not](/en/docs/ai/what-is-sent).
- The “Palabras” (words) mode never uses the AI, even when it is on.
