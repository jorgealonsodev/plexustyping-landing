---
title: "Cadena de respaldo, caché y uso de la IA · PlexusTyping"
description: "Qué hace PlexusTyping cuando un proveedor de IA falla: cadena de hasta cinco proveedores, límites de tiempo, caché, corpus local y tabla de uso."
h1: "Cadena de respaldo, caché y uso de la IA"
sidebarLabel: "Respaldo, caché y uso"
section: ia
order: 4
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: ["ia"]
---

La cadena de respaldo es la lista ordenada de proveedores de IA que PlexusTyping prueba para cada texto, hasta cinco. Si uno falla o tarda demasiado, pasa al siguiente; si fallan todos, el texto sale del caché o del corpus local, con un aviso. Así un fallo de la IA nunca te deja sin texto ni repite uno ya mostrado.

## Montar la cadena

En Ajustes → IA → «Cadena de respaldo»:

1. Añade proveedores con «Añadir proveedor» (cada proveedor puede estar una sola vez).
2. Ordénalos con las flechas «Subir» y «Bajar»; se prueban de arriba abajo.
3. Quita uno con «Quitar».
4. Comprueba cada uno con «Probar conexión».

Cómo configurar cada proveedor está en [proveedores y claves](/docs/ia/proveedores-y-claves).

## Qué pasa con cada petición

| Situación | Qué hace la app |
|---|---|
| Petición lenta | Cada proveedor tiene 30 segundos; la cadena entera, 60 |
| Texto que no pasa la validación | Un reintento con el mismo proveedor y después el siguiente |
| Fallan todos o no hay clave | Texto de IA del caché que nunca se haya mostrado, o un texto nuevo del corpus local |
| Error del plan de ChatGPT | Se detiene la cadena, sin usar tus claves ([iniciar sesión con ChatGPT](/docs/ia/iniciar-sesion-con-chatgpt)) |

Un texto válido debe ajustarse a la longitud, usar solo caracteres que tu distribución puede escribir y no contener Markdown. Cuando un texto se rechaza, su reintento pide cualquier texto en el idioma, sin objetivos. Cada intento fallido se anota en la salida de errores de la app, nunca con la clave.

## Avisos y origen del texto

Si el texto no viene de la IA, una nota breve encima explica por qué. El origen se muestra siempre:

- «Generado con IA · Claude · …» (proveedor y modelo)
- «Texto del caché»
- «Corpus local»

## La tabla de uso

La tabla «Uso de la IA» cuenta, por proveedor, las llamadas y los tokens de hoy y del total («Llamadas», «Tokens hoy», «Tokens totales»). «Actualizar» refresca los datos. Sirve para vigilar lo que gastas con tus claves. Se guarda en la base de datos local, como el caché de textos generados.

## Sin esperas

El siguiente texto se pide en segundo plano en cuanto empiezas a escribir el actual, así que suele estar listo cuando terminas. Más en [cómo elige los textos](/docs/motor-adaptativo/como-elige-los-textos).
