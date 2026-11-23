---
title: "Proveedores de IA y claves de API · PlexusTyping"
description: "Qué proveedores de IA admite PlexusTyping y cómo guarda tus claves de API: solo en el llavero del sistema, nunca en texto plano ni en la base de datos."
h1: "Proveedores de IA y claves de API"
sidebarLabel: "Proveedores y claves"
section: ia
order: 2
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: ["ia"]
---

PlexusTyping admite cinco proveedores de IA: Claude (Anthropic), OpenAI, Google Gemini, OpenCode Go y ChatGPT (tu suscripción). Los cuatro primeros necesitan tu propia clave de API; ChatGPT usa tu plan con el inicio de sesión oficial de OpenAI. Las claves se guardan solo en el llavero del sistema operativo, nunca en texto plano.

## Proveedores

| Proveedor | Cómo se autentica |
|---|---|
| Claude (Anthropic) | Clave de API |
| OpenAI | Clave de API |
| Google Gemini | Clave de API |
| OpenCode Go | Clave de API |
| ChatGPT (tu suscripción) | Inicio de sesión en el navegador, sin clave ([iniciar sesión con ChatGPT](/docs/ia/iniciar-sesion-con-chatgpt)) |

Cada proveedor de la cadena tiene su modelo: elígelo de la lista del proveedor o escríbelo a mano con «Otro…». Con los modelos de razonamiento de OpenCode Go, la app pide el menor esfuerzo de razonamiento para que los textos cortos lleguen rápido.

## Guardar y borrar una clave

1. En Ajustes → IA, escribe la clave en el campo «Clave de API» del proveedor.
2. Pulsa «Guardar clave». El estado pasa a «Guardada».
3. Para eliminarla, pulsa «Borrar clave». El estado vuelve a «Sin clave».

## Dónde se guardan

| Sistema | Llavero |
|---|---|
| Linux | Secret Service |
| Windows | Administrador de credenciales |

Las claves se guardan con el servicio `com.plexustyping.app` y la cuenta `ai:<proveedor>`. Nunca se escriben en la base de datos ni en los registros, y nunca se devuelven a la interfaz.

Si el sistema no tiene un llavero que funcione, verás «Llavero no disponible» y no se podrá guardar ninguna clave. La app sigue funcionando con el corpus local.

## Lo que paga cada proveedor

Las llamadas con clave de API se cobran en tu cuenta del proveedor. La tabla «Uso de la IA» cuenta llamadas y tokens por proveedor para que puedas vigilar el gasto: [cadena de respaldo, caché y uso](/docs/ia/respaldo-cache-y-uso). Qué datos recibe cada proveedor está en [qué se envía y qué no](/docs/ia/que-se-envia).
