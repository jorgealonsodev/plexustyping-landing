---
title: "Settings search"
description: "Find any setting by typing its name: the search box of “Settings” filters by every word, ignoring case and accents."
section: ajustes
order: 2
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: [personalizacion, accesibilidad]
lang: en
---

The search box at the top of “Settings” shows only the settings whose name, description or options contain every word you type, ignoring case and accents. Results are grouped by section, with the number of matches. It gets focus when the window opens and `Ctrl+F` returns to it from anywhere.

The search uses the labels of the [interface language](/en/docs/settings/settings-map#appearance) you chose, so with the English interface you search with English words.

## How to search

1. Open the settings with `Ctrl+,`. Focus is already in the search box.
2. Type one or more words, for example `cursor` or `screen reader`.
3. Press `Enter` to go to the first matching setting.

## Matching rules

| Rule | Example |
|---|---|
| Every word must appear | `adaptive tempo` only shows “Adaptive tempo” |
| Case-insensitive | `AI` and `ai` give the same |
| Accent-insensitive | Accents can be left out, which helps in the Spanish, Portuguese, French and German interfaces |
| Searches name, description and options | `wood` finds the metronome's “Sound” setting |
| Empty search | Every setting is shown |

## Keys

Since version 0.2.0, `Esc` clears an active search even when focus is on another control, and moving through the section tabs with the arrow keys ends the search.

| Key | What it does |
|---|---|
| `Ctrl+F` | Returns to the search box and selects what you typed |
| `Enter` | Moves focus to the first matching setting |
| `Esc` | Clears the search from anywhere in the window and returns to the search box; a second `Esc` closes the window |
| `↑` / `↓`, `Home` / `End` on the tabs | Change section and end the search, like a click on the tab |

## Related

- [Settings window map](/en/docs/settings/settings-map)
- [Keyboard shortcuts](/en/docs/reference/keyboard-shortcuts)
