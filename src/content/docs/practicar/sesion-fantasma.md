---
title: "Sesión fantasma · PlexusTyping"
description: "Cómo funciona la sesión fantasma de PlexusTyping: un segundo cursor repite tu mejor sesión con el mismo texto y muestra la diferencia en segundos."
h1: "Sesión fantasma: compite contra tu récord"
sidebarLabel: "Sesión fantasma"
section: practicar
order: 5
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: ["progreso", "motor-adaptativo"]
---

Cuando vuelves a escribir un texto que ya escribiste, un segundo cursor translúcido avanza al ritmo de tu mejor sesión anterior con ese mismo texto. Junto a las estadísticas en vivo ves cuánto vas por detrás o por delante, en segundos. Está activada por defecto y se apaga con el botón del fantasma de la cabecera.

## Cuándo aparece

El fantasma corre cuando hay un récord para exactamente ese texto:

- al pulsar «Repetir» en los resultados;
- con el texto de diagnóstico;
- con cualquier texto que vuelva a salir.

El récord es tu mejor sesión con ese texto en el mismo perfil y el mismo modo (y, en código, el mismo lenguaje): la de más PPM netas; si hay empate, la más antigua.

## Cómo se lee

1. El fantasma espera al principio hasta tu primera tecla.
2. Mientras escribes, la diferencia muestra «+1,2 s» si vas por detrás o «−0,8 s» si vas por delante, medida en la última posición que alcanzaste.
3. Si llega al final antes que tú, se queda ahí.
4. En los resultados verás «Récord anterior: 52 PPM» y, si lo superas, «¡Nuevo récord para este texto!».

Un récord conseguido en este intento es el fantasma del siguiente.

## Activar o desactivar

- Botón del fantasma en la cabecera (encendido mientras está activo).
- Ajustes → Práctica → «Sesión fantasma».

## Detalles

- Funciona en los tres [modos de error](/docs/practicar/modos-de-error), porque se reconstruye a partir de las pulsaciones guardadas.
- En modo temporal (sin base de datos) usa las sesiones de esa ejecución.
- El tiempo dedicado a borrar con Retroceso no se guarda por tecla: se reparte entre las teclas escritas después de cada borrado.

Tus sesiones guardadas se consultan en el historial; más en [historial y gráficas](/docs/progreso/historial-y-graficas).
