---
title: "Cómo elige los textos · PlexusTyping"
description: "Cómo elige PlexusTyping los objetivos de cada texto y cómo construye el texto: corpus local, palabras sueltas, fragmentos de código o IA."
h1: "Cómo elige los textos el motor adaptativo"
sidebarLabel: "Cómo elige los textos"
section: motor-adaptativo
order: 2
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: ["motor-adaptativo", "ia", "modo-codigo"]
---

Para cada texto nuevo, PlexusTyping elige 2 o 3 objetivos entre tus unidades peor puntuadas, con algo de azar para no repetir siempre las mismas, y construye un texto que los contiene a menudo. Sin IA, el texto sale del corpus local del idioma; con la IA activada, se pide al proveedor y se valida antes de mostrarlo.

## 1. Elegir los objetivos

1. Se ordenan las unidades con al menos 3 muestras por su puntuación ([cómo mide tus debilidades](/docs/motor-adaptativo/como-mide-tus-debilidades)).
2. Se toman como candidatas las del doble del número de objetivos: las 4 peores con 2 objetivos, las 6 peores con 3.
3. Se sortean los objetivos entre ellas, con más probabilidad cuanto peor es la puntuación. Cada candidata tiene una pequeña probabilidad extra, así que también puede salir una con puntuación 0.

Si hay pocas candidatas, se usan todas. Los objetivos se muestran encima del texto: «Practicando: ñ · qu · z».

## 2. Construir el texto

| Modo | Cómo se construye |
|---|---|
| Prosa (corpus local) | Frases de 4 a 10 palabras que empiezan en mayúscula; al menos la mitad de las palabras contienen un objetivo. Sin objetivos, se unen frases del corpus |
| Palabras | Palabras reales en minúscula; al menos la mitad contienen un objetivo |
| Código (fragmentos incluidos) | Se elige el fragmento según lo a menudo que usa tus símbolos débiles |
| Prosa con IA | Se pide un texto en tu idioma, con la longitud y el tema; no se piden los objetivos |
| Código con IA | Se piden los objetivos y cuántas veces debe aparecer cada uno, según la «Densidad» (2× a 5×) |

En todos los casos el texto solo usa caracteres que tu [distribución](/docs/teclado-e-idiomas/distribuciones) puede escribir: con English (US), un texto en español no lleva ñ ni tildes. Con el [desbloqueo progresivo](/docs/practicar/desbloqueo-progresivo), solo los caracteres activos.

## 3. De dónde sale el texto

| Etiqueta encima del texto | Origen |
|---|---|
| «Texto de diagnóstico» | El texto fijo del idioma, hasta guardar la primera sesión |
| «Generado con IA · …» | El proveedor y el modelo que lo generaron |
| «Texto del caché» | Un texto de IA generado antes y guardado en tu equipo |
| «Corpus local» | El generador sin conexión de la app |

Con el botón «IA» de la cabecera apagado, no se hace ninguna petición: los textos nuevos son textos de IA guardados del mismo idioma y modo, rotando para no repetirse, o el corpus local si no hay ninguno. Más en [activar la IA](/docs/ia/activar-la-ia) y [cadena de respaldo, caché y uso](/docs/ia/respaldo-cache-y-uso).

## Sin esperas

El siguiente texto se prepara en segundo plano en cuanto empiezas a escribir el actual, así que suele estar listo al terminar.
