---
title: "Exportar el historial a CSV"
description: "«Exportar CSV» guarda tus sesiones en la carpeta de descargas como un CSV estándar en UTF-8. Nombre del archivo, columnas y formato."
section: progreso
order: 2
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.2.0"
features: [progreso]
---

El botón «Exportar CSV» del historial guarda las sesiones del filtro activo en tu carpeta de descargas, en un archivo llamado `plexustyping-sesiones-AAAAMMDD.csv` con la fecha local. Nunca sobrescribe un archivo existente: añade `-2`, `-3`… al nombre. Al terminar muestra «Exportado: <ruta> (N sesiones)».

## Cómo exportar

1. Abre el historial con `Ctrl+H`.
2. Elige el filtro: Todo, Prosa, Palabras o Código.
3. En la vista «Sesiones», pulsa «Exportar CSV».

La exportación solo está en la vista «Sesiones». Si el filtro no tiene sesiones, no se escribe nada y aparece «No hay sesiones que exportar.».

## Formato del archivo

| Propiedad | Valor |
|---|---|
| Codificación | UTF-8 sin BOM |
| Separador | `,` |
| Decimales | `.` |
| Comillas | RFC 4180 |
| Fin de línea | `\n` |
| Orden | De la sesión más reciente a la más antigua |

## Columnas

La cabecera es:

```text
fecha,modo,lenguaje_codigo,idioma,layout,duracion_s,ppm_brutas,ppm_netas,precision,pulsaciones,bpm
```

| Columna | Contenido |
|---|---|
| `fecha` | Hora local en ISO 8601 con desfase, por ejemplo `2026-11-17T09:30:05+01:00` |
| `modo` | `prose`, `palabras` o `code` |
| `lenguaje_codigo` | Lenguaje de la sesión de código; vacío en prosa |
| `idioma` | Idioma del texto |
| `layout` | Distribución de teclado de la sesión |
| `duracion_s` | Duración en segundos, con un decimal |
| `ppm_brutas`, `ppm_netas` | Velocidad bruta y neta, con un decimal |
| `precision` | De 0 a 100, con un decimal |
| `pulsaciones` | Pulsaciones de la sesión |
| `bpm` | Tempo del metrónomo; vacío si no se usó |

Las definiciones de PPM brutas, PPM netas y precisión están en el [glosario](/docs/referencia/glosario). Los identificadores de `layout` (`es-qwerty`, `us-dvorak`…) aparecen en [Distribuciones](/docs/teclado-e-idiomas/distribuciones).

## Relacionado

- [Historial y gráficas](/docs/progreso/historial-y-graficas)
- [Dónde se guardan los datos](/docs/ajustes/donde-se-guardan-los-datos)
