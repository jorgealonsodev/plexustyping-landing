---
title: "Buscador de ajustes"
description: "Encuentra cualquier ajuste escribiendo su nombre: el buscador de «Ajustes» filtra por todas las palabras, sin distinguir mayúsculas ni acentos."
section: ajustes
order: 2
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: [personalizacion, accesibilidad]
---

El buscador de la parte superior de «Ajustes» muestra solo los ajustes cuyo nombre, descripción u opciones contienen todas las palabras que escribes, sin distinguir mayúsculas, minúsculas ni acentos. Los resultados se agrupan por sección, con el número de coincidencias. Recibe el foco al abrir la ventana y `Ctrl+F` vuelve a él desde cualquier punto.

## Cómo buscar

1. Abre los ajustes con `Ctrl+,`. El foco ya está en el buscador.
2. Escribe una o varias palabras, por ejemplo `cursor` o `lector pantalla`.
3. Pulsa `Enter` para ir al primer ajuste que coincide.

## Reglas de coincidencia

| Regla | Ejemplo |
|---|---|
| Deben aparecer todas las palabras | `tempo adaptativo` solo muestra «Tempo adaptativo» |
| Sin distinguir mayúsculas | `IA` y `ia` dan lo mismo |
| Sin distinguir acentos | `metronomo` encuentra «Metrónomo» |
| Busca en nombre, descripción y opciones | `madera` encuentra el ajuste «Sonido» del metrónomo |
| Búsqueda vacía | Se muestran todos los ajustes |

## Teclas

| Tecla | Qué hace |
|---|---|
| `Ctrl+F` | Vuelve al buscador y selecciona lo escrito |
| `Enter` | Lleva el foco al primer ajuste que coincide |
| `Esc` | Borra la búsqueda; un segundo `Esc` cierra la ventana |

## Relacionado

- [Mapa de la ventana de ajustes](/docs/ajustes/mapa-de-ajustes)
- [Atajos de teclado](/docs/referencia/atajos-de-teclado)
