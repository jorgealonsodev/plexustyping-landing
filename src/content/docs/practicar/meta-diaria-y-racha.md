---
title: "Meta diaria y racha · PlexusTyping"
description: "Cómo fijar en PlexusTyping una meta diaria de minutos o de textos por perfil, cómo se cuenta el progreso de hoy y cómo funciona la racha de días."
h1: "Meta diaria y racha"
section: practicar
order: 7
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: ["progreso"]
---

Cada perfil puede tener su propia meta diaria, en minutos o en textos al día. Con una meta activa, la cabecera muestra el progreso de hoy junto al nombre del perfil, por ejemplo «Hoy 12/20 min · racha 3». La racha cuenta los días seguidos en que cumpliste la meta. Se configura en Ajustes → Perfiles → «Meta diaria».

## Fijar la meta

1. Abre «Ajustes» con <kbd>Ctrl</kbd>+<kbd>,</kbd> y ve a «Perfiles».
2. En «Meta diaria», elige una opción:

| Opción | Valores |
|---|---|
| Desactivada | Predeterminada |
| Minutos al día | 5, 10, 15, 20, 30, 45, 60, 90 o 120 |
| Textos al día | 1, 3, 5, 10, 15, 20 o 30 |

La meta es del perfil activo; los demás perfiles conservan la suya. Más sobre perfiles en [perfiles](/docs/progreso/perfiles).

## Cómo se cuenta

Cuentan las sesiones guardadas del perfil activo (prosa, palabras y código) que empezaron hoy, en tu hora local.

- **Minutos:** la suma de sus duraciones. Se muestra redondeada hacia abajo, y la meta se cumple cuando la suma exacta la alcanza.
- **Textos:** el número de sesiones.

## Qué ves

| Momento | Texto |
|---|---|
| Durante el día | «Hoy 12/20 min · racha 3» o «Hoy 2/5 textos» |
| Meta cumplida | «Meta cumplida · racha 4» |
| Resultados de la sesión que la cumple | «¡Meta diaria cumplida!» |

## La racha

- Cuenta los días consecutivos en que se cumplió la meta actual.
- Termina hoy si hoy ya la cumpliste, y ayer si todavía no.
- Un día sin sesiones la rompe.
- Si cambias la meta, la nueva se aplica también a los días pasados.

En modo temporal, la meta y el progreso duran hasta que cierras la app. Tu práctica por día también aparece en la vista «Por día» del [historial](/docs/progreso/historial-y-graficas).
