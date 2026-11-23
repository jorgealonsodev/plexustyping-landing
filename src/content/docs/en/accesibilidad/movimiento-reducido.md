---
title: "Reduced motion"
description: "PlexusTyping respects the system's reduced motion preference: no transitions or animations, and flashes replaced by underlines."
section: accesibilidad
order: 5
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: [accesibilidad, metronomo]
lang: en
---

PlexusTyping respects the operating system's reduced motion preference (`prefers-reduced-motion: reduce`). When it is active, no transition or animation runs in the application: pressed keys are underlined instead of flashing, the cursor does not blink and the metronome dot lights up on every beat without a transition. There is no setting of its own in the app.

## What changes

| Element | Normal | With reduced motion |
|---|---|---|
| Transitions and animations | Active | None, anywhere in the app |
| Pressed key on the on-screen keyboard | Green or red flash | Underline in the flash color |
| [Blinking cursor](/en/docs/personalization/cursor) | Blinks if you turn it on | Never blinks |
| Metronome dot | Lights up on every beat | Lights up on every beat, without a transition |

## How to turn it on

The preference is turned on in your operating system's accessibility settings, not in PlexusTyping.

## Related

- [On-screen keyboard and flashes](/en/docs/keyboard-and-languages/on-screen-keyboard-and-flashes)
- [Metronome basics](/en/docs/metronome/basics)
- [Color-blind mode](/en/docs/accessibility/color-blind-mode)
