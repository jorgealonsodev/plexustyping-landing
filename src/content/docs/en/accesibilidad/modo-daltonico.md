---
title: "Color-blind mode"
description: "Color-blind mode swaps the keyboard's green and red flashes for Okabe–Ito blue and orange and underlines the wrong key in bold."
section: accesibilidad
order: 3
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: [accesibilidad, distribuciones-e-idiomas]
lang: en
---

“Modo daltónico” (color-blind mode), in Settings → Accessibility, changes the on-screen keyboard's flashes: instead of green for a hit and red for an error, it uses the blue `#0072B2` and the orange `#E69F00` of the Okabe–Ito palette, the same in every theme. In addition, a wrong key's label is underlined in bold. It is off by default.

## What changes

| Element | Normal mode | Color-blind mode |
|---|---|---|
| Hit flash | Green | Blue `#0072B2` |
| Error flash | Red | Orange `#E69F00` |
| Wrong key | Color only | Color and label underlined in bold |

The setting's hint sums it up: “Destellos en azul y naranja en lugar de verde y rojo; una tecla errónea se subraya.” (flashes in blue and orange instead of green and red; a wrong key is underlined).

## Other cues that do not depend on color

- The [heatmap](/en/docs/adaptive-engine/heatmap) marks each key with its level, from 1 to 5, as well as the tint.
- With [reduced motion](/en/docs/accessibility/reduced-motion), the pressed key is underlined in the flash color instead of flashing.

## Related

- [On-screen keyboard and flashes](/en/docs/keyboard-and-languages/on-screen-keyboard-and-flashes)
- [High contrast](/en/docs/accessibility/high-contrast)
