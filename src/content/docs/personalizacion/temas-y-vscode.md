---
title: "Temas e importación de VS Code"
description: "PlexusTyping trae 59 temas claros y oscuros y puede importar hasta 30 temas de VS Code (.json o .jsonc). Cómo elegirlos y qué colores se leen."
section: personalizacion
order: 1
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: [personalizacion, accesibilidad]
---

PlexusTyping incluye 59 temas de color: los 57 de PlexusTerm más «Alto contraste oscuro» y «Alto contraste claro». Se eligen en «Ajustes → Apariencia → Tema» y se aplican al momento. También puedes importar hasta 30 temas de VS Code desde un archivo `.json` o `.jsonc`, que aparecen en el mismo selector, bajo «Importados».

## Elegir un tema

El selector «Tema» agrupa los temas en «Oscuros», «Claros» e «Importados». El tema por defecto es Catppuccin Mocha. El tema se guarda por [perfil](/docs/progreso/perfiles).

Todos los temas incluidos cumplen WCAG AA. Los dos de alto contraste llegan a 7:1 en el texto: consulta [Alto contraste](/docs/accesibilidad/alto-contraste).

## Importar un tema de VS Code

1. Abre «Ajustes → Apariencia».
2. Pulsa «Importar tema de VS Code…» y elige el archivo del tema.
3. El tema se aplica al momento y queda en «Importados».

| Límite | Valor |
|---|---|
| Formato | `.json` o `.jsonc`, con comentarios y comas finales |
| Tamaño máximo | 1 MB |
| Temas importados | Hasta 30 |
| Mismo nombre | Sustituye al tema importado antes |

«Eliminar tema importado» borra el tema importado seleccionado y vuelve al tema por defecto. Los temas importados son comunes a todos los perfiles.

## Qué colores se leen

| Clave del archivo | Uso en PlexusTyping |
|---|---|
| `editor.background`, `editor.foreground` | Fondo y texto (obligatorias) |
| `editorCursor.foreground` | Cursor |
| `editor.selectionBackground` | Selección |
| `terminal.ansiBlack` … `terminal.ansiBrightWhite` | Los 16 colores ANSI que colorean el teclado, los estados y el resaltado de código |

- Cada color ANSI que falte se toma del esquema base: PlexusTerm para temas oscuros y el primer esquema claro para los claros.
- El tema es oscuro o claro según su campo `type` y, si no lo tiene, según el fondo.
- No se leen `tokenColors` ni `include`, y se descarta la transparencia de los colores.

## Relacionado

- [Fuentes](/docs/personalizacion/fuentes)
- [Texto pendiente atenuado](/docs/personalizacion/texto-pendiente-atenuado)
- [Licencias y créditos](/docs/proyecto/licencias-y-creditos): autores de los temas incluidos.
