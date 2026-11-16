# Minerva - Protocolo de retorno

Primer prototipo web jugable de [Minerva](https://github.com/mothm4n/minerva). Una misión para un jugador: recuperar los tres subsistemas, encontrar la señal de casa y atravesar el portal antes de que se cierre.

[Jugar en el navegador](https://mothm4n.github.io/minerva/).

La UI adopta la propuesta A - Puente de mando elegida por el usuario: instrumentos arriba y consola ancha debajo, a pantalla completa. Las referencias de Evangelion y la elección están en [REFERENCIAS_UI.md](REFERENCIAS_UI.md).

La investigación de referencias de Evangelion y posibles estilos está en [RESEARCH_UI_EVANGELION.md](RESEARCH_UI_EVANGELION.md). El sistema implementado está documentado en [DESIGN.md](DESIGN.md) y la capa gráfica en [EFECTOS.md](EFECTOS.md).

La consola usa una letra más compacta y los instrumentos incorporan estelas, barrido de señal, anillos giratorios y un campo de energía durante la transferencia.

Cada orden confirma su resultado en una línea persistente y anima el subsistema correspondiente. Carga, escaneo, ajuste, fijación, enlace y transferencia tienen respuestas propias; las lecturas modificadas se resaltan y los rechazos usan rojo. Funciona también con movimiento reducido y sin WebGL. La adaptación de RealityGlitchArt y sus créditos están en [EFECTOS.md](EFECTOS.md).

Las respuestas visuales duran 1,2 segundos y el toroide tiene un arranque de 3,6 segundos con fluctuaciones eléctricas, adaptado del código de **Noise animation - Electric**, de nimitz, aportado por el usuario.

## Versiones del proyecto

- [`main`](https://github.com/mothm4n/minerva/tree/main): versión web en desarrollo.
- [`legacy/openframeworks`](https://github.com/mothm4n/minerva/tree/legacy/openframeworks): código original, sin modificaciones.
- [`v1.0.0-openframeworks`](https://github.com/mothm4n/minerva/tree/v1.0.0-openframeworks): etiqueta del original, «Minerva v1.0 - versión original en openFrameworks», en el commit `2788f1a5d7f4ae83bc206cda9b5095247f1b04f8`.

La web continúa el historial original. `master` se conserva como referencia histórica; el trabajo nuevo se hace desde `main`. Para consultar el original sin sustituir los archivos web:

```sh
git show v1.0.0-openframeworks:src/testApp.cpp
git worktree add --detach ../Minerva-openframeworks v1.0.0-openframeworks
```

La etiqueta permite abrir siempre la misma versión, también desde un clon nuevo.

## Jugar en local

Requiere Node.js 22.12 o posterior. Probado con Node.js 22.22.3.

```sh
npm ci
npm run dev
```

Abre la dirección que muestra Vite, normalmente http://127.0.0.1:5173/minerva/. Pulsa **Start mission**. El botón **Ayuda** abre la guía para preparar la siguiente orden; pulsa Enter en la consola para ejecutarla.

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

La distorsión de emergencia se congela al pausar y deja de dibujarse con la pestaña oculta. Con movimiento reducido solo quedan líneas estáticas, sin desplazamiento, separación de color ni ruido. Al volver a la interfaz principal se retira el efecto. Es una adaptación visual del shader aportado por el usuario; su funcionamiento y atribución están en [EFECTOS.md](EFECTOS.md).

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

La compilación genera `dist/`, una aplicación estática preparada para la ruta `/minerva/` de GitHub Pages. No necesita servidor de juego ni cuentas. Para otro alojamiento, ajusta `base` en `vite.config.ts`.

## Publicación automática

[GitHub Pages](https://mothm4n.github.io/minerva/) publica cada push a `main` mediante `.github/workflows/pages.yml`. El workflow instala las dependencias, ejecuta `ci:local` y publica el mismo `dist/` que se ha probado. Si una comprobación falla, la versión pública anterior se conserva. También admite ejecución manual desde Actions. En Settings > Pages la fuente debe ser **GitHub Actions**.

`https://mothm4n.github.io/minerva/version.json` identifica el commit publicado. Puedes comprobar la web real con las mismas pruebas, en un navegador aislado y sin arrancar un servidor local:

```sh
MINERVA_TEST_URL=https://mothm4n.github.io/minerva/ npm run test:e2e
```

Las partidas se guardan en el navegador bajo el dominio público, separadas de las partidas de localhost. Las pruebas usan su propio almacenamiento y no alteran las partidas personales.

## Controles y CI local

Al preparar un clon para desarrollar, usa la versión de Node de `.nvmrc` (`nvm use`, si utilizas nvm) y ejecuta:

```sh
npm ci
npm run setup
npm run ci:local
```

`setup` instala Chromium y activa los hooks de este repositorio. Se repite después de actualizar Playwright; en Linux puede ser necesario instalar también las dependencias del navegador con `npx playwright install --with-deps chromium`.

| Comando | Comprobación |
| --- | --- |
| `npm run check` | Oxlint, TypeScript y pruebas Vitest, incluidos los hashes de los 16 audios originales. |
| `npm run test:e2e` | Compilación nueva y pruebas de navegador con Playwright. |
| `npm run test:visual` | Contrato visual vigente: composición A, consola compacta, 100 % de sincronía y transferencia sin recortes en seis tamaños y tres idiomas; apertura del portal a 0, 4 y 8 segundos, sin zoom y con pausa. |
| `npm run capture:ui` | El mismo recorrido con capturas y vídeos WebM en `output/ui-capture/`, visibles en el informe HTML. |
| `npm run ci:local` | Todos los controles anteriores, en este equipo. |
| `npm run test:e2e -- --headed` | Las mismas pruebas con el navegador visible. |
| `npx playwright show-report` | Informe del último recorrido de navegador. |

Antes de cada commit se ejecuta `check`. Antes de cada push se exige una copia de trabajo limpia, que las referencias enviadas correspondan al commit abierto, y se ejecuta `ci:local`. Los hooks son locales y cada clon debe activarlos con `setup`; Git permite omitirlos. El workflow de GitHub Pages repite estas comprobaciones antes de publicar. La ejecución local no necesita Docker ni `act`.

Playwright arranca y detiene su propio servidor de producción en `127.0.0.1:4175`. Si el puerto está ocupado falla, sin reutilizar otra aplicación; puedes cambiarlo con `MINERVA_TEST_PORT=4180 npm run test:e2e`. Cada prueba tiene un navegador aislado de las partidas personales. Los recorridos cubren victoria, pausa, recuperación, reinicio confirmado, teclado, idiomas, emergencia, pérdida del contexto WebGL, alternativa sin WebGL, movimiento reducido y tamaños de móvil, tableta y escritorio.

Los tests permanentes están en `tests/browser/`. Los fallos dejan capturas y trazas en `test-results/`, y el informe HTML en `playwright-report/`. Estas carpetas, las grabaciones de `output/` y las revisiones antiguas de `.impeccable/review/` permanecen locales. Las comprobaciones automáticas usan Chromium; los registros históricos de otros navegadores no forman parte de este CI.

La aceptación visual sigue [DESIGN.md - Validación de la interfaz](DESIGN.md#validación-de-la-interfaz). La comparación histórica de Impeccable conserva su resultado original; las adaptaciones solicitadas (consola pequeña, datos reales y animaciones) se evalúan mediante el contrato actual. La valoración del acabado corresponde a la revisión de las capturas.

`capture:ui` compila y abre su propio servidor y navegador con la misma configuración de las pruebas. Se detiene al primer fallo; un vídeo de una prueba fallida sirve para diagnosticar y no acredita una entrega correcta. Playwright finaliza los WebM al cerrar cada contexto; no se necesita conversión ni una ruta de caché de `npx`. El informe reúne las capturas de composición, transferencia y máscara a 0, 4 y 8 segundos. La prueba «grabación real de la apertura completa del portal» usa el reloj normal y graba la aplicación durante toda la apertura de 8 segundos; es el vídeo de entrega. La prueba con reloj controlado es una comprobación reproducible, no una demostración a velocidad real. Cada ejecución sustituye su directorio de resultados: guarda fuera de él cualquier evidencia que quieras conservar.

### Chats simultáneos

Para trabajar en paralelo, asigna una copia y una rama a cada chat antes de editar. Por ejemplo, desde una versión guardada en Git:

```sh
git worktree add -b codex/ajuste-ui ../Minerva-ajuste-ui main
```

Abre ese directorio en el chat correspondiente, instala las dependencias y activa los controles con los pasos anteriores. Usa un nombre de rama y directorio distinto para cada tarea. Si dos recorridos de navegador coinciden, asigna otro puerto con `MINERVA_TEST_PORT=4180 npm run ci:local` o `MINERVA_TEST_PORT=4180 npm run capture:ui`. Los cambios sin commit de otra copia no se trasladan al nuevo worktree. Reúne los cambios terminados en la rama de destino y ejecuta allí `ci:local` antes de publicar; genera las evidencias finales sobre esa misma versión.

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
