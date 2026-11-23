---
title: "Atajos de teclado"
description: "Todos los atajos de teclado de PlexusTyping: globales, del texto de práctica, de la ventana de ajustes, del historial y del panel del metrónomo."
section: referencia
order: 1
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: [accesibilidad, metronomo, modo-codigo]
---

Estos son todos los atajos de teclado de PlexusTyping 0.1.0. Los globales funcionan desde la pantalla de práctica: `Ctrl+,` abre los ajustes, `Ctrl+H` el historial, `F5` carga un texto nuevo, `F4` enciende el metrónomo, `F2` muestra el teclado visual y `F6` lleva a la cabecera. Los atajos solo cuentan sin otros modificadores añadidos.

## Globales

| Atajo | Qué hace |
|---|---|
| `Ctrl+,` | Abre o cierra «Ajustes» |
| `Ctrl+H` | Abre o cierra el «Historial» |
| `F5` | Descarta el texto actual y carga uno nuevo |
| `F4` | Enciende o apaga el metrónomo |
| `F2` | Muestra u oculta el teclado visual; funciona también dentro de las ventanas |
| `F6` | Desde el campo de práctica, lleva el foco al primer control de la cabecera |

Con «Ajustes» o «Historial» abiertos, las teclas se quedan en la ventana: solo `F2` llega a la aplicación.

## En el texto de práctica

| Tecla | Cuándo | Qué hace |
|---|---|---|
| `Esc` | Mientras escribes o en los resultados | Reinicia el texto |
| `Enter` | En los resultados | «Siguiente texto» (si el foco no está en un botón como «Repetir») |
| `Retroceso` | Mientras escribes | Borra el último carácter, según el [modo de error](/docs/practicar/modos-de-error) |
| `Enter` | Modo código | Salto de línea, medido como pulsación |
| `Tab` | Modo código | Sangría: escribe un tabulador o salta los espacios hasta la siguiente tabulación; medido como pulsación |
| `Tab` / `Mayús+Tab` | Prosa y palabras | Mueve el foco entre controles |

`Esc` solo reinicia desde el campo de práctica, nunca desde otro control. `Ctrl+Retroceso` no borra.

## Ventana «Ajustes»

| Tecla | Qué hace |
|---|---|
| `Ctrl+F` | Vuelve al buscador |
| `Enter` en el buscador | Va al primer ajuste que coincide |
| `Esc` | En el buscador con texto, borra la búsqueda; si no, cierra la ventana |
| `↑` / `↓` | Sección anterior o siguiente en la lista de secciones |
| `Inicio` / `Fin` | Primera o última sección |
| `Ctrl+,` | Cierra la ventana |

## Ventana «Historial»

| Tecla | Qué hace |
|---|---|
| `Esc` o `Ctrl+H` | Cierra la ventana |

## Panel rápido del metrónomo

| Tecla | Qué hace |
|---|---|
| `Tab` / `Mayús+Tab` | Recorre los controles del panel, en bucle |
| `Enter` en el campo del tempo | Aplica el tempo escrito |
| `Esc` | Cierra el panel y devuelve el foco al punto del pulso |

## Próxima versión (0.1.1)

Con la longitud «Ilimitado», `Esc` termina la sesión y puntúa lo escrito en lugar de reiniciar. Consulta [Longitud y texto ilimitado](/docs/practicar/longitud-y-texto-ilimitado).

## Relacionado

- [Navegación con el teclado](/docs/accesibilidad/teclado)
- [Buscador de ajustes](/docs/ajustes/buscador)
- [Panel rápido](/docs/metronomo/panel-rapido)
