---
title: "Themes and VS Code import"
description: "PlexusTyping ships 59 light and dark themes and can import up to 30 VS Code themes (.json or .jsonc). How to choose them and which colors are read."
section: personalizacion
order: 1
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: [personalizacion, accesibilidad]
lang: en
---

PlexusTyping includes 59 color themes: the 57 PlexusTerm ones plus “High contrast dark” and “High contrast light”. Choose them in Settings → Appearance; they apply at once. You can also import up to 30 VS Code themes from a `.json` or `.jsonc` file, which appear in the same selector, under “Imported”.

## Choosing a theme

The “Theme” selector groups the themes into “Dark”, “Light” and “Imported”. The default theme is Catppuccin Mocha. The theme is saved per [profile](/en/docs/progress/profiles).

All bundled themes meet WCAG AA. The two high-contrast ones reach 7:1 for text: see [high contrast](/en/docs/accessibility/high-contrast).

## Importing a VS Code theme

1. Open Settings → Appearance.
2. Click “Import VS Code theme…” and choose the theme file.
3. The theme applies at once and stays under “Imported”.

| Limit | Value |
|---|---|
| Format | `.json` or `.jsonc`, with comments and trailing commas |
| Maximum size | 1 MB |
| Imported themes | Up to 30 |
| Same name | Replaces the theme imported earlier |

“Remove imported theme” deletes the selected imported theme and goes back to the default theme. Imported themes are shared by all profiles.

## Which colors are read

| File key | Use in PlexusTyping |
|---|---|
| `editor.background`, `editor.foreground` | Background and text (required) |
| `editorCursor.foreground` | Cursor |
| `editor.selectionBackground` | Selection |
| `terminal.ansiBlack` … `terminal.ansiBrightWhite` | The 16 ANSI colors that color the keyboard, the states and the code highlighting |

- Each missing ANSI color is taken from the base scheme: PlexusTerm for dark themes and the first light scheme for light ones.
- The theme is dark or light according to its `type` field and, if it has none, according to the background.
- `tokenColors` and `include` are not read, and the colors' transparency is discarded.

## Related

- [Fonts](/en/docs/personalization/fonts)
- [Dimmed pending text](/en/docs/personalization/dimmed-pending-text)
- [Licenses and credits](/en/docs/project/licenses-and-credits): authors of the bundled themes.
