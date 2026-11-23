---
title: "Qué se envía a la IA y qué no · PlexusTyping"
description: "Qué datos envía PlexusTyping a un proveedor de IA (idioma, longitud y tema) y cuáles nunca salen de tu equipo: lo que escribes y tus claves."
h1: "Qué se envía a la IA y qué no"
sidebarLabel: "Qué se envía y qué no"
section: ia
order: 5
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: ["ia"]
---

Cuando la IA está activada, PlexusTyping envía al proveedor solo lo necesario para pedir un texto: el idioma, la longitud y el tema. En modo código añade los caracteres objetivo y los caracteres permitidos. Lo que escribes nunca sale de tu equipo, y las peticiones salen del núcleo de la app en Rust, no de la interfaz.

## Qué se envía

| Modo | Datos de la petición |
|---|---|
| Prosa | Idioma, rango de longitud y tema |
| Prosa con [desbloqueo progresivo](/docs/practicar/desbloqueo-progresivo) | Lo anterior y los caracteres permitidos |
| Código | Lenguaje, objetivos con cuántas veces deben aparecer y caracteres permitidos |

El tema es el que escribiste en Ajustes → IA o, si lo dejaste libre, uno sorteado por la app.

## Qué no se envía nunca

- Lo que escribes ni tus pulsaciones.
- Tus estadísticas, tu historial ni tus perfiles.
- Las claves de un proveedor a otro: cada clave va solo a su proveedor.

## Cómo se protegen las claves y las peticiones

- Las claves viven en el llavero del sistema, nunca en texto plano ni en la base de datos: [proveedores y claves](/docs/ia/proveedores-y-claves).
- Las peticiones salen del núcleo en Rust directamente a los servidores del proveedor; la interfaz no tiene acceso a la red.
- Los tokens de ChatGPT se guardan en un archivo privado de tu equipo: [iniciar sesión con ChatGPT](/docs/ia/iniciar-sesion-con-chatgpt).

## Sin IA

Si no activas la IA no se hace ninguna petición: los textos salen del corpus local y la app funciona sin conexión. Más en [activar la IA](/docs/ia/activar-la-ia).
