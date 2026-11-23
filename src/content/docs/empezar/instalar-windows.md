---
title: "Instalar en Windows · PlexusTyping"
description: "Cómo instalar PlexusTyping en Windows 10 y 11 de 64 bits sin permisos de administrador, y qué hacer con el aviso de SmartScreen del instalador sin firmar."
h1: "Instalar PlexusTyping en Windows"
sidebarLabel: "Instalar en Windows"
section: empezar
order: 4
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: ["motor-adaptativo"]
---

En Windows 10 y 11 de 64 bits, PlexusTyping se instala con `PlexusTyping_<versión>_x64-setup.exe`. El instalador trabaja solo para tu usuario, sin permisos de administrador, y descarga el componente WebView2 si Windows no lo tiene. Como todavía no está firmado, SmartScreen mostrará un aviso de editor desconocido la primera vez.

## Requisitos

- Windows 10 u 11 de 64 bits (x64).
- Conexión a internet durante la instalación solo si falta WebView2.

## Instalar

1. Descarga `PlexusTyping_<versión>_x64-setup.exe` y `SHA256SUMS` desde la [página de descarga](/descargar).
2. Comprueba la suma SHA-256 como se explica en [verificar la descarga](/docs/empezar/verificar-descarga).
3. Ejecuta el instalador.
4. Si aparece el aviso de SmartScreen, pulsa «Más información» y después «Ejecutar de todas formas».
5. Termina el asistente y abre PlexusTyping.

## Por qué aparece SmartScreen

El instalador aún no tiene firma de código, así que Windows no reconoce al editor y avisa. La firma está planeada para una versión futura. Mientras tanto, la forma de comprobar que el archivo es el publicado es su suma SHA-256.

## Desinstalar

Desinstálalo desde Configuración → Aplicaciones, como cualquier otra aplicación. Más detalles en [actualizar y desinstalar](/docs/empezar/actualizar-y-desinstalar).

## Siguiente paso

Sigue con el [primer arranque y el texto de diagnóstico](/docs/empezar/primer-arranque).
