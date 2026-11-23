---
title: "What is PlexusTyping · Documentation"
description: "PlexusTyping is an adaptive, free and open-source typing tutor for Linux and Windows that practices your weak keys offline."
h1: "What is PlexusTyping"
section: empezar
order: 1
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: ["motor-adaptativo", "ia", "distribuciones-e-idiomas"]
lang: en
---

PlexusTyping is a desktop typing tutor for Linux and Windows, free and open source. It measures which characters and two-letter combinations you get wrong or type slowly and builds the next text around them. It works offline and with no account; the AI for generating texts is optional.

## How it works

The loop is always the same: you type, the app measures every keystroke, recalculates your weak spots and prepares a text that targets them. Above the text you see what it is practicing, for example “Practicando: ñ · qu · z” (practicing: ñ · qu · z).

1. You type a text. The clock starts with the first key.
2. At the end, you see net and gross WPM, accuracy, errors and missed characters.
3. You press <kbd>Enter</kbd> (“Siguiente texto”, next text) and the new text insists on what costs you.

The details are in [how it measures your weak spots](/en/docs/adaptive-engine/how-it-measures-weak-spots) and [how it picks the texts](/en/docs/adaptive-engine/how-it-picks-texts).

## What it includes

| Area | What version 0.1.0 has |
|---|---|
| Practice | “Prosa”, “Palabras” and “Código” (prose, words and code) modes, three [error modes](/en/docs/practice/error-modes), [ghost session](/en/docs/practice/ghost-session) and [progressive unlock](/en/docs/practice/progressive-unlock) |
| Keyboard | Eight [layouts](/en/docs/keyboard-and-languages/layouts) and an [on-screen keyboard](/en/docs/keyboard-and-languages/on-screen-keyboard-and-flashes) with a heatmap |
| Text languages | Spanish, English, Brazilian Portuguese, French and German, with a local corpus |
| Code | 15 programming languages, with syntax highlighting |
| Rhythm | A [metronome](/en/docs/metronome/basics) from 30 to 300 BPM with adaptive tempo |
| Optional AI | Five providers, among them your ChatGPT subscription ([turn on the AI](/en/docs/ai/turn-on-ai)) |

The app's interface is in Spanish only. The practice texts can be in any of the five languages. This documentation gives each Spanish label of the app in quotes, followed by its English meaning, and names the settings sections in English.

## Privacy and data

Everything is saved on your computer, with no account and no telemetry. If you turn on the AI, what you type is never sent: see [what is sent and what is not](/en/docs/ai/what-is-sent).

## Next step

Install the app on [Linux with the .deb package](/en/docs/getting-started/install-linux-deb), on [Linux with the .tar.gz archive](/en/docs/getting-started/install-linux-tar) or on [Windows](/en/docs/getting-started/install-windows), and continue with the [first launch](/en/docs/getting-started/first-launch).
