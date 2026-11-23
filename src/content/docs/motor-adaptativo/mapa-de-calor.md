---
title: "Mapa de calor del teclado · PlexusTyping"
description: "Qué muestra el mapa de calor de PlexusTyping: cada tecla teñida según tus errores y tu lentitud, con un nivel del 1 al 5 que no depende del color."
h1: "Mapa de calor del teclado"
sidebarLabel: "Mapa de calor"
section: motor-adaptativo
order: 3
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: ["motor-adaptativo", "accesibilidad"]
---

El mapa de calor tiñe cada tecla del teclado visual según tu puntuación de errores y lentitud, y la marca con un nivel del 1 al 5 para que no dependa solo del color. Está desactivado por defecto y se activa en Ajustes → Teclado → «Mapa de calor». Una leyenda bajo el teclado explica los cinco niveles.

## Activarlo

1. Muestra el teclado visual con <kbd>F2</kbd> si está oculto.
2. Abre «Ajustes» con <kbd>Ctrl</kbd>+<kbd>,</kbd> y ve a «Teclado».
3. Activa «Mapa de calor».

## Cómo se lee

La leyenda dice: «Errores por tecla: 1 muy pocos, 2 pocos, 3 algunos, 4 bastantes, 5 muchos».

| Nivel | Significado |
|---|---|
| Sin nivel | Sin tinte: puntuación 0 o tecla sin datos |
| 1 | Muy pocos |
| 2 | Pocos |
| 3 | Algunos |
| 4 | Bastantes |
| 5 | Muchos |

El tinte tiene diez intensidades y cada nivel visible agrupa dos.

## De dónde sale cada tecla

- La puntuación es la de los caracteres sueltos del modelo de debilidades: [cómo mide tus debilidades](/docs/motor-adaptativo/como-mide-tus-debilidades).
- Si una tecla produce varios caracteres (en cualquier capa: normal, Shift o AltGr), muestra el peor.
- Un carácter compuesto como «á» o «ü» cuenta para la tecla de su letra base.
- En modo código, el mapa usa el modelo de código; en prosa y palabras, el de prosa.

Cada [perfil](/docs/progreso/perfiles) tiene su propio mapa. Más sobre el teclado en [teclado visual y destellos](/docs/teclado-e-idiomas/teclado-visual-y-destellos).
