---
title: "Targets and weak spots · PlexusTyping"
description: "What “Practicando: ñ · qu · z” and “Tus puntos débiles” mean in PlexusTyping, and how to choose 2 or 3 targets per text."
h1: "Targets and weak spots"
section: practicar
order: 4
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: ["motor-adaptativo"]
lang: en
---

Every adaptive text practices 2 or 3 weak units: single characters or pairs of consecutive letters, such as “qu” or “rr”. They appear above the text, for example “Practicando: ñ · qu · z” (practicing: ñ · qu · z), and the results then show your updated weak spots. Choose how many in Settings → Practice → “Objetivos”.

## Choosing how many targets

1. Open “Ajustes” (settings) with <kbd>Ctrl</kbd>+<kbd>,</kbd>.
2. In Practice → “Objetivos”, choose 2 (the default) or 3.
3. The change applies from the next text.

With more targets, each text spreads the practice over more units.

## Where you see them

| Place | What it shows |
|---|---|
| Above the text | The text's source and “Practicando:” (practicing) followed by the targets |
| Results | “Tus puntos débiles” (your weak spots, or “Tus puntos débiles en código” in code), with the note “El siguiente texto los practica.” (the next text practices them) |
| On-screen keyboard | The [heatmap](/en/docs/adaptive-engine/heatmap), if it is on |

## The diagnostic text

While you have not saved any session, the app does not know yet what costs you and offers a fixed diagnostic text, without targets. Once you save the first session, the adaptive texts begin. More in [first launch](/en/docs/getting-started/first-launch).

## How they are chosen

The targets come from a model that scores each unit by errors and slowness. They are drawn at random among the worst, more likely the worse the score, so the same ones are not always repeated. The details are in [how it measures your weak spots](/en/docs/adaptive-engine/how-it-measures-weak-spots) and [how it picks the texts](/en/docs/adaptive-engine/how-it-picks-texts).
