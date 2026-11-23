---
title: "Solución de problemas"
description: "Qué hacer si falta WebKitGTK, si Windows muestra SmartScreen, si el metrónomo no suena, si la IA no responde o si la app entra en modo temporal."
section: ayuda
order: 2
published: 2026-11-23
updated: 2026-11-23
appVersion: "0.1.0"
features: [ia, metronomo, texto-ilimitado]
---

Esta página reúne los problemas más habituales de PlexusTyping 0.1.0 y cómo resolverlos: la falta de WebKitGTK en Linux, el aviso de SmartScreen en Windows, un metrónomo que no suena, una IA que no responde y el modo temporal. Cada apartado indica el mensaje que verás en la app y el paso que lo soluciona.

## Linux: falta WebKitGTK 4.1

**Síntoma:** al ejecutar `./plexustyping` desde el `.tar.gz`, la app no arranca y el terminal muestra el paquete que hay que instalar (la salida termina con estado 1).

**Solución:** instala WebKitGTK 4.1 y GTK 3 con el comando de tu distribución:

| Distribución | Comando |
|---|---|
| Debian / Ubuntu | `sudo apt install libwebkit2gtk-4.1-0 libgtk-3-0` |
| Fedora | `sudo dnf install webkit2gtk4.1 gtk3` |
| Arch Linux | `sudo pacman -S webkit2gtk-4.1 gtk3` |

El paquete `.deb` instala estas dependencias por ti. Más en [Instalar en Linux (.tar.gz)](/docs/empezar/instalar-linux-tar).

## Windows: aviso de SmartScreen

**Síntoma:** al abrir `PlexusTyping_<versión>_x64-setup.exe`, Windows avisa de un editor desconocido.

**Causa:** el instalador aún no está firmado.

**Solución:** pulsa «Más información» y después «Ejecutar de todas formas». Antes, si quieres, [comprueba la suma SHA-256](/docs/empezar/verificar-descarga) del archivo.

## El metrónomo no suena

Comprueba, en este orden:

1. **Está encendido:** pulsa `F4` o actívalo en «Ajustes → Metrónomo».
2. **Hay un texto listo o en curso:** el metrónomo solo suena entonces. Se para en la pantalla de resultados y cuando la ventana está oculta.
3. **Volumen:** revisa «Volumen» en los ajustes o en el [panel rápido](/docs/metronomo/panel-rapido).
4. **Dispositivo de audio:** el metrónomo usa la salida de audio por defecto del sistema. Si no hay ninguna, verás «Metrónomo: No hay dispositivo de audio». Si falla la reproducción, «Metrónomo: No se pudo reproducir el audio: …».

## La IA no responde

Cuando la IA falla, la app no se detiene: genera el texto desde el caché o el corpus local y muestra el motivo encima del texto.

| Aviso | Qué hacer |
|---|---|
| «Falta la clave de …» | Guarda la clave del proveedor en «Ajustes → IA» |
| «… rechazó la clave» | Revisa la clave y vuelve a guardarla |
| «… rechazó la petición (revisa el modelo)» | Elige otro modelo para ese proveedor |
| «Falta el modelo de …» | Elige un modelo para ese proveedor |
| «Sin conexión con la IA» | Comprueba la conexión a internet |
| «… no respondió a tiempo» | Cada proveedor tiene 30 s y la cadena 60 s; prueba con otro proveedor o más tarde |
| «… está limitando las peticiones» | Espera o añade otro proveedor a la cadena |
| «La IA no devolvió un texto válido» | El texto no cumplía la longitud o los caracteres permitidos; el proveedor tiene un reintento y después se prueba el siguiente |

Usa «Probar conexión» en cada proveedor para comprobarlo sin practicar. Si no se puede guardar una clave, el llavero del sistema no funciona: consulta [Dónde se guardan los datos](/docs/ajustes/donde-se-guardan-los-datos). Con ChatGPT, un error del plan detiene la cadena y nunca pasa a usar tus claves: consulta [Iniciar sesión con ChatGPT](/docs/ia/iniciar-sesion-con-chatgpt).

En Linux, si ejecutas la app desde un terminal, cada intento fallido se registra en la salida de errores, sin la clave.

## «Sin guardar: modo temporal»

**Síntoma:** la cabecera muestra «Sin guardar: modo temporal».

**Causa:** la base de datos no se pudo abrir. La app funciona, pero lo que practiques se pierde al cerrarla.

**Solución:** pasa el ratón por el aviso para ver el error exacto. El archivo es `plexustyping.sqlite3`, en la carpeta de datos de la app; la ruta de cada sistema está en [Dónde se guardan los datos](/docs/ajustes/donde-se-guardan-los-datos).

## Texto ilimitado (próxima versión 0.1.1)

La longitud «Ilimitado» llega en la versión 0.1.1. Si la continuación del texto no llega, la app avisa con «No se pudo continuar el texto: …; reintentando…» y vuelve a pedirla; al final del texto espera con «Generando más texto…». Consulta [Longitud y texto ilimitado](/docs/practicar/longitud-y-texto-ilimitado).

## ¿No está tu problema?

Consulta [Informar de un error](/docs/ayuda/informar-de-un-error).
