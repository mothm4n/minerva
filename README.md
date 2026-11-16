# Minerva - Protocolo de retorno

Primer prototipo web jugable de [Minerva](https://github.com/mothm4n/minerva). Una misión para un jugador: recuperar los tres subsistemas, encontrar la señal de casa y atravesar el portal antes de que se cierre.

La UI adopta la propuesta A - Puente de mando elegida por el usuario: instrumentos arriba y consola ancha debajo, a pantalla completa. Las referencias de Evangelion y la elección están en [REFERENCIAS_UI.md](REFERENCIAS_UI.md).

La investigación de referencias de Evangelion y posibles estilos está en [RESEARCH_UI_EVANGELION.md](RESEARCH_UI_EVANGELION.md). El sistema implementado está documentado en [DESIGN.md](DESIGN.md) y la capa gráfica en [EFECTOS.md](EFECTOS.md).

La consola usa una letra más compacta y los instrumentos incorporan estelas, barrido de señal, anillos giratorios y un campo de energía durante la transferencia. [Ver la grabación de la aplicación](output/playwright/minerva-final.mp4).

Cada orden confirma su resultado en una línea persistente y anima el subsistema correspondiente. Carga, escaneo, ajuste, fijación, enlace y transferencia tienen respuestas propias; las lecturas modificadas se resaltan y los rechazos usan rojo. Funciona también con movimiento reducido y sin WebGL. La adaptación de RealityGlitchArt y sus créditos están en [EFECTOS.md](EFECTOS.md).

Las respuestas visuales duran 1,2 segundos y el toroide tiene un arranque de 3,6 segundos con fluctuaciones eléctricas, adaptado del código de **Noise animation - Electric**, de nimitz, aportado por el usuario. [Ver la demostración actualizada](output/playwright/minerva-toroid.mp4).

## Jugar en local

Requiere Node.js 22.12 o posterior. Probado con Node.js 22.22.3.

```sh
npm ci
npm run dev
```

Abre la dirección que muestra Vite, normalmente http://127.0.0.1:5173. Pulsa **Start mission**. El botón **Ayuda** abre la guía para preparar la siguiente orden; pulsa Enter en la consola para ejecutarla.

En **Ayuda > Idioma** puedes elegir English, 日本語 o Castellano. La interfaz, la guía y los diálogos cambian al instante, sin reiniciar la partida ni borrar la orden en curso. La consola completa, incluidas sus respuestas, bitácora, pistas y pantalla de inicio, permanece siempre en inglés. El idioma se guarda por separado en `minerva.language`; si el navegador impide guardarlo, se mantiene durante la sesión y se muestra un aviso. El idioma inicial es castellano.

## Los tres subsistemas

| Subsistema | Función en la misión |
| --- | --- |
| Ichidai | Carga materia W, activa refrigeración y energiza el toroide. Gestiona los recursos del portal. |
| Nidai | Activa el lector, conecta con el destino, abre el portal y ejecuta la transferencia. |
| Sandai | Explora cinco señales y permite sincronizar frecuencia y amplitud con la baliza de casa. |

La preparación no tiene límite de tiempo. Al abrir el portal quedan 45 segundos; la transferencia necesita 10. Puedes ganar, perder y volver a jugar. Las reglas sustituyen la intervención del game master.

## Controles

- Escribe `help` para consultar las órdenes, `logs` para leer la bitácora y `hint` para recibir una pista.
- Tab completa órdenes; las flechas arriba/abajo recuperan el historial. Esc o Mayús+Tab permiten salir de la consola.
- Sandai admite ratón, controles de teclado y órdenes de texto.
- **Pausar** congela la misión. También se pausa al cambiar de pestaña o recuperar una partida.
- **Sonido** controla el ambiente y los efectos. El audio se activa al iniciar una misión.
- **Emergency** activa o desactiva el protocolo de emergencia: terminal verde, marcos rectos y distorsión de televisión antigua sobre la interfaz, con desplazamiento leve, separación de color, líneas de barrido y ruido inferior. No necesita WebGL. Conserva el progreso, la pausa, el historial y la orden en curso. El reloj y el consumo de recursos mantienen sus reglas; cambiar de vista no pausa la misión. La preferencia dura hasta recargar la página.
- **Reiniciar** pide confirmación antes de borrar el progreso de esa partida.

El progreso se guarda en este navegador bajo la clave `minerva.prototype.v1` de localStorage. No se guarda el historial de la consola. Borrar los datos del sitio elimina la partida; no hay sincronización entre dispositivos.

La distorsión de emergencia se congela al pausar y deja de dibujarse con la pestaña oculta. Con movimiento reducido solo quedan líneas estáticas, sin desplazamiento, separación de color ni ruido. Al volver a la interfaz principal se retira el efecto. Es una adaptación visual del shader aportado por el usuario; su funcionamiento y atribución están en [EFECTOS.md](EFECTOS.md). [Ver la demostración CRT](output/playwright/minerva-crt.mp4).

<details>
<summary>Solución de la primera misión</summary>

Ejecuta una orden por línea:

```text
ichidai plug w_matter
ichidai plug cooling
ichidai plug toroid
nidai set reader
sandai show connections
sandai select 2
sandai tune 3.4 0.62
sandai lock
nidai connect 532924
nidai start portal
nidai transfer
```

También puedes ajustar las dos ondas visualmente. Se exige al menos un 97 % de sincronización.

</details>

## Librerías y estructura

jQuery Terminal 2.48.1 y jQuery 3.7.1 para la consola; Howler 2.2.4 para audio; TypeScript y Vite 8.3.8 para la aplicación. Ondas y portal usan shaders WebGL nativos, con SVG como alternativa. Las tipografías se sirven localmente. El audio utiliza los archivos del Minerva original.

- `src/game.ts`: reglas, órdenes, tiempo y validación del guardado.
- `src/main.ts`: interfaz, terminal y coordinación de la partida.
- `src/i18n.ts`: traducciones de la interfaz y preferencia de idioma; la consola usa directamente los textos ingleses de las reglas.
- `src/audio.ts`: ambiente y efectos con Howler.
- `src/effects.ts` y `src/shaders/`: estado visual, ciclo WebGL y shaders de señal y portal.
- `src/effects.test.ts`: estados, pausa y movimiento reducido de los efectos.
- `src/crt.ts`: distorsión de televisión antigua en emergencia mediante ruido SVG y un lienzo Canvas 2D para las interferencias inferiores.
- [EFECTOS.md](EFECTOS.md): funcionamiento y puntos de extensión de la capa gráfica.
- `src/style.css` e `index.html`: presentación adaptable y controles accesibles.
- `src/game.test.ts`: pruebas de reglas con Vitest.
- `src/audio.test.ts`: secuencias, pausas, silencio y recuperación de errores de audio.

```sh
npm test
npm run build
npm run preview
```

La compilación genera `dist/`, una aplicación estática que se puede servir desde la raíz de un alojamiento web. No necesita servidor de juego, cuentas ni servicios externos.

Vite muestra una advertencia por un `eval` interno de jQuery Terminal. La invocación de métodos desde la salida está desactivada (`invokeMethods: false`), las respuestas se escapan y no se ejecutan órdenes desde el fragmento de la URL.

## Audio original

Los 16 archivos de `public/sounds/` se han recuperado de [bin/data/sounds del repositorio original](https://github.com/mothm4n/minerva/tree/2788f1a5d7f4ae83bc206cda9b5095247f1b04f8/bin/data/sounds), sin recodificar ni modificar. `public/sounds/originals.json` conserva el commit, la ruta, el tamaño y el identificador de contenido de Git de cada archivo para verificar su procedencia. Sustituyen los cinco sonidos sintéticos de la primera versión.

| Momento | Archivos originales |
| --- | --- |
| Arranque de la consola | `turnONmonitors.mp3`, `turnONpc.wav` |
| Pulsaciones, confirmaciones y errores | `Pica.wav`, `CD.wav`, `alert.wav` |
| Ambiente y sistemas de Ichidai | `ambientPC.wav`, `electroON.wav`, `coolON.mp3` |
| Arranque, funcionamiento y cierre del toroide | `toroidStart.mp3`, `toroidLoop.wav`, `toroidend.wav` |
| Apertura, funcionamiento, ambiente y cierre del portal | `portalStart.mp3`, `portalLoop.wav`, `portalAmbient.ogg`, `portalEnd.wav` |
| Apagado al terminar la misión | `powerDown.mp3` |

Las secuencias siguen los usos de `src/testApp.cpp`: el bucle empieza cuando acaba su arranque; al pausar se detiene el audio y al reanudar continúa desde el mismo punto. El cierre detiene las capas anteriores. Los volúmenes se ajustan para la mezcla web. Si terminas la misión durante el arranque del portal, se interrumpe ese sonido y se reproduce el cierre.

Se respeta la grafía real de `toroidend.wav`. Aunque se llama `turnONpc.wav`, su contenido original es MP3; Howler recibe el formato correcto sin alterar el archivo. No se incorporan los tres sonidos del modo de teletransporte antiguo, `coolON_old.wav` ni `powerUp.mp3`, que no tienen una acción correspondiente en esta misión.

## Alcance

Conserva los nombres de los subsistemas, las órdenes principales y los cinco códigos de destino del proyecto original. Los recursos, frecuencias y relato están adaptados a una primera misión autónoma. No reproduce todavía todo el juego antiguo: no incluye contraseñas, consola del master, modo de teletransporte alternativo ni campañas.

No hay instalación sin conexión ni exportación de partidas en esta versión. La interfaz se revisa en Chrome a tamaños de escritorio, tableta y móvil. El modo de emergencia se ha comprobado también en Firefox y WebKit de escritorio. Quedan pendientes las pruebas en Safari como aplicación, un teléfono físico y lectores de pantalla reales.

Las decisiones y la investigación previa están en `DISENO_PROTOTIPO.md`, `REVISION_MINERVA.md` y `RESEARCH_LIBRERIAS_MINERVA.md`.

## Tipografías

IBM Plex Mono para la consola (Fontsource ya presente). Barlow Condensed 600/700 para rótulos, distribuida por [Google Fonts](https://github.com/google/fonts/tree/main/ofl/barlowcondensed), y DSEG7 Classic Bold 0.46 para el reloj, del [proyecto DSEG de keshikan](https://github.com/keshikan/DSEG/releases/tag/v0.46). Fuentes y licencias OFL en `public/fonts/`.
