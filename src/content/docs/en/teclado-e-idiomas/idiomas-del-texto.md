---
title: "Text languages · PlexusTyping"
description: "Which languages PlexusTyping practices in: Spanish, English, Brazilian Portuguese, French and German, each with its offline local corpus."
h1: "Text languages"
section: teclado-e-idiomas
order: 2
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: ["distribuciones-e-idiomas"]
lang: en
---

PlexusTyping generates practice texts in five languages: Spanish (the default), English, Brazilian Portuguese, French and German. The language is chosen in Settings → Practice → “Idioma” (language) and changing it loads a new text. Each language has its own local corpus, so offline practice works in all of them.

## The five languages

| Option in the app | Language |
|---|---|
| Español | Spanish (default) |
| English | English |
| Português (Brasil) | Brazilian Portuguese |
| Français | French |
| Deutsch | German |

The app's interface is in Spanish only; the chosen language is the language of the practice texts.

## What each corpus includes

- The language's 5,000 most frequent words.
- Everyday sentences, among them up to 2,000 sentences from Mozilla Common Voice (CC0), filtered to simple text that the language's layout can type.
- A diagnostic paragraph, a new profile's first text ([first launch](/en/docs/getting-started/first-launch)).

With the AI on, texts are also requested in that language ([turn on the AI](/en/docs/ai/turn-on-ai)).

## Language and layout

The language and the [keyboard layout](/en/docs/keyboard-and-languages/layouts) are chosen separately. Texts only use characters the layout can type: for example, with English (US) a Spanish text carries no `ñ` or accents.

## What each session saves

Every saved session records its language: you see it in the history and in the `idioma` (language) column of the [exported CSV](/en/docs/progress/export-csv). Code mode does not depend on the language.

## Per profile

Each [profile](/en/docs/progress/profiles) has its own language. The weak-key statistics, however, are a single model per profile for all languages.
