# PRD · Web de PlexusTyping (landing, descargas y documentación)

**Versión:** 0.1 (borrador) · **Fecha:** 19-11-2026 · **Repositorio:** `plexustyping-landing` · **Producto:** [PlexusTyping](https://github.com/jorgealonsodev/plexustyping), versión publicada 0.2.0

> Este PRD define la web pública de PlexusTyping: qué páginas tiene, qué cuenta de la app, cómo se descarga, cómo se documenta, cómo se posiciona en buscadores y asistentes de IA en 2026, y los límites de rendimiento, seguridad y accesibilidad que no se negocian. El aspecto visual **no** se decide aquí: se decide con el proceso de la skill *impeccable* (§9), que este PRD hace obligatorio.

---

## 1. Resumen

PlexusTyping es un tutor de mecanografía de escritorio (Linux y Windows), libre y local. A diferencia de los tests de velocidad, **mide qué teclas y combinaciones de letras te cuestan** (errores y lentitud, carácter a carácter y bigrama a bigrama) y **genera textos que las practican**, con corpus local o con IA opcional.

La web tiene tres trabajos:

1. **Convencer y descargar.** Que una persona que llega desde un buscador o un asistente de IA entienda en 10 segundos qué hace distinto PlexusTyping, lo vea funcionando y lo descargue para su sistema.
2. **Documentar.** Toda la documentación de usuario de la app, en web, buscable y enlazable.
3. **Ser encontrada.** SEO técnico y de contenido al nivel de 2026, también para asistentes de IA (ChatGPT, Claude, Gemini, Perplexity).

Debe ser **muy rápida** (estática, casi sin JavaScript) y **muy segura** (sin terceros, CSP estricta, cabeceras completas).

## 2. Objetivos y métricas

| Objetivo | Métrica | Meta |
|---|---|---|
| Descargas | Clics en un artefacto de la release / visitas a la home | ≥ 15 % |
| Comprensión | Tiempo hasta el primer clic en «Descargar» o en una simulación | mediana < 30 s |
| Rendimiento | Core Web Vitals (p75, datos de campo) | LCP < 1,5 s · INP < 100 ms · CLS < 0,05 |
| Lighthouse (laboratorio, móvil) | Rendimiento, Accesibilidad, Buenas prácticas, SEO | 100 · 100 · 100 · 100 |
| Seguridad | securityheaders.com y Mozilla Observatory | A+ en ambos |
| SEO | Páginas indexadas sin errores en Search Console; rich results válidos | 100 % de URLs del sitemap; `SoftwareApplication` válido |
| Accesibilidad | WCAG 2.2 AA; axe sin violaciones | 0 violaciones |
| Peso | JS total por página (gzip) | ≤ 60 KB en la home (≤ 40 KB antes de hacer scroll); 0 KB en páginas de documentación sin simulación |

## 3. Audiencia y escenarios

- **Quien quiere escribir mejor y más rápido** (estudiantes, oficinistas, opositores): busca «mejorar velocidad de escritura», «curso de mecanografía gratis», «practicar mecanografía». Necesita ver que es gratis, que funciona sin conexión y que se adapta a sus fallos.
- **Programadores:** buscan «practicar mecanografía para programar». Les importan el modo código, los símbolos, las distribuciones (Dvorak, Colemak), el código abierto y la privacidad.
- **Usuarios de Monkeytype/keybr que quieren algo más:** comparan. Les importan el cursor y las fuentes conocidas, el texto ilimitado, el mapa de calor y el análisis de puntos débiles.
- **Personas con necesidades de accesibilidad:** temas de alto contraste, lector de pantalla, modo daltónico, tipografía ajustable, movimiento reducido.
- **Usuarios de Linux:** `.deb`, `.tar.gz`, sin AppImage; quieren dependencias claras y sumas SHA-256.

Escena física (para decidir claro/oscuro y el resto del mundo visual en §9): la mayoría llega de noche o en un descanso, desde un portátil o un escritorio, a menudo con el modo oscuro del sistema activo; un tercio desde móvil (leen, no descargan: la web debe permitir **enviarse el enlace** o recordarlo).

## 4. Alcance

### Dentro (v1)
- Home (landing) con simulaciones interactivas.
- Página de descarga con detección de sistema, artefactos, sumas, requisitos e instrucciones.
- Documentación completa de usuario (§7), con búsqueda.
- Páginas de funciones (una por bloque grande, para SEO de cola larga).
- Notas de versión (changelog) generadas desde las releases.
- Privacidad, licencias y créditos, preguntas frecuentes, 404.
- Español (idioma principal) e inglés.

### Fuera (v1)
- Cuentas de usuario, clasificaciones (rankings) y envío de resultados: se dejan para una fase 2 con backend propio (ver «Plan de rankings» en la memoria del proyecto; requiere modo de prueba con texto fijo, anti-trampas con el motor de *replay* en WASM y RGPD).
- Blog (se puede añadir después con la misma colección de contenido).
- Probar la app completa en el navegador (las simulaciones enseñan, no sustituyen a la app).

## 5. Arquitectura de información y URLs

URLs en español sin prefijo; inglés bajo `/en/`. Sin barra final (`trailingSlash: "never"`), coherente en canónicas, sitemap y enlaces.

```
/                          Home (landing)
/descargar                 Descarga (detección de sistema)
/funciones                 Índice de funciones
/funciones/motor-adaptativo
/funciones/ia              (proveedores, plan de ChatGPT, privacidad)
/funciones/texto-ilimitado
/funciones/metronomo
/funciones/modo-codigo
/funciones/distribuciones-e-idiomas
/funciones/accesibilidad
/funciones/personalizacion  (temas, fuentes, cursor, tipografía)
/funciones/progreso         (historial, gráficas, meta diaria, desbloqueo progresivo, fantasma, perfiles)
/docs                      Índice de documentación
/docs/<seccion>/<pagina>   (§7)
/novedades                 Notas de versión
/preguntas-frecuentes
/privacidad
/licencias
/en/...                    Espejo en inglés
/404
/llms.txt, /llms-full.txt, /robots.txt, /sitemap-index.xml, /rss.xml (novedades)
```

Navegación principal: Funciones · Documentación · Novedades · **Descargar** (botón). Pie: privacidad, licencias, GitHub, idioma, tema claro/oscuro.

## 6. Contenido: todas las características de la app

La web debe contar **todo lo que la app hace hoy y nada que no haga**. El inventario de abajo es la fuente de verdad del contenido; antes de publicar, cada afirmación se contrasta con el README de la app y con la versión publicada (tarea C1). Lo marcado *(próxima versión)* solo aparece en «Novedades» o con esa etiqueta, nunca como función disponible.

### 6.1 Práctica
- **Modos:** «Prosa» (frases con sentido), «Palabras» (palabras sueltas en minúscula) y «Código».
- **Longitud:** 100, 200, 300, 450, 600, 800, 1000, 1500 o 2000 caracteres, o **«Ilimitado»**: el texto crece mientras escribes; al acercarte al final se genera la continuación (IA o corpus local) sin interrumpirte; Esc o «Terminar» puntúan lo escrito *(800–2000 e Ilimitado: próxima versión 0.1.1)*.
- **Modos de error:** «Permitir seguir», «Parar hasta corregir» y «Borrar con Retroceso».
- **Objetivos por texto** (2 o 3 unidades débiles, mostradas como «Practicando: ñ · qu · z») y texto de **diagnóstico** inicial hasta guardar la primera sesión.
- **Estadísticas en vivo:** PPM, pulsaciones por minuto, precisión, tiempo.
- **Resultados:** PPM netas y brutas, precisión, errores, caracteres fallados, puntos débiles actualizados; «Siguiente texto» (Enter) y «Repetir».
- **Sesión fantasma:** un cursor fantasma repite tu mejor sesión con el mismo texto, con la diferencia ±s en directo, «Récord anterior» y «¡Nuevo récord para este texto!».
- **Desbloqueo progresivo:** empieza por la fila central y añade teclas al dominarlas («Velocidad objetivo» 20–50 PPM), por perfil, idioma y distribución, con palabras y pseudopalabras mientras hay pocas letras.
- **Meta diaria** (minutos o textos) con racha.

### 6.2 Motor adaptativo
- Mide error y lentitud por carácter y bigrama con medias móviles (EMA), con un bonus de incertidumbre para repasar lo poco practicado.
- Elige los objetivos y pide textos con la densidad adecuada de esas unidades.
- Mapa de calor del teclado con niveles 1–5.

### 6.3 Textos con IA (opcional)
- **Proveedores:** Claude (Anthropic), OpenAI, Google Gemini, OpenCode Go y **«ChatGPT (tu suscripción)»** con el inicio de sesión oficial de OpenAI en el navegador (usa la cuota de tu plan, sin clave de API; un error del plan nunca pasa a gastar tus claves; «Cerrar sesión» revoca la sesión).
- **Cadena de respaldo** de hasta 5 proveedores, cada uno con su modelo, «Probar conexión» y «Guardar/Borrar clave»; límites de 30 s por proveedor y 60 s por cadena, un reintento, y después caché o corpus local con aviso. Cada texto indica su origen («Generado con IA · …», «Texto del caché», «Corpus local»).
- **Tema** opcional del texto; **densidad** de objetivos (2–5×, modo código); modelo automático al elegir proveedor; botón «IA» en la cabecera; el siguiente texto se prepara mientras escribes.
- **Privacidad:** en prosa solo se envían idioma, longitud y tema (y los caracteres permitidos con el desbloqueo progresivo; en «Ilimitado», el final del texto ya generado); en código, también objetivos y caracteres permitidos. **Nunca se envía lo que escribes.** Las claves se guardan en el llavero del sistema; las peticiones salen solo del núcleo en Rust (la interfaz no tiene acceso a la red). Tabla de uso con llamadas y tokens por proveedor, hoy y en total.
- Funciona **sin IA y sin conexión** con el corpus local.

### 6.4 Teclado, distribuciones e idiomas
- **Distribuciones (8):** Español (España), Español (Latinoamérica), English (US), Português (Brasil, ABNT2), Français (AZERTY), Deutsch (QWERTZ), English (Dvorak), English (Colemak).
- **Idiomas del texto:** español, inglés, portugués de Brasil, francés y alemán; cada uno con corpus local (5.000 palabras frecuentes, frases, párrafo de diagnóstico y hasta 2.000 frases de Common Voice, CC0). **Idiomas de la interfaz (desde la 0.2.0):** español, inglés, portugués de Brasil, francés y alemán; sigue el idioma del sistema (inglés si no está entre ellos) y se elige en Ajustes → Apariencia, aparte del idioma del texto.
- **Teclado visual** (F2) con forma ISO, ANSI o ABNT2, etiquetas de Shift y AltGr, teclas muertas, color por dedo, resaltado de la tecla siguiente y su modificador, destellos verde/rojo y mapa de calor.

### 6.5 Modo código
- **15 lenguajes:** Python, JavaScript, TypeScript, Java, C#, C++, C, Go, Rust, PHP, SQL, Bash, HTML/CSS, Kotlin y Swift.
- Fragmentos de 5–20 líneas con resaltado de sintaxis; Enter y Tab son teclas medidas; «Sangría» automática o manual; estadísticas separadas de la prosa.

### 6.6 Metrónomo
- 30–300 BPM, sonidos «Clic», «Madera» y «Bip», volumen, acento cada N pulsos, punto de pulso visual, desvío de ritmo por tecla («Ritmo: desvío medio ±X ms»), **panel rápido** desde el punto del pulso (− / + / escribir el tempo, sonido, volumen, acento, tempo adaptativo, «Apagar F4») y **tempo adaptativo** tras cada texto. F4 lo enciende y apaga.

### 6.7 Progreso
- **Historial** (Ctrl+H) con filtro Todo/Prosa/Palabras/Código y vistas «Sesiones» (gráfica de las últimas 50 y tabla), «Por día» (últimos 30 días, PPM netas y minutos) y «Por carácter» (errores y lentitud, 20 peores); **«Exportar CSV»** a la carpeta de descargas.
- **Perfiles** locales («Nuevo perfil», «Usar», «Renombrar», «Borrar»), cada uno con su historial, estadísticas, distribución, idioma, tema, meta diaria y progreso de desbloqueo.

### 6.8 Personalización
- **59 temas** (57 de PlexusTerm más «Alto contraste oscuro» y «Alto contraste claro») e **importación de hasta 30 temas de VS Code** (`.json`/`.jsonc`).
- **Texto:** fuente (Roboto Mono, JetBrains Mono, Fira Code sin ligaduras, Source Code Pro, IBM Plex Mono, Inconsolata, Atkinson Hyperlegible Mono, Intel One Mono, Lexend Deca, OpenDyslexic; todas incluidas, sin descargas), tamaño, espaciado, interlineado, **cursor** (Barra estilo Monkeytype por defecto, Resaltado, Bloque, Subrayado, Contorno) con parpadeo, y **texto pendiente atenuado**.

### 6.9 Accesibilidad
- Todos los temas cumplen WCAG AA; los de alto contraste, 7:1.
- Navegación completa por teclado (Tab, F6 a la cabecera), modo **lector de pantalla** con anuncios `aria-live`, **modo daltónico** (azul y naranja Okabe–Ito, subrayado en errores), tipografía ajustable y **movimiento reducido** del sistema respetado.

### 6.10 Ajustes y datos
- Ventana de ajustes por secciones (Práctica, Texto, Teclado, Metrónomo, Código, Apariencia, Accesibilidad, IA, Perfiles) con **buscador rápido** (Ctrl+F).
- Todo se guarda **localmente**, sin cuenta ni telemetría (SQLite en `~/.local/share/com.plexustyping.app/` en Linux); los ajustes se guardan al cambiarlos y sobreviven a reinicios y reinstalaciones. Si la base de datos no se puede abrir, la app avisa y funciona en modo temporal.

### 6.11 Atajos de teclado
`Ctrl+,` ajustes · `Ctrl+F` buscar ajuste · `Ctrl+H` historial · `Enter` siguiente texto · `F5` texto nuevo · `F4` metrónomo · `F2` teclado visual · `F6` ir a la cabecera · `Esc` reiniciar (o terminar en «Ilimitado») · en código, `Enter` y `Tab` son salto de línea y sangría.

### 6.12 Descarga y plataformas
- **Linux x86_64:** `plexustyping_<versión>_amd64.deb` (Ubuntu 22.04 o posterior; el paquete se llama `plexus-typing`) y `plexustyping-<versión>-linux-x86_64.tar.gz` (cualquier distribución con WebKitGTK 4.1 y GTK 3; `install.sh` en `~/.local`, `--uninstall`).
- **Windows 10/11 x64:** `PlexusTyping_<versión>_x64-setup.exe`, instalador por usuario sin permisos de administrador, con el instalador de WebView2 incluido, **sin firmar** (aviso de SmartScreen: «Más información → Ejecutar de todas formas»).
- **`SHA256SUMS`** con las sumas de todos los artefactos. Sin actualización automática (aviso manual en la web y en las notas de versión).
- **Licencias:** código MIT o Apache-2.0; fuentes OFL-1.1; listas de palabras hermitdave/FrequencyWords (CC BY-SA 4.0); frases de Common Voice (CC0); temas de iTerm2-Color-Schemes (MIT) y sus autores; resaltado con syntect (MIT).
- **Gratis y de código abierto.**

### 6.13 Planeado (no se presenta como disponible)
Texto de control para medir el progreso, modo infantil, endpoint compatible con OpenAI propio (Ollama, LM Studio), coste y límite de gasto mensual, actualización automática y firma Authenticode en Windows, corpus italiano, tema que sigue el modo del sistema, pares de confusión como objetivos, gráficas de consistencia, copiar informe de diagnóstico, aviso de distribución distinta a la del sistema, exportar perfiles. macOS y AppImage quedan fuera de la v1. Solo aparecen en «Novedades → Hoja de ruta», marcados como planeados.

## 7. Documentación (toda, en web)

Escrita en Markdown/MDX dentro de una colección de contenido; cada página con título, descripción, fecha de revisión, versión de la app a la que aplica y enlaces «Editar en GitHub» y «¿Te ha ayudado?» (sin analítica de terceros: enlace a una *issue* prerrellenada).

| Sección | Páginas |
|---|---|
| Empezar | Qué es PlexusTyping · Instalar en Linux (.deb) · Instalar en Linux (.tar.gz) · Instalar en Windows · Verificar la descarga (SHA-256) · Primer arranque y texto de diagnóstico · Actualizar y desinstalar |
| Practicar | Modos (prosa, palabras, código) · Longitud y texto ilimitado · Modos de error · Objetivos y puntos débiles · Sesión fantasma · Desbloqueo progresivo · Meta diaria y racha |
| Motor adaptativo | Cómo mide tus debilidades · Cómo elige los textos · Mapa de calor |
| IA | Activar la IA · Proveedores y claves · Iniciar sesión con ChatGPT · Cadena de respaldo, caché y uso · Qué se envía y qué no |
| Metrónomo | Uso básico · Panel rápido · Tempo adaptativo |
| Teclado e idiomas | Distribuciones · Idiomas del texto · Teclado visual y destellos |
| Progreso | Historial y gráficas · Exportar CSV · Perfiles |
| Personalización | Temas e importación de VS Code · Fuentes · Cursor · Tipografía · Texto pendiente atenuado |
| Accesibilidad | Teclado · Lector de pantalla · Modo daltónico · Alto contraste · Movimiento reducido |
| Ajustes | Mapa de la ventana de ajustes · Buscador · Dónde se guardan los datos |
| Referencia | Atajos de teclado · Glosario (PPM, precisión, bigrama, EMA…) · Requisitos del sistema |
| Ayuda | Preguntas frecuentes · Solución de problemas (falta WebKitGTK, SmartScreen, sin sonido, IA sin respuesta, texto ilimitado) · Informar de un error |
| Proyecto | Privacidad · Licencias y créditos · Código fuente y contribuir · Notas de versión |

**Búsqueda** con Pagefind (índice estático generado en el build, sin servidor ni terceros; se carga solo al abrir el buscador).

**Capturas:** reales, generadas con el script e2e de la app (Xvfb, datos aislados) para que siempre coincidan con la versión; en AVIF/WebP con dimensiones fijas. Nada de capturas inventadas.

## 8. Simulaciones de PlexusTyping en uso

Las simulaciones son el centro de la landing: **enseñan la app funcionando** sin pedir descarga. Requisitos comunes:

- **Fieles:** reutilizan la lógica real de la app (el motor `TypingSession` en TypeScript, los temas derivados con su guarda de contraste, el cálculo de niveles del mapa de calor), copiada como paquete compartido o importada del repositorio de la app con versión fijada. No se reimplementa a ojo.
- **Datos sintéticos etiquetados:** textos y estadísticas de ejemplo marcados como «demostración». Ninguna llamada a IA desde la web: los textos «generados con IA» son muestras pregrabadas.
- **Islas:** cada simulación es una isla que se hidrata solo al entrar en pantalla (`client:visible`), con presupuesto propio (≤ 12 KB gzip cada una salvo el hero, ≤ 20 KB; sin contar el runtime compartido de Svelte, ≤ 17 KB, que se carga una sola vez). Sin ellas, la página es completa (HTML estático con una captura y descripción equivalente).
- **Accesibles:** operables con teclado, con alternativa textual, pausables, y en reposo con `prefers-reduced-motion` (sin reproducción automática; el usuario la inicia).
- **Sin sonido automático:** el metrónomo suena solo tras pulsar.

| # | Simulación | Qué demuestra | Interacción |
|---|---|---|---|
| S1 | **Hero: escribe aquí** | Texto real de práctica con cursor tipo barra; al escribir, PPM y precisión en vivo y el teclado resaltando la tecla siguiente | El visitante escribe de verdad; si no escribe, una reproducción grabada escribe con errores realistas |
| S2 | **Tus puntos débiles** | El motor adaptativo: tras unos segundos de escritura, el mapa de calor se tiñe y aparecen los objetivos («Practicando: ñ, ci») y el texto siguiente que los incluye | Reproducción o resultado de S1 |
| S3 | **Texto ilimitado** | El texto crece al acercarse al final, con «Generando más texto…» y la continuación encadenada | Reproducción acelerada con botón para pausar |
| S4 | **Sesión fantasma** | Carrera contra el récord con el cursor fantasma y la diferencia de tiempo | Reproducción |
| S5 | **Metrónomo** | Pulso visual, panel rápido y tempo adaptativo tras un texto | Pulsar para oírlo; cambiar el tempo |
| S6 | **Desbloqueo progresivo** | Teclado atenuado que se va desbloqueando con «Nueva tecla desbloqueada» | Reproducción |
| S7 | **Hazla tuya** | Cambiar tema (incluidos alto contraste), fuente, cursor y atenuado sobre un texto de muestra | Selectores reales |
| S8 | **Modo código** | Fragmento con resaltado de sintaxis y sangría | Reproducción o escritura |
| S9 | **IA con privacidad** | Diagrama animado: qué sale hacia el proveedor (idioma, longitud, tema; objetivos solo en código) y qué no (lo que escribes); la interfaz sin red y las peticiones desde el núcleo | Reproducción |
| S10 | **Accesibilidad** | Lector de pantalla (transcripción de anuncios), modo daltónico y movimiento reducido | Conmutadores |

## 9. Diseño (obligatorio: skill *impeccable*)

El aspecto se decide con la skill *impeccable* (`~/.pi/agent/skills/impeccable`), siguiendo su proceso completo. **Ningún código de interfaz antes de cerrar el paso 3.**

1. **`impeccable init`** → `PRODUCT.md` (verdad del producto: este PRD §1, §3 y §6) y configuración del proyecto.
2. **Modos por superficie:** home, funciones y descarga en modo **Persuade**; documentación, preguntas frecuentes y notas de versión en modo **Read**. El modo vive en el brief de cada superficie.
3. **Mundo visual nuevo (new-work):** `impeccable concept-seed --scope direction --mode persuade`, ronda de direcciones en la página de decisión, elección del usuario, **contrato de dirección** (THESIS, OWN-WORLD, STORY, FIRST VIEWPORT, FORM, FINISH) en el brief.
   - **Relación con la app:** la app tiene su propia identidad (temas de terminal, Catppuccin Mocha por defecto, mono JetBrains Mono, cursor barra). La web puede ampliarla pero las simulaciones muestran la app tal como es; el contrato debe decir cómo conviven.
   - **Tendencias 2026, con criterio:** tipografía con carácter (evitar las fuentes por defecto de IA que lista impeccable: Inter como display, Space Grotesk, DM Sans, Fraunces…), color comprometido a escala de página, composición no plantilla, movimiento con propósito (View Transitions entre páginas, animaciones vinculadas al scroll solo donde explican algo), modo claro y oscuro reales, bento solo si el contenido lo pide. Prohibido caer en los clichés que impeccable señala (crema + serif + terracota, negro + neón, etc.) salvo decisión explícita.
4. **Construcción** según el *build path* (comp-led o code-led) que imprima impeccable.
5. **Revisión final:** `impeccable critique` y `audit` sobre lo construido, veredicto, y `DESIGN.md` documentando el mundo construido. «Sin revisar y sin documentar es sin terminar».

## 10. SEO 2026

### 10.1 Técnico
- **HTML estático** prerenderizado (nada de contenido que dependa de JavaScript para existir).
- **Un `<h1>` por página**, jerarquía de encabezados correcta, títulos ≤ 60 caracteres y descripciones ≤ 155 únicas por página.
- **Canónicas** absolutas y coherentes con la barra final; **`hreflang`** es/en/x-default recíprocos.
- **`sitemap-index.xml`** generado en el build (solo páginas indexables) y referenciado en `robots.txt`.
- **`robots.txt`** que **permite** los rastreadores de buscadores y de IA (Googlebot, Bingbot, GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended): queremos que nos citen.
- **404 real** (código 404), redirecciones 301 para cualquier cambio de URL.
- **Datos estructurados JSON-LD** en el HTML servido:
  - `SoftwareApplication` (nombre, `applicationCategory: EducationalApplication`, `operatingSystem: Linux, Windows`, `offers` precio 0, `softwareVersion`, `downloadUrl`, `license`, `screenshot`, `featureList`).
  - `Organization`/`Person` (autor), `WebSite` con `SearchAction` hacia la búsqueda de la documentación.
  - `BreadcrumbList` en documentación y funciones; `FAQPage` en preguntas frecuentes; `HowTo` en las guías de instalación; `TechArticle` en la documentación.
- **Open Graph y X Cards** con imagen por página generada en el build (1200×630, AVIF/PNG).
- **Core Web Vitals** dentro de los objetivos de §2 (también son señal de ranking).
- **Feed RSS** de novedades.

### 10.2 Contenido y búsqueda generativa (GEO)
- Cada página responde **una pregunta concreta** en su primer párrafo (respuesta directa de 40–60 palabras) y luego desarrolla: así la citan los resúmenes de IA y los fragmentos destacados.
- **Páginas de funciones** orientadas a búsquedas reales: «curso de mecanografía gratis», «practicar mecanografía online/offline», «mejorar velocidad de escritura», «mecanografía para programadores», «teclado Dvorak/Colemak práctica», «alternativa a Monkeytype/keybr» (comparación honesta, sin afirmaciones no verificables sobre terceros).
- **Datos verificables** (versión, licencia, plataformas, tamaño de descarga, fecha de la última release) en texto, no solo en imágenes.
- **`llms.txt`** y **`llms-full.txt`** (índice y versión completa en Markdown de la documentación). Son baratos de mantener; su efecto es incierto (un estudio de Ahrefs de 2026 vio que el 97 % no se leen), así que no sustituyen al HTML bien estructurado.
- **Autoría y fechas** visibles (E-E-A-T): quién hace la app, enlace al repositorio, fecha de actualización de cada guía.
- Enlazado interno: cada función enlaza a su documentación y viceversa; migas de pan.

## 11. Rendimiento

- **Astro 6** en modo estático; **0 KB de JavaScript por defecto**; las simulaciones son islas que se hidratan al verse.
- **Presupuestos** (comprobados en CI): HTML de la home ≤ 50 KB gzip; CSS crítico en línea ≤ 14 KB; JS ≤ 60 KB gzip en la home (≤ 40 KB antes de hacer scroll), 0 en documentación sin simulación; imagen LCP ≤ 80 KB; fuentes ≤ 2 archivos en el primer pintado.
- **Fuentes:** autoalojadas, WOFF2, solo latin y latin-ext, `font-display: swap` con métricas de fallback ajustadas (sin CLS), precarga solo de la fuente del titular.
- **Imágenes:** AVIF con WebP de respaldo, `width`/`height` siempre, `loading="lazy"` salvo la LCP (`fetchpriority="high"`).
- **CDN** con HTTP/3, Brotli, caché inmutable (`max-age=31536000, immutable`) para recursos con hash y revalidación corta para HTML.
- **View Transitions** entre páginas (sin JavaScript de navegación propio) y *prefetch* de enlaces al pasar el ratón.

## 12. Seguridad

- **Sin terceros en tiempo de ejecución:** ni fuentes, ni scripts, ni analítica, ni iframes, ni CDNs de librerías. Todo autoalojado.
- **CSP estricta** generada por Astro (`security.csp`, estable desde Astro 6) con hashes de cada script y estilo; además, por cabecera del host: `default-src 'none'; script-src` y `style-src` con hashes; `img-src 'self' data:`; `font-src 'self'`; `connect-src 'self'`; `base-uri 'none'`; `form-action 'none'`; `frame-ancestors 'none'`; `upgrade-insecure-requests`.
- **Cabeceras:** `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` restrictiva (cámara, micrófono, geolocalización, etc. desactivados), `Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Resource-Policy: same-origin`, `X-Frame-Options: DENY`.
- **Descargas:** los botones apuntan a los artefactos de **GitHub Releases** (origen oficial) y la web muestra sus **SHA-256** y cómo verificarlos. Los datos de la release se leen **en el build** (API de GitHub con token de solo lectura en CI, nunca en el cliente); una release nueva lanza un nuevo build (`workflow_dispatch` / evento `release`).
- **Cadena de suministro:** lockfile, `pnpm install --frozen-lockfile`, acciones de GitHub fijadas a SHA, Dependabot/Renovate, sin dependencias en tiempo de ejecución en el cliente salvo las islas.
- **DNS y dominio:** DNSSEC, CAA limitando las CA, HSTS preload tras verificar.
- **`security.txt`** en `/.well-known/`.

## 13. Accesibilidad (WCAG 2.2 AA)

- Contraste AA en ambos temas (la web reutiliza la guarda de contraste de la app para sus propios colores).
- Navegación completa por teclado, foco visible, enlace «Saltar al contenido», orden lógico.
- Simulaciones pausables, sin reproducción automática con movimiento reducido, con alternativa textual y operables por teclado.
- Idioma de cada página (`lang`) y de fragmentos en otro idioma.
- Textos de enlace descriptivos; imágenes con `alt` útil; tablas con encabezados.
- Comprobado con axe en CI y revisión manual con lector de pantalla (Orca y NVDA).

## 14. Internacionalización

- Español como idioma principal (la app está en español); inglés completo en `/en/`.
- Selector de idioma que conserva la página; sin redirecciones automáticas por `Accept-Language` (solo una sugerencia discreta).
- Fechas, números y unidades formateados por idioma.

## 15. Stack técnico

| Pieza | Elección | Motivo |
|---|---|---|
| Framework | **Astro 6** (salida estática) | HTML estático, islas, CSP integrada, colecciones de contenido |
| Islas | **Svelte 5** | Mismo framework que la app: reutilizar lógica y componentes de las simulaciones |
| Lenguaje | TypeScript estricto | |
| Contenido | Colecciones de contenido + MDX | Documentación versionada y tipada |
| Código en docs | Shiki (en el build) | Sin JS en el cliente |
| Búsqueda | Pagefind | Estática, sin servidor |
| Imágenes | `astro:assets` | AVIF/WebP, dimensiones |
| Estilos | CSS moderno (capas, `@container`, `color-mix`, variables) | Sin framework de utilidades salvo que *impeccable* decida otra cosa |
| Hosting | Dominio propio del autor (pendiente) sobre un host estático con cabeceras configurables y CDN (Cloudflare Pages recomendado) | HTTP/3, cabeceras, caché |
| CI/CD | GitHub Actions | Build, pruebas, despliegue, rebuild al publicar una release |

## 16. Calidad y pruebas

- **Lighthouse CI** con presupuestos (§2, §11) en cada PR.
- **Playwright:** navegación, idioma, descarga (enlaces y sumas correctas para la última release), simulaciones (escribir en S1 actualiza PPM; S3 crece; reduced motion las detiene).
- **axe-core** en todas las páginas.
- **Comprobador de enlaces** (internos y a GitHub).
- **Validación** de HTML, JSON-LD (esquema), sitemap y `hreflang`.
- **Cabeceras de seguridad** verificadas contra el despliegue de previsualización.
- **Contenido:** cada afirmación de §6 enlazada a su comprobación en la app (tarea C1); revisión antes de cada release.

## 17. Fases y tareas

| Fase | Tareas |
|---|---|
| F0 · Producto | C1 contrastar §6 con la app (inventario verificado el 19-11-2026; repetir por release) · C2 actualizar el README de la app (estado «fase 2», panel rápido del metrónomo y F6 sin documentar, nombre del `.deb`) · decidir dominio y hosting · `impeccable init` → PRODUCT.md |
| F1 · Dirección visual | Ronda de *impeccable* (concept-seed) · contrato de dirección · capturas reales con el script e2e |
| F2 · Base | Astro 6 + Svelte, i18n, layouts, CSP, cabeceras, SEO técnico (JSON-LD, sitemap, robots, OG), CI con presupuestos |
| F3 · Landing y descarga | Home con S1–S3, página de descarga con datos de la release en el build, funciones |
| F4 · Simulaciones | S4–S10 como islas, paquete compartido con la lógica de la app |
| F5 · Documentación | Todas las páginas de §7 (es), búsqueda, `llms.txt`/`llms-full.txt` |
| F6 · Inglés | Traducción completa y `hreflang` |
| F7 · Cierre | Revisión *impeccable* (critique, audit, DESIGN.md), Lighthouse 100, Observatory A+, axe 0, lanzamiento y Search Console |

## 18. Criterios de aceptación

- Todas las métricas de §2 en el despliegue de producción.
- Ninguna afirmación de la web sin respaldo en la app publicada (o marcada como próxima versión).
- La descarga ofrece el artefacto correcto para Linux y Windows, con sus SHA-256, y nunca un enlace roto tras publicar una release.
- Ningún recurso de terceros cargado por el navegador.
- Proceso *impeccable* completo y `DESIGN.md` escrito.
- Documentación completa en español e inglés con búsqueda funcionando sin servidor.

## 19. Riesgos

| Riesgo | Mitigación |
|---|---|
| La web promete funciones que cambian o no existen | §6 como fuente única, revisión C1 por release, etiquetas de «próxima versión» |
| Simulaciones pesadas que rompen INP y el presupuesto de JS | Islas al verse, presupuestos en CI, reproducción en vez de lógica completa cuando baste |
| Windows sin firmar asusta en la descarga | Explicación clara y honesta del aviso de SmartScreen y verificación con SHA-256; firma cuando haya certificado |
| SEO lento en arrancar (dominio nuevo) | Contenido útil de documentación, datos estructurados, enlace desde el README y la release |
| Desalineación con la identidad de la app | El contrato de dirección define la relación web ↔ app |

## 20. Preguntas abiertas

1. **Dominio** (el autor tiene uno propio) y host definitivo.
2. ¿Analítica? Recomendación: ninguna, o una autoalojada sin cookies (no exige banner).
3. ¿Nombre visible del autor/organización para `Organization`/`Person` y la página de privacidad?
4. ~~¿Se publica ya la 0.1.1 (texto ilimitado, cursor barra, ajustes reorganizados) antes de la web?~~ Resuelto: salieron en la 0.2.0 (23-11-2026).
5. ~~¿Traducción al inglés de la app?~~ Resuelto: la 0.2.0 trae la interfaz en cinco idiomas, incluido el inglés.

## 21. Historial

| Versión | Fecha | Cambios |
|---|---|---|
| 0.1.3 | 23-11-2026 | §6 y §20 contrastados con la app v0.2.0: interfaz en cinco idiomas; texto ilimitado, longitudes hasta 2000 y cursor barra ya publicados |
| 0.1.2 | 20-11-2026 | Presupuesto de JS revisado tras medir la isla del hero: el runtime de Svelte 5 (≈16 KB) se cuenta aparte y una sola vez; home ≤ 60 KB. Las simulaciones copian el aspecto de la app desde su repositorio con datos pregrabados (sin Rust en el build) |
| 0.1.1 | 19-11-2026 | §6 contrastado con el código de `feat/unlimited-text`: privacidad exacta de la IA, 15 lenguajes de código, nombres de los modos de error, detalles de historial, metrónomo, teclado, licencias y artefactos; §6.13 «Planeado» |
| 0.1 | 19-11-2026 | Primer borrador: alcance, contenido completo de la app, documentación, simulaciones, diseño con *impeccable*, SEO 2026 (incluida búsqueda generativa), rendimiento, seguridad, accesibilidad, stack y fases |
