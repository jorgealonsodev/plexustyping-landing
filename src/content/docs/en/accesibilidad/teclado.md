---
title: "Use PlexusTyping with the keyboard only"
description: "How to move around PlexusTyping without a mouse: F6 to the header, Tab between controls, arrows in the settings and Esc to close windows."
h1: "Keyboard navigation"
sidebarLabel: "Keyboard"
section: accesibilidad
order: 1
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: [accesibilidad]
lang: en
---

All of PlexusTyping can be used without a mouse. While you type, focus is in the practice field; `F6` moves it to the first control of the header and `Tab` moves through the rest. The settings and history windows close with `Esc` and return focus to where you opened them from.

## Leaving the text and coming back

| Key | Where | What it does |
|---|---|---|
| `F6` | Practice field, in any mode | Moves focus to the header's first control (the logo key) |
| `Tab` / `Shift+Tab` | Prose and words | Moves focus between controls |
| `Tab` | Code, while you type | Types the indentation (does not move focus) |

In code, `Tab` is a measured key of the text; use `F6` to leave. A mouse click outside a settings control returns focus to the practice field.

## Windows

- **Settings** (`Ctrl+,`) and **History** (`Ctrl+H`) close with `Esc`, with their `×` button or with the same shortcut that opens them.
- If you opened the window with a shortcut, focus returns to the practice field. If you opened it with a header button, it returns to that button.
- Inside these windows, keys do not reach the practice: `Esc` closes the window instead of restarting the text and `Enter` never starts the next one. Only `F2` (on-screen keyboard) works from anywhere.

## Settings window

| Key | What it does |
|---|---|
| `Ctrl+F` | Returns to the search box from anywhere in the window |
| `Enter` in the search box | Goes to the first matching setting |
| `Esc` in the search box | Clears the search; a second `Esc` closes the window |
| `↑` / `↓` in the section list | Previous or next section, wrapping around |
| `Home` / `End` in the section list | First or last section |

More details in [settings search](/en/docs/settings/settings-search).

## Metronome quick panel

When you open the panel from the pulse dot, focus enters the panel and `Tab` cycles through its controls only. `Esc` closes it and returns focus to the pulse dot. See [quick panel](/en/docs/metronome/quick-panel).

## Related

- [Keyboard shortcuts](/en/docs/reference/keyboard-shortcuts): the full list.
- [Screen reader](/en/docs/accessibility/screen-reader)
