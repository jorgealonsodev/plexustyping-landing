---
title: "Settings window map"
description: "The nine sections of “Ajustes” (Practice, Text, Keyboard, Metronome, Code, Appearance, Accessibility, AI and Profiles) and what is in each."
section: ajustes
order: 1
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: [personalizacion, progreso, ia]
lang: en
---

The “Ajustes” (settings) window opens with `Ctrl+,` or with the gear button in the header. It has nine sections, in this order: Practice, Text, Keyboard, Metronome, Code, Appearance, Accessibility, AI and Profiles. Every change is saved at once and remembered after a restart. To find a setting by name, use the search box at the top.

The app's interface is in Spanish. In the app, the sections are called “Práctica”, “Texto”, “Teclado”, “Metrónomo”, “Código”, “Apariencia”, “Accesibilidad”, “IA” and “Perfiles”; this documentation names them in English and gives each setting's Spanish label.

## Practice (“Práctica”)

| Setting | Options | Default |
|---|---|---|
| Idioma (language) | Español, English, Português (Brasil), Français, Deutsch | Español |
| Modo de error (error mode) | Permitir seguir, Parar hasta corregir, Borrar con Retroceso | Permitir seguir |
| Objetivos (targets) | 2 or 3 weak units per text | 2 |
| Longitud (length) | 100, 200, 300, 450 or 600 characters | 300 |
| Estadísticas en vivo (live statistics) | On or off | On |
| Sesión fantasma (ghost session) | On or off | On |
| Desbloqueo progresivo (progressive unlock) | On or off, per profile | Off |
| Velocidad objetivo (target speed) | 20, 30, 40 or 50 WPM | 30 WPM |

More in [error modes](/en/docs/practice/error-modes), [ghost session](/en/docs/practice/ghost-session) and [progressive unlock](/en/docs/practice/progressive-unlock). The 800 to 2000 character lengths and the “Ilimitado” (unlimited) option arrive in the next version (0.1.1): see [length and unlimited text](/en/docs/practice/length-and-unlimited-text).

## Text (“Texto”)

“Fuente” (font), “Tamaño de letra” (font size), “Espaciado entre letras” (letter spacing), “Interlineado” (line height), “Cursor”, “Cursor parpadeante” (blinking cursor) and “Atenuar texto pendiente” (dim pending text). See [fonts](/en/docs/personalization/fonts), [typography](/en/docs/personalization/typography), [cursor](/en/docs/personalization/cursor) and [dimmed pending text](/en/docs/personalization/dimmed-pending-text).

## Keyboard (“Teclado”)

| Setting | Default |
|---|---|
| Distribución (layout; 8 layouts) | Español (España) |
| Teclado visual (on-screen keyboard, `F2`) | On |
| Destellos (flashes) | On |
| Mapa de calor (heatmap) | Off |

See [layouts](/en/docs/keyboard-and-languages/layouts) and [on-screen keyboard and flashes](/en/docs/keyboard-and-languages/on-screen-keyboard-and-flashes).

## Metronome (“Metrónomo”)

| Setting | Range or options | Default |
|---|---|---|
| Metrónomo (`F4`) | On or off | Off |
| Tempo | 30–300 BPM | 60 BPM |
| Tempo adaptativo (adaptive tempo) | On or off | Off |
| Sonido (sound) | Clic, Madera, Bip (click, wood, beep) | Clic |
| Volumen (volume) | 0–100 % | 80 % |
| Acento (accent) | Every 0–16 beats (0 = no accent) | Every 4 |

See [metronome basics](/en/docs/metronome/basics).

## Code (“Código”)

“Lenguaje” (language) picks one of code mode's 15 languages; in code mode it is also chosen in the header.

| Setting | Options | Default |
|---|---|---|
| Sangría (indentation) | Automática al pulsar Enter (automatic on Enter), Manual | Automatic on Enter |
| Líneas máximas (maximum lines) | 5–20 | 12 |

## Appearance (“Apariencia”)

“Tema” (theme), with the 59 bundled themes and the imported ones, and “Importar tema de VS Code…” (import VS Code theme). See [themes and VS Code import](/en/docs/personalization/themes-and-vs-code).

## Accessibility (“Accesibilidad”)

“Anunciar con lector de pantalla” (announce with screen reader) and “Modo daltónico” (color-blind mode), both off by default. See [screen reader](/en/docs/accessibility/screen-reader) and [color-blind mode](/en/docs/accessibility/color-blind-mode).

## AI (“IA”)

“Usar IA para generar textos” (use AI to generate texts), the “Cadena de respaldo” (fallback chain) of up to five providers with their model and key, “Densidad” (density), the text's “Tema” (topic) and the “Uso de la IA” (AI usage) table. See [turn on the AI](/en/docs/ai/turn-on-ai) and [providers and keys](/en/docs/ai/providers-and-keys).

## Profiles (“Perfiles”)

The list of profiles (“Usar”, “Nuevo perfil”, “Renombrar”, “Borrar”: use, new profile, rename, delete) and the active profile's “Meta diaria” (daily goal). See [profiles](/en/docs/progress/profiles) and [daily goal and streak](/en/docs/practice/daily-goal-and-streak).

## Related

- [Settings search](/en/docs/settings/settings-search)
- [Where data is stored](/en/docs/settings/where-data-is-stored)
