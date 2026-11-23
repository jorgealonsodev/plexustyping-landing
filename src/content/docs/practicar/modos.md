---
title: "Modos de práctica: prosa, palabras y código · PlexusTyping"
description: "Qué practica cada modo de PlexusTyping: «Prosa» con frases, «Palabras» sueltas en minúscula y «Código» en 15 lenguajes, y cómo cambiar de modo."
h1: "Modos de práctica: prosa, palabras y código"
sidebarLabel: "Modos"
section: practicar
order: 1
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: ["modo-codigo", "motor-adaptativo"]
---

PlexusTyping tiene tres modos de práctica, que se eligen con el selector «Prosa / Palabras / Código» de la cabecera, junto al engranaje. «Prosa» da frases, «Palabras» da palabras sueltas en minúscula y «Código» da fragmentos de programas. Cambiar de modo carga un texto nuevo al momento.

A la izquierda del selector de modo, la cabecera tiene desde la versión 0.2.0 un selector de longitud: en prosa y palabras elige los caracteres del texto o «Ilimitado» ([longitud y texto ilimitado](/docs/practicar/longitud-y-texto-ilimitado)); en código, las líneas máximas.

## Comparación

| Modo | Qué escribes | De dónde sale el texto | Estadísticas |
|---|---|---|---|
| Prosa | Frases con mayúsculas y puntuación | IA si está activada; si no, caché o corpus local | Las de prosa |
| Palabras | Palabras reales en minúscula, separadas por un espacio, sin puntuación | Siempre el corpus local, nunca la IA | Las de prosa (mismo idioma y distribución) |
| Código | Fragmentos de 5 a 20 líneas con resaltado de sintaxis | IA si está activada; si no, caché o fragmentos incluidos | Propias, separadas de la prosa |

## Prosa

Es el modo predeterminado. Con objetivos, el corpus local construye frases en las que al menos la mitad de las palabras contienen tus unidades débiles. El idioma se elige en Ajustes → Práctica → «Idioma» ([idiomas del texto](/docs/teclado-e-idiomas/idiomas-del-texto)).

## Palabras

Practica palabras sueltas del idioma elegido, todas en minúscula. Al menos la mitad contienen tus unidades débiles (los mismos objetivos que la prosa) y solo usan caracteres que tu distribución puede escribir. Estas sesiones alimentan las estadísticas de prosa, así que los resultados, los puntos débiles y el mapa de calor son los de prosa. En el historial aparecen como «Palabras».

## Código

Al elegir «Código», un selector junto al de modo elige el lenguaje: Python, JavaScript, TypeScript, Java, C#, C++, C, Go, Rust, PHP, SQL, Bash, HTML/CSS, Kotlin o Swift.

- <kbd>Enter</kbd> escribe el salto de línea y <kbd>Tab</kbd> escribe un tabulador o salta los espacios hasta la siguiente tabulación; las dos son pulsaciones medidas.
- «Sangría» (Ajustes → Código): «Automática» rellena la sangría de la línea siguiente tras un salto de línea correcto; «Manual» te hace escribir cada espacio.
- «Líneas máximas» (Ajustes → Código) fija el tamaño de los fragmentos, de 5 a 20 líneas (12 por defecto). En modo código, el selector de longitud de la cabecera ofrece 5, 8, 12, 16 o 20 líneas.

Las sesiones de código tienen su propio modelo de debilidades, compartido por todos los lenguajes, así que los símbolos no afectan a tus métricas de prosa. Más en [cómo mide tus debilidades](/docs/motor-adaptativo/como-mide-tus-debilidades).

## Relacionado

- [Longitud y texto ilimitado](/docs/practicar/longitud-y-texto-ilimitado)
- [Objetivos y puntos débiles](/docs/practicar/objetivos-y-puntos-debiles)
