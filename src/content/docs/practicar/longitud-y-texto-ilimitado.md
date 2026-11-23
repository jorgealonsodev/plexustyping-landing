---
title: "Longitud del texto y texto ilimitado · PlexusTyping"
description: "Longitudes de texto de PlexusTyping, de 100 a 2000 caracteres, el selector de la cabecera y el modo «Ilimitado», que crece mientras escribes."
h1: "Longitud del texto y texto ilimitado"
sidebarLabel: "Longitud y texto ilimitado"
section: practicar
order: 2
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: ["texto-ilimitado"]
---

La longitud de cada texto de prosa y de palabras se elige en el selector de la cabecera, junto a Prosa / Palabras / Código, o en Ajustes → Práctica → «Longitud». Puedes elegir 100, 200, 300, 450, 600, 800, 1000, 1500 o 2000 caracteres, o «Ilimitado», un texto que crece mientras escribes; la predeterminada es 300.

## Longitudes disponibles

| Opción | Caracteres |
|---|---|
| Opciones | 100, 200, 300, 450, 600, 800, 1000, 1500 o 2000, o «Ilimitado» |
| Predeterminada | 300 |
| Dónde se elige | En la cabecera, junto a Prosa / Palabras / Código, o en Ajustes → Práctica → «Longitud» |

Las longitudes de 800 a 2000 caracteres, «Ilimitado» y el selector de la cabecera llegaron con la versión 0.2.0.

El modo código no usa «Longitud»: sus fragmentos se miden en líneas. En modo código, el mismo selector de la cabecera elige las «Líneas máximas» (5, 8, 12, 16 o 20), que también se ajustan de 5 a 20 en Ajustes → Código. Consulta los [modos de práctica](/docs/practicar/modos).

### Cuánto se ajusta cada texto a la longitud

- Con la IA activada, el texto de prosa se pide entre el 80 % y el 125 % de la longitud elegida: con 300, entre 240 y 375 caracteres.
- Los textos del corpus local tienen su propio margen: la longitud elegida más una quinta parte.

## Texto «Ilimitado»

Con «Ilimitado» (en prosa y palabras) el texto crece mientras escribes:

- **Empieza** con un texto de 600 caracteres de la fuente de siempre (IA, caché o corpus).
- **Crece:** cuando el cursor llega a la mitad del texto, o quedan 400 caracteres o menos por delante, la app pide en segundo plano una continuación de unos 600 caracteres y la añade tras un espacio sin interrumpirte.
- **De dónde sale la continuación:** en prosa la escribe la IA a partir de los últimos 400 caracteres, en el mismo idioma. Sin IA, o si la IA tarda o falla, sigue un texto del corpus local con una nota que explica el motivo. En el modo palabras siempre siguen más palabras del corpus.
- **Si llegas al final** antes que la continuación, el texto espera con «Generando más texto…» y sigue en cuanto llega. Si no se puede continuar, la app avisa con «No se pudo continuar el texto: …; reintentando…» y lo vuelve a pedir.
- **Terminar:** <kbd>Esc</kbd> o el botón «Terminar», bajo el texto, puntúan lo escrito como una sesión normal, con resultados, historial, estadísticas, meta diaria y desbloqueo progresivo. Si terminas sin escribir nada, se descarta y se carga otro texto.
- **«Repetir»** después de un texto ilimitado repite solo la parte que escribiste, como un texto normal.

Las continuaciones no se guardan en el caché y solo se envía el texto ya generado, nunca lo que escribes. Los textos ilimitados no corren contra la sesión fantasma y el tempo adaptativo del metrónomo no cambia después de ellos. El primer texto de diagnóstico nunca es ilimitado.

Las novedades de cada versión se publican en las [notas de versión](/docs/proyecto/notas-de-version).

## Relacionado

- [Objetivos y puntos débiles](/docs/practicar/objetivos-y-puntos-debiles)
- [Qué se envía a la IA y qué no](/docs/ia/que-se-envia)
