---
title: "Distribuciones de teclado · PlexusTyping"
description: "Las ocho distribuciones de teclado de PlexusTyping: español de España y Latinoamérica, US, ABNT2, AZERTY, QWERTZ, Dvorak y Colemak."
h1: "Distribuciones de teclado"
sidebarLabel: "Distribuciones"
section: teclado-e-idiomas
order: 1
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: ["distribuciones-e-idiomas"]
---

PlexusTyping incluye ocho distribuciones de teclado, que se eligen en Ajustes → Teclado → «Distribución». La distribución decide cómo se dibuja el teclado visual y qué caracteres pueden aparecer en los textos. Debe coincidir con la configurada en tu sistema operativo, porque las pulsaciones llegan del teclado del sistema.

## Las ocho distribuciones

| Distribución | Forma | Teclas muertas | Notas |
|---|---|---|---|
| Español (España) (predeterminada) | ISO | <code>´ ¨ ^ &#96;</code> | |
| Español (Latinoamérica) | ISO | <code>´ ¨ ^ &#96;</code> | `@` en AltGr+Q, `\` en AltGr+`'`, `~` en AltGr+`+` |
| English (US) | ANSI | Ninguna | Sin capa AltGr |
| Português (Brasil) | ABNT2 | <code>´ &#96; ^ ~ ¨</code> | Tecla `ç`; tecla extra `/ ?` junto al Shift derecho |
| Français (France) | ISO | `^ ¨` | Números con Shift; sin `æ œ` ni mayúsculas acentuadas |
| Deutsch (Deutschland) | ISO | <code>^ ´ &#96;</code> | Teclas `ß ä ö ü` |
| English (Dvorak) | ANSI | Ninguna | Dvorak de EE. UU.; mismos caracteres que US |
| English (Colemak) | ANSI | Ninguna | Colemak de EE. UU.; mismos caracteres que US |

## Cambiar de distribución

1. Configura la misma distribución en tu sistema operativo.
2. En PlexusTyping, abre «Ajustes» con <kbd>Ctrl</kbd>+<kbd>,</kbd> y ve a «Teclado» → «Distribución».
3. Elige la tuya. Se carga un texto nuevo al momento.

## Qué cambia con la distribución

- **El teclado visual:** etiquetas, resaltado de la tecla siguiente y mapa de calor ([teclado visual y destellos](/docs/teclado-e-idiomas/teclado-visual-y-destellos)).
- **Los caracteres de los textos:** solo aparecen los que la distribución puede escribir. Con English (US), un texto en español no lleva `ñ` ni tildes.
- **El texto de diagnóstico:** un perfil nuevo empieza con el del idioma elegido si la distribución puede escribirlo.
- **El historial:** cada sesión guarda su distribución (columna `layout` del CSV).

## Límites

- La app aún no avisa si su distribución no coincide con la del sistema: si son distintas, las teclas no corresponderán al dibujo.
- Las estadísticas de teclas débiles son un único modelo por perfil, compartido por todos los idiomas.
- El [desbloqueo progresivo](/docs/practicar/desbloqueo-progresivo) guarda su progreso por distribución.

Los idiomas de los textos se eligen aparte: [idiomas del texto](/docs/teclado-e-idiomas/idiomas-del-texto).
