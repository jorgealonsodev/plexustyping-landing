---
title: "Cómo mide tus debilidades · PlexusTyping"
description: "Cómo calcula PlexusTyping tus puntos débiles: errores y lentitud por carácter y por par de letras, con medias móviles exponenciales."
h1: "Cómo mide tus debilidades el motor adaptativo"
sidebarLabel: "Cómo mide tus debilidades"
section: motor-adaptativo
order: 1
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: ["motor-adaptativo"]
---

Después de cada sesión completada, PlexusTyping repasa todas tus pulsaciones y actualiza una puntuación de 0 a 1 para cada carácter y cada par de letras seguidas. La puntuación combina tus errores (70 %) y tu lentitud respecto a tu propio ritmo (30 %), con medias móviles exponenciales que dan más peso a lo reciente.

## Qué se mide

El motor trabaja con **unidades**:

- **Caracteres:** cada carácter del texto, incluidos el espacio y, en código, el salto de línea y el tabulador.
- **Bigramas:** dos caracteres esperados seguidos, como «qu» o «rr», siempre que ninguno sea un espacio en blanco.

Cada pulsación actualiza el carácter esperado y el bigrama que termina en él. También cuentan las pulsaciones repetidas en una misma posición (por ejemplo, con «Parar hasta corregir»).

## La puntuación de una unidad

| Componente | Peso | Cómo se calcula |
|---|---|---|
| Error | 0,7 | Media móvil de 1 (fallo) y 0 (acierto) |
| Lentitud | 0,3 | Media móvil de cuánto más tardas que tu intervalo medio entre teclas, de 0 a 1 |

- Las medias móviles exponenciales (EMA) usan un factor de suavizado de 0,2: cada pulsación nueva pesa un 20 % y el historial anterior, un 80 %.
- Tu intervalo medio entre teclas también es una media móvil, así que la lentitud se mide contra tu ritmo, no contra una velocidad fija.
- Los intervalos de más de 2 segundos cuentan como pausas y no se usan para la lentitud.
- Una unidad solo compite por ser objetivo cuando tiene al menos 3 muestras.

## Modelos separados

| Modelo | Lo alimentan |
|---|---|
| Prosa | Sesiones de prosa y de palabras |
| Código | Sesiones de código de todos los lenguajes |

Cada [perfil](/docs/progreso/perfiles) tiene sus propios modelos, compartidos por todos sus idiomas. Así, los símbolos del código no afectan a tus métricas de prosa.

## Dónde se usa

- Para elegir los objetivos de cada texto: [cómo elige los textos](/docs/motor-adaptativo/como-elige-los-textos).
- Para teñir el teclado: [mapa de calor](/docs/motor-adaptativo/mapa-de-calor).
- En los resultados, como «Tus puntos débiles»: [objetivos y puntos débiles](/docs/practicar/objetivos-y-puntos-debiles).
