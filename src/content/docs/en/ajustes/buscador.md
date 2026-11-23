---
title: "Settings search"
description: "Find any setting by typing its name: the search box of “Ajustes” filters by every word, ignoring case and accents."
section: ajustes
order: 2
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: [personalizacion, accesibilidad]
lang: en
---

The search box at the top of “Ajustes” (settings) shows only the settings whose name, description or options contain every word you type, ignoring case and accents. Results are grouped by section, with the number of matches. It gets focus when the window opens and `Ctrl+F` returns to it from anywhere.

The app's labels are Spanish, so search with Spanish words.

## How to search

1. Open the settings with `Ctrl+,`. Focus is already in the search box.
2. Type one or more words, for example `cursor` or `lector pantalla` (screen reader).
3. Press `Enter` to go to the first matching setting.

## Matching rules

| Rule | Example |
|---|---|
| Every word must appear | `tempo adaptativo` only shows “Tempo adaptativo” |
| Case-insensitive | `IA` and `ia` give the same |
| Accent-insensitive | `metronomo` finds “Metrónomo” |
| Searches name, description and options | `madera` (wood) finds the metronome's “Sonido” (sound) setting |
| Empty search | Every setting is shown |

## Keys

| Key | What it does |
|---|---|
| `Ctrl+F` | Returns to the search box and selects what you typed |
| `Enter` | Moves focus to the first matching setting |
| `Esc` | Clears the search; a second `Esc` closes the window |

## Related

- [Settings window map](/en/docs/settings/settings-map)
- [Keyboard shortcuts](/en/docs/reference/keyboard-shortcuts)
