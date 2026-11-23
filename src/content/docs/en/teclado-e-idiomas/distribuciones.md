---
title: "Keyboard layouts · PlexusTyping"
description: "PlexusTyping's eight keyboard layouts: Spanish (Spain and Latin America), US, ABNT2, AZERTY, QWERTZ, Dvorak and Colemak."
h1: "Keyboard layouts"
sidebarLabel: "Layouts"
section: teclado-e-idiomas
order: 1
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: ["distribuciones-e-idiomas"]
lang: en
---

PlexusTyping includes eight keyboard layouts, chosen in Settings → Keyboard → “Distribución” (layout). The layout decides how the on-screen keyboard is drawn and which characters can appear in the texts. It must match the one set in your operating system, because keystrokes arrive from the system keyboard.

## The eight layouts

| Layout | Shape | Dead keys | Notes |
|---|---|---|---|
| Español (España) (default) | ISO | <code>´ ¨ ^ &#96;</code> | |
| Español (Latinoamérica) | ISO | <code>´ ¨ ^ &#96;</code> | `@` on AltGr+Q, `\` on AltGr+`'`, `~` on AltGr+`+` |
| English (US) | ANSI | None | No AltGr layer |
| Português (Brasil) | ABNT2 | <code>´ &#96; ^ ~ ¨</code> | `ç` key; extra `/ ?` key next to right Shift |
| Français (France) | ISO | `^ ¨` | Numbers with Shift; no `æ œ` or accented capitals |
| Deutsch (Deutschland) | ISO | <code>^ ´ &#96;</code> | `ß ä ö ü` keys |
| English (Dvorak) | ANSI | None | US Dvorak; same characters as US |
| English (Colemak) | ANSI | None | US Colemak; same characters as US |

## Changing layout

1. Set the same layout in your operating system.
2. In PlexusTyping, open “Ajustes” (settings) with <kbd>Ctrl</kbd>+<kbd>,</kbd> and go to Keyboard → “Distribución”.
3. Choose yours. A new text loads at once.

## What the layout changes

- **The on-screen keyboard:** labels, next-key highlight and heatmap ([on-screen keyboard and flashes](/en/docs/keyboard-and-languages/on-screen-keyboard-and-flashes)).
- **The characters in the texts:** only the ones the layout can type appear. With English (US), a Spanish text carries no `ñ` or accents.
- **The diagnostic text:** a new profile starts with the chosen language's one if the layout can type it.
- **The history:** each session saves its layout (the `layout` column of the CSV).

## Limits

- The app does not yet warn you if its layout does not match the system's: if they differ, the keys will not match the drawing.
- The weak-key statistics are a single model per profile, shared by all languages.
- [Progressive unlock](/en/docs/practice/progressive-unlock) saves its progress per layout.

The text languages are chosen separately: [text languages](/en/docs/keyboard-and-languages/text-languages).
