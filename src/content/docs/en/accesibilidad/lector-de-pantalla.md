---
title: "Practice with a screen reader"
description: "“Screen reader announcements” reads the next character, every error, every new text and the result through an aria-live region."
h1: "Screen reader"
section: accesibilidad
order: 2
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: [accesibilidad]
lang: en
---

With “Screen reader announcements”, in Settings → Accessibility, PlexusTyping announces through your screen reader the next character after every keystroke, every missed key, the start of each new text and the results line. It uses a polite `aria-live` region, which does not interrupt. It is off by default and, while off, announces nothing.

## What is announced

The announcements follow the [interface language](/en/docs/keyboard-and-languages/text-languages#interface-language); the examples on this page are those of the English interface.

| Moment | Example |
|---|---|
| After every keystroke | “next: a” |
| Missed key | “error: expected e, typed r” |
| New text | “New text of 300 characters. next: l” |
| Result | “Result: 42 net WPM, accuracy 96.5%, time 1:05, 3 errors.” |

After an error, the next character is also announced if the cursor moved on.

## Character names

Characters a screen reader would skip or read ambiguously are spoken by name:

| Character | Announced as |
|---|---|
| Space | “space” |
| Line break | “line break” |
| Tab | “tab” |
| `,` `.` `;` `:` | “comma”, “period”, “semicolon”, “colon” |
| `¿` `?` `¡` `!` | “inverted question mark”, “question mark”, “inverted exclamation mark”, “exclamation mark” |
| `(` `)` `[` `]` `{` `}` | “left parenthesis”, “right parenthesis”, “left bracket”, “right bracket”, “left brace”, “right brace” |
| `«` `»` | “left angle quote”, “right angle quote” |

A capital letter is announced as the letter followed by “capital”, for example “capital e”.

## Tips

- The practice field is described by the text region, so the reader identifies it when it gets focus.
- To leave the text with the keyboard, press `F6`. See [keyboard navigation](/en/docs/accessibility/keyboard).

## Related

- [Color-blind mode](/en/docs/accessibility/color-blind-mode)
- [Keyboard shortcuts](/en/docs/reference/keyboard-shortcuts)
