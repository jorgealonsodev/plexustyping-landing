---
title: "Activar la IA para generar textos · PlexusTyping"
description: "Cómo activar la IA opcional de PlexusTyping: añadir un proveedor, elegir el modelo, guardar la clave y probar la conexión. Sin IA, la app funciona igual."
h1: "Activar la IA para generar textos"
sidebarLabel: "Activar la IA"
section: ia
order: 1
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: ["ia"]
---

La IA de PlexusTyping es opcional: sirve para que los textos de práctica sean más variados, pero la app funciona igual sin ella y sin conexión, con su corpus local. Para activarla, ve a Ajustes → IA, enciende «Usar IA para generar textos» y añade al menos un proveedor con su modelo y su clave de API.

## Pasos

1. Abre «Ajustes» con <kbd>Ctrl</kbd>+<kbd>,</kbd> y ve a la sección «IA».
2. Activa «Usar IA para generar textos».
3. Pulsa «Añadir proveedor» y elige uno: Claude, OpenAI, Google Gemini, OpenCode Go o ChatGPT (tu suscripción).
4. Elige el modelo de la lista del proveedor o escríbelo a mano con «Otro…».
5. Pega tu clave de API y pulsa «Guardar clave». Con ChatGPT no hay clave: pulsa «Iniciar sesión con ChatGPT» ([iniciar sesión con ChatGPT](/docs/ia/iniciar-sesion-con-chatgpt)).
6. Pulsa «Probar conexión». Si todo va bien verás «Conexión correcta».

A partir del siguiente texto, encima de cada texto generado verás «Generado con IA ·» seguido del proveedor y el modelo.

## Opciones de la sección IA

| Opción | Qué hace |
|---|---|
| Tema | Un tema opcional para los textos, por ejemplo «viajes» (hasta 60 caracteres). Si lo dejas libre, se sortea un tema para que los textos no se repitan |
| Densidad | Cuántas veces más de lo normal aparecen tus objetivos en modo código: de 2× a 5× (3× por defecto) |
| Cadena de respaldo | Hasta cinco proveedores, probados en orden ([cadena de respaldo, caché y uso](/docs/ia/respaldo-cache-y-uso)) |

## El botón «IA» de la cabecera

Es el mismo ajuste que «Usar IA para generar textos». Encendido, los textos nuevos se generan con la IA. Apagado, no se hace ninguna petición: se usan textos de IA ya guardados del mismo idioma y modo, rotando para no repetirse, o el corpus local si no hay ninguno.

## Antes de activarla

- Las claves se guardan en el llavero del sistema: [proveedores y claves](/docs/ia/proveedores-y-claves).
- Nunca se envía lo que escribes: [qué se envía y qué no](/docs/ia/que-se-envia).
- El modo «Palabras» nunca usa la IA, aunque esté activada.
