---
title: "Informar de un error"
description: "Cómo informar de un error de PlexusTyping en GitHub: qué datos incluir (versión, sistema, paquete, pasos) y qué no compartir nunca."
section: ayuda
order: 3
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: [motor-adaptativo, ia]
---

Los errores de PlexusTyping se informan abriendo una *issue* en el repositorio de GitHub `jorgealonsodev/plexustyping`. Antes, revisa [Solución de problemas](/docs/ayuda/solucion-de-problemas). En el informe incluye la versión, tu sistema, el paquete que instalaste, los pasos para reproducir el fallo y el mensaje exacto. Nunca compartas tus claves de API.

## Pasos

1. Comprueba que el problema no está en [Solución de problemas](/docs/ayuda/solucion-de-problemas).
2. Abre [las issues del repositorio](https://github.com/jorgealonsodev/plexustyping/issues) y busca si ya alguien lo ha informado.
3. Si no, crea una *issue* nueva con los datos de abajo.

## Qué incluir

| Dato | Dónde encontrarlo |
|---|---|
| Versión | En el nombre del archivo descargado, por ejemplo `plexustyping_0.1.0_amd64.deb` |
| Sistema | Distribución de Linux y su versión, o Windows 10 u 11 |
| Paquete | `.deb`, `.tar.gz` o instalador `.exe` |
| Pasos | Qué hiciste, qué esperabas y qué pasó |
| Mensaje | El texto exacto del aviso, por ejemplo «Metrónomo: No hay dispositivo de audio» |
| Ajustes implicados | Modo (Prosa, Palabras o Código), distribución, idioma, modo de error |

Si el fallo es de la IA, indica el proveedor y el modelo. En Linux, al ejecutar `plexustyping` desde un terminal, los intentos fallidos de la IA se escriben en la salida de errores, sin la clave: puedes copiar esas líneas.

## Qué no compartir

- Tus claves de API.
- El archivo `chatgpt-auth.json`, que contiene tu sesión de ChatGPT.
- Tu base de datos `plexustyping.sqlite3` salvo que quieras compartir tu historial.

## Relacionado

- [Código fuente y contribuir](/docs/proyecto/codigo-fuente-y-contribuir)
- [Dónde se guardan los datos](/docs/ajustes/donde-se-guardan-los-datos)
