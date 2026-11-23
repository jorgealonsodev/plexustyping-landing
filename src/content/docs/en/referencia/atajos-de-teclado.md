---
title: "Keyboard shortcuts"
description: "Every PlexusTyping keyboard shortcut: global ones, in the practice text, in the settings window, in the history and in the metronome panel."
section: referencia
order: 1
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: [accesibilidad, metronomo, modo-codigo]
lang: en
---

These are all the keyboard shortcuts of PlexusTyping 0.2.0. The global ones work from the practice screen: `Ctrl+,` opens the settings, `Ctrl+H` the history, `F5` loads a new text, `F4` turns on the metronome, `F2` shows the on-screen keyboard and `F6` goes to the header. Shortcuts only count without other modifiers added.

## Global

| Shortcut | What it does |
|---|---|
| `Ctrl+,` | Opens or closes “Settings” |
| `Ctrl+H` | Opens or closes the “History” |
| `F5` | Discards the current text and loads a new one |
| `F4` | Turns the metronome on or off |
| `F2` | Shows or hides the on-screen keyboard; also works inside the windows |
| `F6` | From the practice field, moves focus to the header's first control |

With “Settings” or “History” open, keys stay in the window: only `F2` reaches the application.

## In the practice text

| Key | When | What it does |
|---|---|---|
| `Esc` | While typing or on the results | Restarts the text; in an “Unlimited” text, ends the session and scores what you typed |
| `Enter` | On the results | “Next text”, if focus is not on a button such as “Repeat” |
| `Backspace` | While typing | Deletes the last character, according to the [error mode](/en/docs/practice/error-modes) |
| `Enter` | Code mode | Line break, measured as a keystroke |
| `Tab` | Code mode | Indentation: types a tab or skips the spaces to the next tab stop; measured as a keystroke |
| `Tab` / `Shift+Tab` | Prose and words | Moves focus between controls |

`Esc` only restarts from the practice field, never from another control. `Ctrl+Backspace` does not delete.

## “Settings” window

| Key | What it does |
|---|---|
| `Ctrl+F` | Returns to the search box |
| `Enter` in the search box | Goes to the first matching setting |
| `Esc` | With an active search, clears it from anywhere in the window; otherwise, closes the window |
| `↑` / `↓` | Previous or next section in the section list; ends an active search |
| `Home` / `End` | First or last section; they also end an active search |
| `Ctrl+,` | Closes the window |

## “History” window

| Key | What it does |
|---|---|
| `Esc` or `Ctrl+H` | Closes the window |

## Metronome quick panel

| Key | What it does |
|---|---|
| `Tab` / `Shift+Tab` | Moves through the panel's controls, wrapping around |
| `Enter` in the tempo field | Applies the typed tempo |
| `Esc` | Closes the panel and returns focus to the pulse dot |

## Unlimited text

With the “Unlimited” length, `Esc` ends the session and scores what you typed instead of restarting, like the “End” button. See [length and unlimited text](/en/docs/practice/length-and-unlimited-text).

## Related

- [Keyboard navigation](/en/docs/accessibility/keyboard)
- [Settings search](/en/docs/settings/settings-search)
- [Quick panel](/en/docs/metronome/quick-panel)
