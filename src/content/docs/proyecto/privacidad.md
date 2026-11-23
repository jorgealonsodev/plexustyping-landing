---
title: "Privacidad en PlexusTyping"
description: "Resumen de la privacidad de PlexusTyping: datos solo en tu equipo, sin cuenta ni telemetría, claves en el llavero y lo que se envía a la IA."
h1: "Privacidad"
section: proyecto
order: 1
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: [ia, progreso]
---

PlexusTyping guarda todo en tu equipo, sin cuenta ni telemetría, y lo que escribes nunca sale de él. La única conexión a internet es la de los textos con IA, que es opcional: entonces solo se envían el idioma, la longitud y el tema del texto. Esta página lo resume; la política completa está en [Privacidad](/privacidad).

## En resumen

| Tema | Qué hace PlexusTyping |
|---|---|
| Cuenta | No hay. Los perfiles son locales. |
| Telemetría | No hay. |
| Lo que escribes | Nunca sale de tu equipo. |
| Datos de práctica | En una base SQLite local. |
| Claves de IA | En el llavero del sistema, nunca en texto plano ni en la base de datos. |
| Peticiones de red | Solo para la IA, y salen solo del núcleo en Rust; la interfaz no tiene acceso a la red. |

## Qué se envía a la IA

Solo si activas la IA:

- **Prosa:** idioma, longitud y tema; con el desbloqueo progresivo, también los caracteres permitidos.
- **Código:** además, los objetivos y los caracteres permitidos.

Con «ChatGPT (tu suscripción)», los tokens de la sesión se guardan en un archivo privado de tu equipo, `chatgpt-auth.json`, nunca en la base de datos, los registros ni la interfaz. Detalle en [Qué se envía y qué no](/docs/ia/que-se-envia).

## Relacionado

- [Política de privacidad completa](/privacidad)
- [Dónde se guardan los datos](/docs/ajustes/donde-se-guardan-los-datos)
- [Proveedores y claves](/docs/ia/proveedores-y-claves)
