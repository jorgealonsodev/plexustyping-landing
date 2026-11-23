---
title: "Instalar en Linux con el .tar.gz · PlexusTyping"
description: "Cómo instalar PlexusTyping en cualquier distribución Linux x86_64 con el archivo portátil .tar.gz: dependencias, install.sh en ~/.local y desinstalación."
h1: "Instalar PlexusTyping en Linux con el archivo .tar.gz"
sidebarLabel: "Instalar en Linux (.tar.gz)"
section: empezar
order: 3
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: ["motor-adaptativo"]
---

El archivo portátil `plexustyping-<versión>-linux-x86_64.tar.gz` funciona en cualquier distribución Linux de 64 bits que tenga WebKitGTK 4.1 y GTK 3. Puedes ejecutar la app desde la carpeta descomprimida o instalarla con `install.sh` en `~/.local`, sin permisos de administrador. Antes, instala esas dos dependencias con el gestor de paquetes de tu distribución.

## 1. Instala las dependencias

El archivo no incluye WebKitGTK 4.1 ni GTK 3. Instálalos primero:

| Distribución | Orden |
|---|---|
| Debian / Ubuntu | `sudo apt install libwebkit2gtk-4.1-0 libgtk-3-0` |
| Fedora | `sudo dnf install webkit2gtk4.1 gtk3` |
| Arch Linux | `sudo pacman -S webkit2gtk-4.1 gtk3` |

## 2. Descomprime y ejecuta

1. Descarga el archivo y `SHA256SUMS` desde la [página de descarga](/descargar) y [verifica la descarga](/docs/empezar/verificar-descarga).
2. Descomprímelo y entra en la carpeta:

   ```sh
   tar -xzf plexustyping-<versión>-linux-x86_64.tar.gz
   cd plexustyping-<versión>
   ```

3. Ejecuta la app desde ahí, sin instalar nada:

   ```sh
   ./plexustyping
   ```

`plexustyping` es un lanzador: si falta WebKitGTK 4.1, muestra el paquete que debes instalar en Debian/Ubuntu, Fedora y Arch y termina con el código de salida 1. Si está, arranca el binario real, `plexustyping-bin`.

## 3. Instala en ~/.local (opcional)

```sh
./install.sh
```

`install.sh` copia los dos ejecutables a `~/.local/bin`, la entrada del menú a `~/.local/share/applications` y los iconos a `~/.local/share/icons/hicolor`. No escribe nada fuera de `~/.local`. Si `~/.local/bin` no está en tu `PATH`, el script te avisa para que lo añadas.

## Desinstalar

```sh
./install.sh --uninstall
```

Elimina exactamente lo que instaló `install.sh`. Tus datos se conservan en `~/.local/share/com.plexustyping.app/`.

## Actualizar

El `.tar.gz` no se actualiza solo: descarga el nuevo y vuelve a ejecutar `./install.sh`. Más detalles en [actualizar y desinstalar](/docs/empezar/actualizar-y-desinstalar). El archivo incluye un `README` en español con las mismas instrucciones.

## Siguiente paso

Sigue con el [primer arranque y el texto de diagnóstico](/docs/empezar/primer-arranque).
