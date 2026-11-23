---
title: "Modos de error · PlexusTyping"
description: "Qué pasa al fallar una tecla en PlexusTyping según el modo de error: «Permitir seguir», «Parar hasta corregir» o «Borrar con Retroceso»."
h1: "Modos de error"
section: practicar
order: 3
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: ["motor-adaptativo"]
---

El modo de error decide qué pasa cuando pulsas una tecla equivocada. Hay tres: «Permitir seguir» (el predeterminado), «Parar hasta corregir» y «Borrar con Retroceso». Se elige en Ajustes → Práctica → «Modo de error», y cambiarlo reinicia el texto actual. En los tres, cada pulsación errónea cuenta para tus estadísticas.

## Los tres modos

| Modo | Al fallar una tecla | Retroceso |
|---|---|---|
| Permitir seguir | El carácter queda marcado como error y avanzas al siguiente | No hace nada |
| Parar hasta corregir | Te quedas en el mismo carácter hasta pulsar la tecla correcta | No hace nada |
| Borrar con Retroceso | El carácter queda marcado como error y avanzas | Vuelve a abrir la posición anterior para escribirla de nuevo |

## Cuál elegir

- **Permitir seguir:** mantiene el ritmo. Útil para medir tu velocidad real y para practicar con el [metrónomo](/docs/metronomo/uso-basico).
- **Parar hasta corregir:** obliga a acertar cada carácter antes de seguir. Cada intento fallido en la misma posición también se registra.
- **Borrar con Retroceso:** se parece a escribir en un editor: corriges con <kbd>Retroceso</kbd>.

En modo código con sangría automática, Retroceso nunca se detiene dentro de una sangría rellenada por la app: vuelve al salto de línea anterior.

## Cómo cuentan los errores

Todos los errores, también los que corriges, alimentan el modelo de debilidades. Consulta [cómo mide tus debilidades](/docs/motor-adaptativo/como-mide-tus-debilidades). La [sesión fantasma](/docs/practicar/sesion-fantasma) funciona en los tres modos.
