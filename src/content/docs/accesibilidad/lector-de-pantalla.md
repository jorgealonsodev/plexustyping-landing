---
title: "Practicar con lector de pantalla"
description: "«Anunciar con lector de pantalla» lee el siguiente carácter, cada error, cada texto nuevo y el resultado mediante una región aria-live."
h1: "Lector de pantalla"
section: accesibilidad
order: 2
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: [accesibilidad]
---

Con «Anunciar con lector de pantalla», en «Ajustes → Accesibilidad», PlexusTyping anuncia por tu lector de pantalla el siguiente carácter después de cada pulsación, cada tecla fallada, el inicio de cada texto nuevo y la línea de resultado. Usa una región `aria-live` educada, que no interrumpe. Está desactivado por defecto y, mientras lo está, no anuncia nada.

## Qué se anuncia

| Momento | Ejemplo |
|---|---|
| Después de cada pulsación | «siguiente: a» |
| Tecla fallada | «error: esperaba e, pulsaste r» |
| Texto nuevo | «Texto nuevo de 300 caracteres. siguiente: l» |
| Resultado | «Resultado: 42 PPM netas, precisión 96,5 %, tiempo 1:05, 3 errores.» |

Tras un error, el siguiente carácter se anuncia también si el cursor avanzó.

## Nombres de los caracteres

Los caracteres que un lector de pantalla se saltaría o leería de forma ambigua se dicen por su nombre:

| Carácter | Se anuncia como |
|---|---|
| Espacio | «espacio» |
| Salto de línea | «salto de línea» |
| Tabulador | «tabulador» |
| `,` `.` `;` `:` | «coma», «punto», «punto y coma», «dos puntos» |
| `¿` `?` `¡` `!` | «abre interrogación», «cierra interrogación», «abre exclamación», «cierra exclamación» |
| `(` `)` `[` `]` `{` `}` | «abre paréntesis», «cierra paréntesis», «abre corchete», «cierra corchete», «abre llave», «cierra llave» |
| `«` `»` | «abre comillas angulares», «cierra comillas angulares» |

Una mayúscula se anuncia con la letra seguida de «mayúscula», por ejemplo «e mayúscula».

## Consejos de uso

- El campo de práctica está descrito por la región del texto, así que el lector lo identifica al recibir el foco.
- Para salir del texto con el teclado, pulsa `F6`. Consulta [Navegación con el teclado](/docs/accesibilidad/teclado).

## Relacionado

- [Modo daltónico](/docs/accesibilidad/modo-daltonico)
- [Atajos de teclado](/docs/referencia/atajos-de-teclado)
