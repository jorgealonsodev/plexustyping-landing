---
title: "Texto pendiente atenuado"
description: "«Atenuar texto pendiente» baja el contraste del texto por escribir para que destaque lo escrito. Cuándo se aplica y cómo desactivarlo."
section: personalizacion
order: 5
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: [personalizacion, accesibilidad]
---

«Atenuar texto pendiente», en «Ajustes → Texto», baja el contraste del texto que aún tienes que escribir, en prosa y en código, para que lo ya escrito destaque. Está activado por defecto. El texto pendiente queda en torno a 2,5:1 sobre su fondo, por debajo del nivel AA; si lo desactivas, recupera los colores que cumplen AA.

## Cómo funciona

| Estado | Texto pendiente | Texto escrito |
|---|---|---|
| Activado (por defecto) | Contraste de unos 2,5:1 | Color completo |
| Desactivado | Colores del tema, que cumplen WCAG AA | Color completo |

La pista del ajuste lo resume: «Baja el contraste del texto por escribir por debajo del nivel AA para que destaque lo escrito; desactívalo para recuperarlo.».

## Excepción: alto contraste

Los temas «Alto contraste oscuro» y «Alto contraste claro» nunca atenúan el texto pendiente, aunque el ajuste esté activado. Consulta [Alto contraste](/docs/accesibilidad/alto-contraste).

## Cuándo desactivarlo

Desactívalo si te cuesta leer el texto que viene a continuación. El atenuado es una excepción a WCAG AA que tú controlas: con el ajuste desactivado, todos los temas incluidos cumplen AA.

## Relacionado

- [Temas e importación de VS Code](/docs/personalizacion/temas-y-vscode)
- [Cursor](/docs/personalizacion/cursor)
