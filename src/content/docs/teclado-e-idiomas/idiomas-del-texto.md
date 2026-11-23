---
title: "Idiomas del texto · PlexusTyping"
description: "En qué idiomas practica PlexusTyping: español, inglés, portugués de Brasil, francés y alemán, cada uno con su corpus local sin conexión."
h1: "Idiomas del texto"
section: teclado-e-idiomas
order: 2
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: ["distribuciones-e-idiomas"]
---

PlexusTyping genera textos de práctica en cinco idiomas: español (el predeterminado), inglés, portugués de Brasil, francés y alemán. El idioma se elige en Ajustes → Práctica → «Idioma» y cambiarlo carga un texto nuevo. Cada idioma tiene su propio corpus local, así que practicar sin conexión funciona en todos ellos.

## Los cinco idiomas

| Opción en la app | Idioma |
|---|---|
| Español | Español (predeterminado) |
| English | Inglés |
| Português (Brasil) | Portugués de Brasil |
| Français | Francés |
| Deutsch | Alemán |

El idioma elegido aquí es el de los textos de práctica; el de los menús y avisos es aparte (más abajo).

## Qué incluye cada corpus

- Las 5.000 palabras más frecuentes del idioma.
- Frases cotidianas, entre ellas hasta 2.000 frases de Mozilla Common Voice (CC0), filtradas a texto simple que se puede escribir con la distribución del idioma.
- Un párrafo de diagnóstico, el primer texto de un perfil nuevo ([primer arranque](/docs/empezar/primer-arranque)).

Con la IA activada, también se le piden los textos en ese idioma ([activar la IA](/docs/ia/activar-la-ia)).

## Idioma y distribución

El idioma y la [distribución de teclado](/docs/teclado-e-idiomas/distribuciones) se eligen por separado. Los textos solo usan caracteres que la distribución puede escribir: por ejemplo, con English (US) un texto en español no lleva `ñ` ni tildes.

## Qué guarda cada sesión

Cada sesión guardada registra su idioma: lo verás en el historial y en la columna `idioma` del [CSV exportado](/docs/progreso/exportar-csv). El modo código no depende del idioma.

## Idioma de la interfaz

Desde la versión 0.2.0, la interfaz de la app (menús, ajustes, avisos, anuncios para lector de pantalla y mensajes de error) está en los mismos cinco idiomas: Español, English, Português (Brasil), Français y Deutsch.

- **Al empezar** sigue el idioma del ordenador: el primero de sus idiomas preferidos que la app tenga. Si no tiene ninguno, usa el inglés.
- **Para cambiarlo**, elige otro en «Ajustes → Apariencia → Idioma de la interfaz»; el cambio se aplica al momento. «Automático (idioma del sistema: …)» vuelve a seguir al ordenador.
- **Es independiente** del idioma del texto: cambiar uno no cambia el otro. Puedes practicar textos en alemán con la interfaz en español, por ejemplo.
- **Es el mismo para todos los perfiles**, a diferencia del idioma del texto.
- Los números, porcentajes y fechas siguen el formato del idioma de la interfaz.

## Por perfil

Cada [perfil](/docs/progreso/perfiles) tiene su propio idioma. Las estadísticas de teclas débiles, en cambio, son un único modelo por perfil para todos los idiomas.
