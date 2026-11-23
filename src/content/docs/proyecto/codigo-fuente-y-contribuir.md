---
title: "Código fuente y contribuir"
description: "El código de PlexusTyping está en GitHub. Estructura del repositorio, requisitos para compilarlo, comandos de desarrollo y cómo proponer cambios."
section: proyecto
order: 3
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: [motor-adaptativo, ia]
---

El código fuente de PlexusTyping está en GitHub, en [jorgealonsodev/plexustyping](https://github.com/jorgealonsodev/plexustyping), bajo licencia MIT o Apache-2.0. Está escrito en Rust con Tauri 2, y la interfaz en Svelte 5. Para compilarlo necesitas Rust 1.88 o posterior, Node 22 o posterior, pnpm y las dependencias de sistema de Tauri 2.

## Estructura del repositorio

| Ruta | Contenido |
|---|---|
| `crates/plexustyping-core` | Motor de la sesión: reproducción de pulsaciones, modos de error, estadísticas |
| `crates/plexustyping-layouts` | Distribuciones de teclado (TOML) y composición de teclas muertas |
| `crates/plexustyping-corpus` | Corpus locales (es, en, pt, fr, de) y generador de textos sin IA |
| `crates/plexustyping-store` | Almacén SQLite local: perfiles, sesiones, pulsaciones, estadísticas, caché y uso de la IA |
| `crates/plexustyping-ai` | Proveedores de IA, petición, validación y cadena de respaldo |
| `crates/plexustyping-audio` | Audio del metrónomo |
| `crates/plexustyping-highlight` | Resaltado de sintaxis de los fragmentos de código |
| `src-tauri` | La aplicación Tauri (binario `plexustyping`) |
| `src` | Interfaz en Svelte 5 |

## Compilar y probar

```sh
pnpm install
pnpm tauri dev      # ejecutar la app
cargo test --workspace
pnpm check && pnpm test
pnpm tauri build    # instaladores: .deb en Linux, .exe (NSIS) en Windows
```

El `.tar.gz` de Linux se genera con `scripts/package-linux-tarball.sh`.

## Publicaciones

Al subir una etiqueta `v*`, GitHub Actions compila el `.deb`, el `.tar.gz`, el `.exe` y el archivo `SHA256SUMS`, y los adjunta a un borrador de publicación que un mantenedor publica.

## Proponer cambios

Los errores y las propuestas se gestionan en el repositorio de GitHub. Para informar de un fallo, sigue [Informar de un error](/docs/ayuda/informar-de-un-error).

## Relacionado

- [Licencias y créditos](/docs/proyecto/licencias-y-creditos)
- [Notas de versión](/docs/proyecto/notas-de-version)
