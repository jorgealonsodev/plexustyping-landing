---
title: "On-screen keyboard and flashes · PlexusTyping"
description: "How PlexusTyping's on-screen keyboard works: next key highlighted, color per finger, green and red flashes, and how to show it with F2."
h1: "On-screen keyboard and flashes"
section: teclado-e-idiomas
order: 3
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: ["distribuciones-e-idiomas", "accesibilidad"]
lang: en
---

The on-screen keyboard is a keyboard drawn below the text, with your layout's labels, that highlights the next key and tells you which finger to press it with. As you type, each key flashes green if you hit it and red if you missed. <kbd>F2</kbd> shows or hides it, and it is visible by default.

## Showing or hiding it

- Press <kbd>F2</kbd>.
- Or click the logo key in the header: the bar under its P lights up green while the keyboard is visible.
- Or use Settings → Keyboard → “Teclado visual” (on-screen keyboard).

## What it shows

| Element | Detail |
|---|---|
| Shape | ISO, ANSI (US layouts) or ABNT2 (Brazilian Portuguese), depending on the [layout](/en/docs/keyboard-and-languages/layouts) |
| Labels | Normal, Shift and AltGr layers; dead keys underlined |
| Next key | Highlighted, together with Shift or AltGr when needed |
| Color per finger | Each key in the color of the finger that presses it |
| Flashes | Green on a hit, red on a miss |
| Heatmap | Optional: levels 1 to 5 by your errors ([heatmap](/en/docs/adaptive-engine/heatmap)) |

With [progressive unlock](/en/docs/practice/progressive-unlock), keys still locked appear dimmed.

## Keyboard settings

| Setting | What it does | Default |
|---|---|---|
| Teclado visual (on-screen keyboard, <kbd>F2</kbd>) | Shows the on-screen keyboard | On |
| Destellos (flashes) | Pressed keys light up green or red | On |
| Mapa de calor (heatmap) | Tints each key by your errors and slowness | Off |

## Alternative colors and reduced motion

- With “Modo daltónico” (color-blind mode) on, flashes use blue and orange (`#0072B2` and `#E69F00`, from the Okabe–Ito palette), the same in every theme, and a wrong key's label is underlined in bold.
- If the system asks for reduced motion, the pressed key is underlined in the flash color instead of flashing.

## Accents and dead keys

Dead keys work as in any program: what you type goes through a hidden text field, so the system's input method composes `´` + `a` into a single `á`.
