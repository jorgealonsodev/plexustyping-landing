---
title: "Longitud del texto y texto ilimitado · PlexusTyping"
description: "Longitudes de texto de PlexusTyping 0.1.0, de 100 a 600 caracteres, y lo que trae la versión 0.1.1: hasta 2000 caracteres y el modo «Ilimitado»."
h1: "Longitud del texto y texto ilimitado"
sidebarLabel: "Longitud y texto ilimitado"
section: practicar
order: 2
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: ["texto-ilimitado"]
---

La longitud de cada texto de prosa y de palabras se elige en Ajustes → Práctica → «Longitud». En la versión 0.1.0 puedes elegir 100, 200, 300, 450 o 600 caracteres; la predeterminada es 300 y el cambio se aplica desde el siguiente texto. Las longitudes mayores y el texto «Ilimitado» llegan en la versión 0.1.1.

## Longitudes disponibles en 0.1.0

| Opción | Caracteres |
|---|---|
| Opciones | 100, 200, 300, 450 o 600 |
| Predeterminada | 300 |
| Cuándo se aplica | Desde el siguiente texto |

El modo código no usa «Longitud»: sus fragmentos se miden en líneas («Líneas máximas», de 5 a 20, en Ajustes → Código). Consulta los [modos de práctica](/docs/practicar/modos).

### Cuánto se ajusta cada texto a la longitud

- Con la IA activada, el texto de prosa se pide entre el 80 % y el 125 % de la longitud elegida: con 300, entre 240 y 375 caracteres.
- Los textos del corpus local tienen su propio margen: la longitud elegida más una quinta parte.

## Próxima versión (0.1.1)

Lo que sigue aún no está en la versión publicada; llegará con la 0.1.1.

- **Más longitudes:** 800, 1000, 1500 y 2000 caracteres.
- **«Ilimitado»:** el texto crece mientras escribes. Al acercarte al final, la app pide en segundo plano una continuación (a la IA o al corpus local) y la añade sin interrumpirte. Solo se envía el final del texto ya generado, nunca lo que escribes.
- **Terminar un texto ilimitado:** <kbd>Esc</kbd> o el botón «Terminar» puntúan lo escrito hasta ese momento como una sesión normal.

Las novedades de cada versión se publican en las [notas de versión](/docs/proyecto/notas-de-version).

## Relacionado

- [Objetivos y puntos débiles](/docs/practicar/objetivos-y-puntos-debiles)
- [Qué se envía a la IA y qué no](/docs/ia/que-se-envia)
