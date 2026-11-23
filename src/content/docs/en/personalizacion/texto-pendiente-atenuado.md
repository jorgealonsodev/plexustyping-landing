---
title: "Dimmed pending text"
description: "“Atenuar texto pendiente” lowers the contrast of the text still to type so what you typed stands out. When it applies and how to turn it off."
section: personalizacion
order: 5
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: [personalizacion, accesibilidad]
lang: en
---

“Atenuar texto pendiente” (dim pending text), in Settings → Text, lowers the contrast of the text still to type, in prose and code, so what you typed stands out. It is on by default. The pending text sits at about 2.5:1 against its background, below the AA level; turned off, it gets back the AA colors.

## How it works

| State | Pending text | Typed text |
|---|---|---|
| On (default) | A contrast of about 2.5:1 | Full color |
| Off | The theme's colors, which meet WCAG AA | Full color |

The setting's hint sums it up: “Baja el contraste del texto por escribir por debajo del nivel AA para que destaque lo escrito; desactívalo para recuperarlo.” (it lowers the contrast of the text still to type below the AA level so what you typed stands out; turn it off to restore it).

## Exception: high contrast

The “Alto contraste oscuro” and “Alto contraste claro” (high contrast dark and light) themes never dim the pending text, even with the setting on. See [high contrast](/en/docs/accessibility/high-contrast).

## When to turn it off

Turn it off if you find it hard to read the text that comes next. Dimming is an exception to WCAG AA that you control: with the setting off, every bundled theme meets AA.

## Related

- [Themes and VS Code import](/en/docs/personalization/themes-and-vs-code)
- [Cursor](/en/docs/personalization/cursor)
