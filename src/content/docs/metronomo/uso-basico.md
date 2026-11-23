---
title: "Metrónomo: uso básico · PlexusTyping"
description: "Cómo encender el metrónomo de PlexusTyping con F4, elegir tempo de 30 a 300 BPM, sonido, volumen y acento, y leer el desvío de ritmo de cada tecla."
h1: "Metrónomo: uso básico"
sidebarLabel: "Uso básico"
section: metronomo
order: 1
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: ["metronomo"]
---

El metrónomo de PlexusTyping marca un ritmo constante para que escribas cada tecla con el pulso: un clic equivale a una pulsación esperada. Se enciende y se apaga con <kbd>F4</kbd> desde cualquier sitio o en Ajustes → Metrónomo. Tiene tempo de 30 a 300 BPM, tres sonidos, volumen y acento, y los cambios se aplican al momento.

## Encender y configurar

1. Pulsa <kbd>F4</kbd>, o abre «Ajustes» con <kbd>Ctrl</kbd>+<kbd>,</kbd> y activa «Metrónomo».
2. Ajusta las opciones:

| Ajuste | Valores | Predeterminado |
|---|---|---|
| Tempo | 30 a 300 BPM | 60 BPM |
| Sonido | «Clic», «Madera» o «Bip» | «Clic» |
| Volumen | 0 a 100 % | 80 % |
| Acento | Uno de cada N pulsos, de 0 (sin acento) a 16 | Cada 4 |
| Tempo adaptativo | Encendido o apagado | Apagado |

Para cambiarlo sin salir del texto, usa el [panel rápido](/docs/metronomo/panel-rapido).

## Cuándo suena

- Solo mientras hay un texto listo o lo estás escribiendo.
- Se detiene en la pantalla de resultados y cuando la ventana está oculta.
- Suena desde el núcleo de la app por el dispositivo de salida de audio predeterminado.

Junto a las estadísticas en vivo, un punto se ilumina en cada pulso (los acentuados, en otro color). Con el movimiento reducido del sistema, el punto se sigue iluminando, sin transición.

## El desvío de ritmo

Cada carácter que escribes registra cuántos milisegundos cayó antes («adelantada», valor negativo) o después («atrasada», valor positivo) del clic más cercano. En los resultados verás:

- «Ritmo: desvío medio ±X ms»: la media del desvío en valor absoluto.
- La proporción de teclas adelantadas y atrasadas.

Los desvíos se guardan por pulsación, y la sesión guarda los BPM cuando un único tempo cubrió todo el texto (columna BPM del [historial](/docs/progreso/historial-y-graficas)). Cambiar el tempo reinicia el pulso.

## Latencia del audio

El pulso 0 se cuenta cuando arranca el audio, sin incluir la latencia de salida del dispositivo (unos pocos milisegundos). El clic se oye ese tiempo después, así que las teclas a tiempo con él se leen unos milisegundos atrasadas.

## Siguiente paso

Deja que el tempo suba solo con el [tempo adaptativo](/docs/metronomo/tempo-adaptativo).
