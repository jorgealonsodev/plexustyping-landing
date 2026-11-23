---
title: "Movimiento reducido"
description: "PlexusTyping respeta la preferencia de movimiento reducido del sistema: sin transiciones ni animaciones, y destellos sustituidos por subrayados."
section: accesibilidad
order: 5
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: [accesibilidad, metronomo]
---

PlexusTyping respeta la preferencia de movimiento reducido del sistema operativo (`prefers-reduced-motion: reduce`). Cuando está activa, ninguna transición ni animación se ejecuta en la aplicación: las teclas pulsadas se subrayan en lugar de destellar, el cursor no parpadea y el punto del metrónomo se enciende en cada pulso sin transición. No hay un ajuste propio en la app.

## Qué cambia

| Elemento | Normal | Con movimiento reducido |
|---|---|---|
| Transiciones y animaciones | Activas | Ninguna, en toda la app |
| Tecla pulsada en el teclado visual | Destello verde o rojo | Subrayado en el color del destello |
| [Cursor parpadeante](/docs/personalizacion/cursor) | Parpadea mientras esperas (activado por defecto) | No parpadea nunca |
| Punto del metrónomo | Se enciende en cada pulso | Se enciende en cada pulso, sin transición |

## Cómo activarlo

La preferencia se activa en la configuración de accesibilidad de tu sistema operativo, no en PlexusTyping.

## Relacionado

- [Teclado visual y destellos](/docs/teclado-e-idiomas/teclado-visual-y-destellos)
- [Uso básico del metrónomo](/docs/metronomo/uso-basico)
- [Modo daltónico](/docs/accesibilidad/modo-daltonico)
