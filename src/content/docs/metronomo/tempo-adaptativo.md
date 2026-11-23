---
title: "Tempo adaptativo del metrónomo · PlexusTyping"
description: "Cómo sube o baja PlexusTyping el tempo del metrónomo tras cada texto según tu precisión y tu desvío de ritmo, en pasos del 5 %."
h1: "Tempo adaptativo"
section: metronomo
order: 3
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: ["metronomo", "motor-adaptativo"]
---

Con el tempo adaptativo, el metrónomo reajusta su tempo después de cada texto: lo sube un paso si has escrito con precisión y a ritmo, lo baja si fallas o pierdes el pulso, y lo mantiene en los demás casos. Está desactivado por defecto y se activa en Ajustes → Metrónomo → «Tempo adaptativo» o en el panel rápido.

## Activarlo

1. [Enciende el metrónomo](/docs/metronomo/uso-basico) con <kbd>F4</kbd>.
2. Activa «Tempo adaptativo» en Ajustes → Metrónomo o en el [panel rápido](/docs/metronomo/panel-rapido).
3. Escribe un texto completo sin cambiar el tempo a mano.

## La regla

Solo cuenta un texto terminado y escrito entero con un mismo tempo.

| Resultado del texto | Cambio de tempo |
|---|---|
| Precisión de al menos 97 % y desvío medio de como mucho el 15 % del intervalo entre pulsos | Sube un paso |
| Precisión por debajo del 90 % o desvío medio de más del 20 % del intervalo | Baja un paso |
| Cualquier otro caso | Se mantiene |

Un paso es el 5 % del tempo, con un mínimo de 2 BPM, siempre dentro de 30–300 BPM. El desvío medio es el «Ritmo: desvío medio ±X ms» de los resultados.

## Qué ves

Los resultados muestran el cambio, por ejemplo «Tempo: 60 → 63 BPM», o «Tempo: se mantiene en 60 BPM». El nuevo tempo se guarda en el ajuste «Tempo» y se usa en el siguiente texto.

Si cambias el tempo a mano, ese valor pasa a ser el nuevo punto de partida. El tempo es un ajuste compartido por todos los [perfiles](/docs/progreso/perfiles).
