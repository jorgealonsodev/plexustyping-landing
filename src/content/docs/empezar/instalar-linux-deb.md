---
title: "Instalar en Linux con el .deb · PlexusTyping"
description: "Cómo instalar PlexusTyping en Ubuntu 22.04 o posterior, Debian y derivadas con el paquete .deb y apt, que instala también WebKitGTK y GTK 3."
h1: "Instalar PlexusTyping en Linux con el paquete .deb"
sidebarLabel: "Instalar en Linux (.deb)"
section: empezar
order: 2
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: ["motor-adaptativo"]
---

El paquete `plexustyping_<versión>_amd64.deb` es la forma más sencilla de instalar PlexusTyping en Ubuntu 22.04 o posterior, Debian y sus derivadas de 64 bits. Se instala con `apt`, que también instala las dependencias del sistema que necesita, la entrada del menú y los iconos. No hace falta configurar nada más.

## Requisitos

- Linux x86_64 (64 bits) con Debian, Ubuntu 22.04 o posterior, o una derivada.
- Permisos de administrador (`sudo`) para instalar el paquete.

Si tu distribución no usa paquetes `.deb`, usa el [archivo portátil .tar.gz](/docs/empezar/instalar-linux-tar).

## Instalar

1. Descarga `plexustyping_<versión>_amd64.deb` y `SHA256SUMS` desde la [página de descarga](/descargar).
2. Comprueba la suma SHA-256 como se explica en [verificar la descarga](/docs/empezar/verificar-descarga).
3. Abre una terminal en la carpeta de la descarga e instala el paquete:

   ```sh
   sudo apt install ./plexustyping_<versión>_amd64.deb
   ```

4. Abre PlexusTyping desde el menú de aplicaciones.

`apt` instala a la vez las dependencias que declara el paquete: `libwebkit2gtk-4.1-0` y `libgtk-3-0`.

## Nombre del paquete

El paquete instalado se llama `plexus-typing` (el nombre que Tauri deriva del nombre del producto). Es el que usarás para desinstalarlo:

```sh
sudo apt remove plexus-typing
```

## Siguiente paso

Sigue con el [primer arranque y el texto de diagnóstico](/docs/empezar/primer-arranque). Para instalar una versión nueva, consulta [actualizar y desinstalar](/docs/empezar/actualizar-y-desinstalar).
