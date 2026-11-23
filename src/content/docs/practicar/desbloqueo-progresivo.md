---
title: "Desbloqueo progresivo para principiantes · PlexusTyping"
description: "Cómo funciona el desbloqueo progresivo de PlexusTyping: empieza por la fila central y añade una tecla cada vez que dominas las activas."
h1: "Desbloqueo progresivo"
section: practicar
order: 6
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: ["progreso", "motor-adaptativo"]
---

El desbloqueo progresivo es un modo para principiantes, desactivado por defecto: empiezas solo con la fila central del teclado y la app añade una tecla cada vez que dominas las activas. Se activa en Ajustes → Práctica → «Desbloqueo progresivo». Afecta solo a los textos de prosa; los modos palabras y código lo ignoran.

## Activarlo

1. Abre «Ajustes» con <kbd>Ctrl</kbd>+<kbd>,</kbd> y ve a «Práctica».
2. Activa «Desbloqueo progresivo».
3. Elige la «Velocidad objetivo»: 20, 30 (predeterminada), 40 o 50 PPM.

El progreso se guarda por perfil, idioma y distribución, y se conserva aunque desactives y vuelvas a activar el modo.

## Por dónde empieza

Las teclas iniciales son las letras que tu distribución pone en las teclas de la A a la L y la que sigue a la L. En español: a s d f g h j k l ñ. El espacio siempre está activo, y también la mayúscula de cada letra activa.

## Cuándo se desbloquea una tecla

Una tecla está dominada cuando cumple las tres condiciones, según tus estadísticas de prosa:

| Condición | Valor |
|---|---|
| Muestras | Al menos 30 |
| Tasa de error (media móvil) | 5 % o menos |
| Tiempo mediano por pulsación | Dentro de la velocidad objetivo: 12 000 / PPM ms (400 ms a 30 PPM) |

Después de cada sesión de prosa guardada en este modo se añade una tecla si todas las activas están dominadas, o tras 3 sesiones seguidas sin dominar ninguna nueva.

## En qué orden

Primero la fila central (en español: f j d k s l a ñ) y después el resto de letras por su frecuencia en el idioma (en español: e o n r i t u c m p…). Los números y la puntuación se desbloquean todos juntos cuando todas las letras están activas.

## Qué textos verás

- **Con menos de 15 letras** no hay frases con sentido: los textos son palabras en minúscula hechas solo con letras activas, sin IA. Primero palabras reales del corpus del idioma y, para completar, pseudopalabras pronunciables. La tecla nueva y tus teclas débiles salen más a menudo.
- **Desde 15 letras**, los textos vienen de la generación habitual (la IA si está activada, el corpus si no), limitados a los caracteres activos.

## Dónde ves el progreso

- El [teclado visual](/docs/teclado-e-idiomas/teclado-visual-y-destellos) atenúa las teclas aún bloqueadas.
- Encima del texto: «Teclas: 9/27 · siguiente: e».
- En los resultados de la sesión que añade una tecla: «Nueva tecla desbloqueada: e».

En modo temporal, el progreso dura hasta que cierras la app. Para medir cuánto practicas cada día, usa la [meta diaria](/docs/practicar/meta-diaria-y-racha).
