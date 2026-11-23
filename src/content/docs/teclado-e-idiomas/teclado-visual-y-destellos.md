---
title: "Teclado visual y destellos · PlexusTyping"
description: "Cómo funciona el teclado en pantalla de PlexusTyping: tecla siguiente resaltada, color por dedo, destellos verde y rojo, y cómo mostrarlo con F2."
h1: "Teclado visual y destellos"
section: teclado-e-idiomas
order: 3
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: ["distribuciones-e-idiomas", "accesibilidad"]
---

El teclado visual es un teclado dibujado debajo del texto, con las etiquetas de tu distribución, que resalta la tecla siguiente y te dice con qué dedo pulsarla. Al escribir, cada tecla destella en verde si acertaste y en rojo si fallaste. <kbd>F2</kbd> lo muestra u oculta, y está visible por defecto.

## Mostrar u ocultar

- Pulsa <kbd>F2</kbd>.
- O pulsa la tecla del logo en la cabecera: la barra bajo su P se ilumina en verde mientras el teclado está visible.
- O usa Ajustes → Teclado → «Teclado visual».

## Qué muestra

| Elemento | Detalle |
|---|---|
| Forma | ISO, ANSI (distribuciones de EE. UU.) o ABNT2 (Portugués de Brasil), según la [distribución](/docs/teclado-e-idiomas/distribuciones) |
| Etiquetas | Capas normal, Shift y AltGr; las teclas muertas, subrayadas |
| Tecla siguiente | Resaltada, junto con Shift o AltGr si hace falta |
| Color por dedo | Cada tecla, en el color del dedo que la pulsa |
| Destellos | Verde al acertar, rojo al fallar |
| Mapa de calor | Opcional: niveles del 1 al 5 según tus errores ([mapa de calor](/docs/motor-adaptativo/mapa-de-calor)) |

Con el [desbloqueo progresivo](/docs/practicar/desbloqueo-progresivo), las teclas aún bloqueadas aparecen atenuadas.

## Ajustes de Teclado

| Ajuste | Qué hace | Predeterminado |
|---|---|---|
| Teclado visual (<kbd>F2</kbd>) | Muestra el teclado en pantalla | Activado |
| Destellos | Las teclas pulsadas se iluminan en verde o rojo | Activado |
| Mapa de calor | Tiñe cada tecla según tus errores y lentitud | Desactivado |

## Colores alternativos y movimiento reducido

- Con el «Modo daltónico» activado, los destellos usan azul y naranja (`#0072B2` y `#E69F00`, de la paleta Okabe–Ito), iguales en todos los temas, y la etiqueta de una tecla errónea se subraya en negrita.
- Si el sistema pide movimiento reducido, la tecla pulsada se subraya con el color del destello en lugar de destellar.

## Tildes y teclas muertas

Las teclas muertas funcionan como en cualquier programa: lo que escribes pasa por un campo de texto oculto, así que el método de entrada del sistema compone `´` + `a` en una sola `á`.
