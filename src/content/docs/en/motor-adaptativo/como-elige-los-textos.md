---
title: "How it picks the texts · PlexusTyping"
description: "How PlexusTyping chooses each text's targets and how it builds the text: local corpus, single words, code snippets or AI."
h1: "How the adaptive engine picks the texts"
sidebarLabel: "How it picks texts"
section: motor-adaptativo
order: 2
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: ["motor-adaptativo", "ia", "modo-codigo"]
lang: en
---

For every new text, PlexusTyping picks 2 or 3 targets among your worst-scored units, with some randomness so it does not always repeat the same ones, and builds a text that contains them often. Without AI, the text comes from the language's local corpus; with the AI on, it is requested from the provider and validated before it is shown.

## 1. Choosing the targets

1. Units with at least 3 samples are sorted by their score ([how it measures your weak spots](/en/docs/adaptive-engine/how-it-measures-weak-spots)).
2. Twice the number of targets are taken as candidates: the 4 worst with 2 targets, the 6 worst with 3.
3. The targets are drawn among them, more likely the worse the score. Each candidate has a small extra probability, so one with a score of 0 can also come up.

If there are few candidates, all are used. The targets are shown above the text: “Practicando: ñ · qu · z” (practicing: ñ · qu · z).

## 2. Building the text

| Mode | How it is built |
|---|---|
| Prose (local corpus) | Sentences of 4 to 10 words starting with a capital; at least half of the words contain a target. Without targets, corpus sentences are joined |
| Words | Real lowercase words; at least half contain a target |
| Code (bundled snippets) | The snippet is chosen by how often it uses your weak symbols |
| Prose with AI | A text is requested in your language, with the length and the topic; the targets are not requested |
| Code with AI | The targets are requested, with how many times each must appear, according to the “Densidad” (density, 2× to 5×) |

In every case the text only uses characters your [layout](/en/docs/keyboard-and-languages/layouts) can type: with English (US), a Spanish text carries no ñ or accents. With [progressive unlock](/en/docs/practice/progressive-unlock), only the active characters.

## 3. Where the text comes from

| Label above the text | Source |
|---|---|
| “Texto de diagnóstico” (diagnostic text) | The language's fixed text, until the first session is saved |
| “Generado con IA · …” (generated with AI) | The provider and model that generated it |
| “Texto del caché” (cached text) | An AI text generated earlier and saved on your computer |
| “Corpus local” (local corpus) | The app's offline generator |

With the “IA” button in the header off, no request is made: new texts are saved AI texts of the same language and mode, rotating so they do not repeat, or the local corpus if there are none. More in [turn on the AI](/en/docs/ai/turn-on-ai) and [fallback chain, cache and usage](/en/docs/ai/fallback-cache-and-usage).

## No waiting

The next text is prepared in the background as soon as you start typing the current one, so it is usually ready when you finish.
