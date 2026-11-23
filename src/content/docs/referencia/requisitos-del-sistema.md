---
title: "Requisitos del sistema"
description: "PlexusTyping funciona en Linux x86_64 con WebKitGTK 4.1 y GTK 3, y en Windows 10 y 11 de 64 bits. Requisitos de cada paquete, red, audio y llavero."
section: referencia
order: 3
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: [ia, metronomo, distribuciones-e-idiomas]
---

PlexusTyping funciona en Linux x86_64 y en Windows 10 y 11 de 64 bits. En Linux necesita WebKitGTK 4.1 y GTK 3: el paquete `.deb` los instala por ti y el `.tar.gz` requiere que ya estén instalados. En Windows usa WebView2, que el instalador descarga si falta. No necesita conexión a internet salvo para los textos con IA.

## Por paquete

| Paquete | Sistema | Requisitos |
|---|---|---|
| `plexustyping_<versión>_amd64.deb` | Debian, Ubuntu 22.04 o posterior y derivadas, x86_64 | `apt` instala `libwebkit2gtk-4.1-0` y `libgtk-3-0` |
| `plexustyping-<versión>-linux-x86_64.tar.gz` | Cualquier distribución x86_64 | WebKitGTK 4.1 y GTK 3 instalados antes |
| `PlexusTyping_<versión>_x64-setup.exe` | Windows 10 u 11 x64 | WebView2; el instalador lo descarga si Windows no lo tiene. No requiere permisos de administrador |

Dependencias del `.tar.gz` por distribución:

| Distribución | Comando |
|---|---|
| Debian / Ubuntu | `sudo apt install libwebkit2gtk-4.1-0 libgtk-3-0` |
| Fedora | `sudo dnf install webkit2gtk4.1 gtk3` |
| Arch Linux | `sudo pacman -S webkit2gtk-4.1 gtk3` |

macOS no tiene versión.

## Otros requisitos

| Recurso | Para qué | Sin él |
|---|---|---|
| Conexión a internet | Textos con IA e inicio de sesión con ChatGPT | La app funciona con el corpus local |
| Dispositivo de salida de audio | Metrónomo (usa el dispositivo por defecto) | Aviso «Metrónomo: No hay dispositivo de audio» |
| Llavero del sistema (Secret Service en Linux, Credential Manager en Windows) | Guardar claves de API de IA | No se puede guardar ninguna clave |

La ventana de la app mide como mínimo 720 × 480 píxeles.

La distribución de teclado elegida en la app debe coincidir con la del sistema operativo, porque las pulsaciones llegan a través del sistema. Consulta [Distribuciones](/docs/teclado-e-idiomas/distribuciones).

## Relacionado

- [Instalar en Linux (.deb)](/docs/empezar/instalar-linux-deb)
- [Instalar en Linux (.tar.gz)](/docs/empezar/instalar-linux-tar)
- [Instalar en Windows](/docs/empezar/instalar-windows)
- [Solución de problemas](/docs/ayuda/solucion-de-problemas)
