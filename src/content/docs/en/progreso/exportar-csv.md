---
title: "Export the history to CSV"
description: "“Exportar CSV” saves your sessions to the downloads folder as a standard UTF-8 CSV. File name, columns and format."
section: progreso
order: 2
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: [progreso]
lang: en
---

The history's “Exportar CSV” (export CSV) button saves the sessions of the active filter to your downloads folder, in a file called `plexustyping-sesiones-AAAAMMDD.csv` with the local date. It never overwrites an existing file: it adds `-2`, `-3`… to the name. When it finishes it shows “Exportado: <ruta> (N sesiones)” (exported: path, N sessions).

## How to export

1. Open the history with `Ctrl+H`.
2. Choose the filter: “Todo”, “Prosa”, “Palabras” or “Código” (all, prose, words or code).
3. In the “Sesiones” (sessions) view, click “Exportar CSV”.

Export is only in the “Sesiones” view. If the filter has no sessions, nothing is written and “No hay sesiones que exportar.” (no sessions to export) appears.

## File format

| Property | Value |
|---|---|
| Encoding | UTF-8 without BOM |
| Separator | `,` |
| Decimals | `.` |
| Quoting | RFC 4180 |
| Line ending | `\n` |
| Order | From the most recent session to the oldest |

## Columns

The header is (the column names are Spanish, as in the app):

```text
fecha,modo,lenguaje_codigo,idioma,layout,duracion_s,ppm_brutas,ppm_netas,precision,pulsaciones,bpm
```

| Column | Content |
|---|---|
| `fecha` (date) | Local time in ISO 8601 with offset, for example `2026-11-17T09:30:05+01:00` |
| `modo` (mode) | `prose`, `palabras` or `code` |
| `lenguaje_codigo` (code language) | The code session's language; empty in prose |
| `idioma` (language) | The text's language |
| `layout` | The session's keyboard layout |
| `duracion_s` (duration) | Duration in seconds, with one decimal |
| `ppm_brutas`, `ppm_netas` | Gross and net WPM, with one decimal |
| `precision` (accuracy) | From 0 to 100, with one decimal |
| `pulsaciones` (keystrokes) | The session's keystrokes |
| `bpm` | The metronome tempo; empty if it was not used |

The definitions of gross WPM, net WPM and accuracy are in the [glossary](/en/docs/reference/glossary). The `layout` identifiers (`es-qwerty`, `us-dvorak`…) appear in [layouts](/en/docs/keyboard-and-languages/layouts).

## Related

- [History and charts](/en/docs/progress/history-and-charts)
- [Where data is stored](/en/docs/settings/where-data-is-stored)
