---
title: "Keyboard heatmap · PlexusTyping"
description: "What PlexusTyping's heatmap shows: each key tinted by your errors and slowness, with a level from 1 to 5 that does not depend on color."
h1: "Keyboard heatmap"
sidebarLabel: "Heatmap"
section: motor-adaptativo
order: 3
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: ["motor-adaptativo", "accesibilidad"]
lang: en
---

The heatmap tints every key of the on-screen keyboard by your error and slowness score, and marks it with a level from 1 to 5 so it does not depend on color alone. It is off by default; turn it on in Settings → Keyboard → “Heatmap”. A legend below the keyboard explains the five levels.

## Turning it on

1. Show the on-screen keyboard with <kbd>F2</kbd> if it is hidden.
2. Open “Settings” with <kbd>Ctrl</kbd>+<kbd>,</kbd> and go to Keyboard.
3. Turn on “Heatmap”.

## How to read it

The legend says: “Errors per key: 1 very few, 2 few, 3 some, 4 quite a few, 5 many”.

| Level | Meaning |
|---|---|
| No level | No tint: score 0 or a key without data |
| 1 | Very few |
| 2 | Few |
| 3 | Some |
| 4 | Quite a few |
| 5 | Many |

The tint has ten intensities and each visible level groups two.

## Where each key's score comes from

- The score is that of the single characters in the weak-spot model: [how it measures your weak spots](/en/docs/adaptive-engine/how-it-measures-weak-spots).
- If a key produces several characters (on any layer: normal, Shift or AltGr), it shows the worst.
- A composed character such as “á” or “ü” counts for the key of its base letter.
- In code mode, the map uses the code model; in prose and words, the prose one.

Each [profile](/en/docs/progress/profiles) has its own map. More about the keyboard in [on-screen keyboard and flashes](/en/docs/keyboard-and-languages/on-screen-keyboard-and-flashes).
