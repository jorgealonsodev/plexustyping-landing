---
title: "Error modes · PlexusTyping"
description: "What happens when you miss a key in PlexusTyping depending on the error mode: “Allow continuing”, “Stop until corrected” or “Erase with Backspace”."
h1: "Error modes"
section: practicar
order: 3
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: ["motor-adaptativo"]
lang: en
---

The error mode decides what happens when you press a wrong key: “Allow continuing” (the default), “Stop until corrected” or “Erase with Backspace”. Choose it in Settings → Practice → “Error mode”; changing it restarts the current text. In all three, every wrong keystroke counts in your statistics.

## The three modes

| Mode | When you miss a key | Backspace |
|---|---|---|
| Allow continuing | The character is marked as an error and you move to the next | Does nothing |
| Stop until corrected | You stay on the same character until you press the right key | Does nothing |
| Erase with Backspace | The character is marked as an error and you move on | Reopens the previous position to type it again |

## Which one to choose

- **Allow continuing:** keeps the rhythm. Useful to measure your real speed and to practice with the [metronome](/en/docs/metronome/basics).
- **Stop until corrected:** forces you to get each character right before moving on. Each failed attempt at the same position is also recorded.
- **Delete with Backspace:** feels like typing in an editor: you correct with <kbd>Backspace</kbd>.

In code mode with automatic indentation, Backspace never stops inside indentation filled in by the app: it goes back to the previous line break.

## How errors count

All errors, including the ones you correct, feed the weak-spot model. See [how it measures your weak spots](/en/docs/adaptive-engine/how-it-measures-weak-spots). The [ghost session](/en/docs/practice/ghost-session) works in all three modes.
