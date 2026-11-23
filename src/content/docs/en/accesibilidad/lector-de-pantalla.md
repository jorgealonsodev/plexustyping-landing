---
title: "Practice with a screen reader"
description: "“Anunciar con lector de pantalla” reads the next character, every error, every new text and the result through an aria-live region."
h1: "Screen reader"
section: accesibilidad
order: 2
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: [accesibilidad]
lang: en
---

With “Anunciar con lector de pantalla” (announce with screen reader), in Settings → Accessibility, PlexusTyping announces through your screen reader the next character after every keystroke, every missed key, the start of each new text and the results line. It uses a polite `aria-live` region, which does not interrupt. It is off by default and, while off, announces nothing.

## What is announced

The announcements are in Spanish, like the app's interface.

| Moment | Example |
|---|---|
| After every keystroke | “siguiente: a” (next: a) |
| Missed key | “error: esperaba e, pulsaste r” (error: expected e, you pressed r) |
| New text | “Texto nuevo de 300 caracteres. siguiente: l” (new text of 300 characters. next: l) |
| Result | “Resultado: 42 PPM netas, precisión 96,5 %, tiempo 1:05, 3 errores.” (result: 42 net WPM, accuracy 96.5 %, time 1:05, 3 errors) |

After an error, the next character is also announced if the cursor moved on.

## Character names

Characters a screen reader would skip or read ambiguously are spoken by name:

| Character | Announced as |
|---|---|
| Space | “espacio” |
| Line break | “salto de línea” |
| Tab | “tabulador” |
| `,` `.` `;` `:` | “coma”, “punto”, “punto y coma”, “dos puntos” |
| `¿` `?` `¡` `!` | “abre interrogación”, “cierra interrogación”, “abre exclamación”, “cierra exclamación” |
| `(` `)` `[` `]` `{` `}` | “abre paréntesis”, “cierra paréntesis”, “abre corchete”, “cierra corchete”, “abre llave”, “cierra llave” |
| `«` `»` | “abre comillas angulares”, “cierra comillas angulares” |

A capital letter is announced as the letter followed by “mayúscula” (capital), for example “e mayúscula”.

## Tips

- The practice field is described by the text region, so the reader identifies it when it gets focus.
- To leave the text with the keyboard, press `F6`. See [keyboard navigation](/en/docs/accessibility/keyboard).

## Related

- [Color-blind mode](/en/docs/accessibility/color-blind-mode)
- [Keyboard shortcuts](/en/docs/reference/keyboard-shortcuts)
