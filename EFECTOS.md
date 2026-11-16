# Efectos de Minerva

Las comprobaciones repetibles actuales están en `tests/browser/`, con instrucciones en [README.md](README.md#controles-y-ci-local). Los enlaces a `output/` y `.impeccable/review/` de los registros históricos apuntan a evidencias locales que no se distribuyen en Git.

La capa gráfica principal usa WebGL 1 nativo sin añadir una librería. La interfaz, las etiquetas, el reloj y los controles siguen siendo HTML accesible. Los tres lienzos dibujan la señal, el portal y el arranque del toroide dentro de Ichidai. El protocolo de emergencia usa una adaptación independiente de televisión antigua con SVG y Canvas 2D, sin necesitar WebGL.

## Flujo

`src/main.ts` mantiene un único ciclo de animación: actualiza la partida y llama a `effects.render(...)` y `crt.render(...)`, sobre instancias creadas una sola vez. `effectState` transforma el estado del juego en valores para los shaders. El reloj de presentación CRT avanza desde ese mismo ciclo y se congela con la pausa. No hay una segunda simulación ni temporizadores independientes.

Las órdenes pasan además por `commandFeedback`, que compara el estado anterior con el resultado real. `createFeedback` reproduce las transiciones HTML con Web Animations API, sin bucles ni temporizadores propios. `effects.trigger` inicia un impulso de 1200 ms en el shader del instrumento correspondiente, medido con el tiempo de misión.

## Respuesta por orden

Las respuestas generales mantienen su énfasis durante 1,2 segundos. Los marcos tienen mayor contraste, las lecturas se sostienen resaltadas y los cambios operativos incorporan un rótulo centrado sobre el instrumento, dejando libres sus valores y estados. Los medidores recorren el cambio durante 0,9 segundos.

- Toda orden no vacía recibe una confirmación persistente sobre la consola con el subsistema y la primera línea de su respuesta. Incluye consultas, ayuda, bitácora, borrado, pausa, reanudación y solicitud de reinicio. El texto usa `textContent` y sigue disponible sin animación.
- Ichidai: barrido ascendente al cargar y resalte de los medidores que cambian, incluido el gasto de energía. El toroide confirma su activación en su propio indicador. Repetir una activación ya completada solo confirma la consulta.
- Sandai: barrido de adquisición al explorar, separación cromática y desplazamiento horizontal de líneas al seleccionar o ajustar, y marcas que convergen al fijar. Se resaltan frecuencia, amplitud, sincronía y selección. La fijación señala también el código que aparece en Nidai.
- Nidai: impulso radial al activar el lector, enlazar y abrir. La transferencia invierte el recorrido hacia el centro. Los indicadores de lector, destino, portal, reloj y transferencia se resaltan cuando cambian.
- Los rechazos usan rojo y una franja de alerta, sin fingir cambios de recursos ni activaciones. Las órdenes repetidas interrumpen la respuesta anterior sobre el mismo elemento, sin acumular una cola.
- Los botones de selección y los ajustes de frecuencia y amplitud reciben la misma respuesta que sus órdenes equivalentes. No cambia la duración del portal ni ninguna regla de la misión.

Los impulsos gráficos se limitan a 1200 ms. En la interfaz principal, los textos permanecen nítidos, sin distorsión ni movimiento de cámara. Con movimiento reducido se eliminan barridos, desplazamientos y glitch: quedan una transición suave de 300 ms y la confirmación escrita. La respuesta HTML funciona también sin WebGL. La pestaña oculta cancela las transiciones breves; los lienzos fuera de pantalla omiten el dibujo. La pausa congela el tiempo de los shaders, mientras la confirmación breve de la propia orden sigue siendo legible. En emergencia se omite esta respuesta animada por orden y se conserva su texto; la distorsión CRT solicitada por el usuario se describe más abajo.

### Referencias y adaptación

El tratamiento de fósforo, generación de señal y glitch sigue la referencia [Cyberpunk style shader de XiaoZhe Jin](https://jinxiaozhe.artstation.com/projects/QzOdad), adaptada a la paleta y geometría de Evangelion ya elegidas para Minerva.

Se han consultado y adaptado los grafos `ScanLineJitterHMaterial.usda` y `RGBSplitMaterial.usda` de [RealityGlitchArt, de XanderXu](https://github.com/XanderXu/RealityGlitchArt). Sus desplazamientos UV por ruido con umbral y separación de canales se expresan aquí en GLSL sobre ondas procedurales: no requieren texturas ni el entorno de Apple. La adaptación usa un impulso por orden, desplazamiento acotado y la paleta del juego. Su licencia MIT se conserva en [public/licenses/RealityGlitchArt-MIT.txt](public/licenses/RealityGlitchArt-MIT.txt). No cambia la licencia del remolino del portal documentada más abajo.

| Valor | Uso |
| --- | --- |
| `phase` | Movimiento derivado del tiempo de misión. Cero con movimiento reducido. |
| `signal` | Frecuencia y amplitud del jugador y de la señal seleccionada. La escala horizontal representa un segundo. |
| `visible` | Oculta las curvas hasta que exista una señal. |
| `portal` | Apertura, progreso, alerta de últimos 12 segundos y transición de apertura de 8 segundos. |
| `activity` | Reactor activo, sincronía, avance de transferencia y permiso de movimiento. |
| `image` | Imagen del destino seleccionado, asignada en `WORLDS` y visible solo durante la apertura y transferencia. |

La frecuencia y amplitud dibujadas son las que usa la sincronización del juego. El arco del portal indica tiempo disponible cuando está abierto, progreso durante la transferencia y cierre al perder. Al completar el retorno queda lleno. La apertura no incluye un círculo azulado expansivo. La transición se elimina con movimiento reducido; los cambios reales de valores siguen visibles.

## Efectos visibles

- Sandai: curvas luminosas con tres estelas de fósforo, barrido vertical y un punto luminoso que recorre las ondas. La coincidencia de ambas señales refuerza el brillo.
- Nidai: anillos segmentados en rotación desde que funciona el reactor y un emblema de núcleo hexagonal con tres brazos angulares anidados, también presente en SVG. Al abrir, el emblema se desvanece y revela la imagen del destino con un remolino luminoso alrededor. La imagen conserva sus proporciones y el arco exterior sigue indicando tiempo y transferencia. Al cerrar, completar o reiniciar desaparece el paisaje.
- La textura de fósforo queda limitada a los instrumentos. El grosor y el halo se reducen en lienzos pequeños para conservar la geometría.

Los movimientos instrumentales derivan del tiempo de misión. Pausar congela también el barrido, las estelas, los anillos, el remolino y la apertura de la imagen. Con movimiento reducido se conserva una representación estática de los valores y del portal abierto.

## Encendido del toroide

`ichidai plug toroid` inicia una secuencia visual de 3,6 segundos en Ichidai: carga ámbar, fluctuaciones eléctricas y estabilización menta. El campo aparece sobre los medidores, conservando visibles los valores numéricos; el rótulo del toroide indica Cargando, Confinando y Estable. La regla de activación sigue siendo inmediata y la animación no bloquea las órdenes posteriores.

Se adapta **Noise animation - Electric**, de **nimitz** (stormoid.com, @stormoid), [Shadertoy ldlXRS](https://www.shadertoy.com/view/ldlXRS), a partir del código original aportado por el usuario el 15 de noviembre de 2026. Se elige por su dominio desplazado por ruido turbulento y sus anillos, adecuados para representar el confinamiento de un toroide. Se consideró también Plasma Globe, pero su composición esférica no corresponde tan directamente al instrumento. La consulta directa de Shadertoy estuvo bloqueada; antes de recibir el código original se consultaron adaptaciones públicas, sin incorporar sus cabeceras de licencia contradictorias.

`src/shaders/reactor.glsl` conserva las cinco octavas, las dos llamadas de desplazamiento del dominio y la función de anillos logarítmicos. Sustituye `iChannel0` por ruido procedural, limita divisiones y el centro, acota la emisión y encierra el efecto en un anillo con contención hexagonal. Al acercarse al final desaparece la inestabilidad y el campo se vuelve menta. No se descargan texturas ni se añaden dependencias.

El shader adaptado se distribuye bajo **CC BY-NC-SA 3.0**, como el original: [atribución y cambios](public/licenses/Noise-animation-Electric.txt), [licencia](https://creativecommons.org/licenses/by-nc-sa/3.0/). El crédito está también en la cabecera del shader.

El arranque tiene su propia marca de tiempo de misión: pausa y pestaña oculta lo congelan, otras órdenes no lo cancelan, una activación repetida no lo reinicia y reiniciar la partida lo borra. No se reproduce al recuperar una sesión ya energizada. Con movimiento reducido se muestra directamente Estable. Sin WebGL se conserva el indicador y la geometría SVG. El tercer lienzo solo dibuja durante el arranque y estando visible.

[Demostración del arranque y las animaciones reforzadas](output/playwright/minerva-toroid.mp4).

## Imagen por mundo y procedencia del portal

Cada entrada de `WORLDS` en `src/game.ts` tiene una propiedad `image`. Por ahora las cinco apuntan a `public/worlds/volcanic-citadel.png`, la ciudadela volcánica aportada por el usuario. Para cambiar un mundo basta con añadir su imagen a `public/worlds/` y actualizar esa ruta. La misión sigue permitiendo conectar únicamente con casa, señal 2, por decisión del usuario.

El remolino adapta [BlackHole (swirl, portal)](https://www.shadertoy.com/view/lcfyDj), de **misterprada**, con referencia visual de [celestianmaze](https://x.com/cmzw_/status/1787147460772864188). Se conserva su ruido simplex, las cinco octavas y la torsión logarítmica. La adaptación limita el centro para evitar valores indefinidos y usa el mismo campo de ruido para el borde luminoso y una máscara irregular y difuminada sobre la fotografía. La apertura de 8 segundos acelera y frena suavemente: solo se expande el umbral de la máscara desde el centro. La fotografía y las coordenadas del remolino mantienen siempre su escala final, sin zoom. La fotografía se dibuja como imagen HTML, por lo que no necesita texturas WebGL y sigue disponible si falla el contexto.

El shader adaptado se distribuye bajo **CC BY-NC-SA 3.0**, la licencia predeterminada de [Shadertoy](https://www.shadertoy.com/terms): atribución, uso no comercial y compartir las adaptaciones bajo la misma licencia. [Texto de la licencia](https://creativecommons.org/licenses/by-nc-sa/3.0/). Los créditos también están en `src/shaders/portal.glsl`. Esta licencia corresponde al shader, no atribuye derechos sobre la imagen aportada por el usuario.

## Televisión antigua en emergencia

El usuario pidió aplicar al protocolo de emergencia la distorsión del shader que aportó el 15 de noviembre de 2026. Esta petición permite expresamente postprocesar también el texto en esa variante. La interfaz principal conserva su tratamiento nítido. El cambio de presentación mantiene progreso, pausa, historial, orden en curso y reglas de la misión; no detiene el reloj ni el consumo de recursos.

`src/crt.ts` traslada a TypeScript el ruido simplex y las fórmulas temporales del GLSL aportado. Es una adaptación visual sobre el HTML real, no una ejecución literal del shader: no captura el navegador para alimentar `iChannel0`, no hace capturas de pantalla y no duplica el DOM. El filtro SVG `#crt-screen` de `index.html` toma `SourceGraphic`, aplica desplazamiento por filas y vertical, separa rojo y azul y recompone los canales. La raíz añade líneas de barrido, una banda que recorre la pantalla y ruido concentrado en la parte inferior. Los controles siguen siendo los mismos elementos HTML.

`feTurbulence` genera una columna de ruido que `feTile` extiende por filas. `feDisplacementMap` usa escala `6`, por lo que el desplazamiento local queda acotado a `3px` por eje. El salto vertical de la imagen completa llega hasta `4,5px`. Rojo y azul se desplazan `1px` en sentidos opuestos. En la prueba de Firefox, los desplazamientos inferiores a un píxel se redondeaban a cero. Las líneas estáticas usan una franja de `1px` cada `4px`. La banda móvil mide `200px` de alto y avanza a `35px/s`.

El ruido SVG y el lienzo Canvas 2D de `128 × 64` para la interferencia inferior se actualizan a un máximo de `24fps`. La pausa congela el efecto. Con la pestaña oculta no se dibujan nuevos fotogramas. Salir de emergencia retira el filtro y la interferencia. Con movimiento reducido o si falla el lienzo, se mantiene la presentación básica. El efecto funciona sin WebGL.

La función simplex procede de **Ian McEwan / Ashima Arts**. Su atribución y licencia MIT se conservan en [public/licenses/Ashima-noise-MIT.txt](public/licenses/Ashima-noise-MIT.txt), con referencia al [repositorio de Ashima](https://github.com/ashima/webgl-noise). Se mantiene la permutación `+1` del código aportado. La autoría y la licencia del shader completo aportado por el usuario no están identificadas; la licencia MIT documentada corresponde al ruido simplex y no se extiende al conjunto del shader por inferencia.

## Archivos para ampliar efectos

- `src/shaders/instrument.frag`: trazos, estelas, barrido, anillos, brazos, arco y composición del portal.
- `src/shaders/reactor.glsl`: adaptación de Noise animation - Electric, campo toroidal y estabilización.
- `src/shaders/portal.glsl`: adaptación del remolino de Shadertoy, incorporada al shader del instrumento.
- `src/shaders/instrument.vert`: triángulo que cubre cada lienzo.
- `src/effects.ts`: valores del juego, creación y recuperación de recursos WebGL, tamaño del lienzo y liberación.
- `src/feedback.ts`: relación entre órdenes, cambios reales, lecturas afectadas y respuestas HTML interrumpibles.
- `src/crt.ts`: reloj de la distorsión, ruido inferior, pausa y alternativa estática.
- `index.html`: filtro SVG `#crt-screen`, que desplaza y separa canales del HTML real en emergencia.
- `src/style.css`: transiciones breves de controles y medidores; se desactivan con movimiento reducido.

Para añadir una respuesta a un estado, derivar su valor en `effectState` y consumirlo en el shader. Mantener la información necesaria para jugar también en HTML/SVG. Los shaders se importan como texto con `?raw` y la compilación los incorpora al paquete.

## Pausa y compatibilidad

El tiempo visual se detiene con la misión. La pestaña oculta pausa la partida y no dibuja. Si los valores no cambian, se omite el dibujo. El tamaño usa `ResizeObserver` y la densidad de píxeles se limita a 1,5 para contener el coste en pantallas de alta resolución. Se solicita el contexto de bajo consumo.

Si WebGL falta, falla la compilación o se pierde el contexto, se muestran las curvas y anillos SVG. El portal abierto conserva la imagen del destino con una máscara suave estática y sin el emblema superpuesto. Al recuperar el contexto se recrean shaders, programa, buffer y uniformes. La partida no depende del renderizador. El recargado de desarrollo libera sus recursos.

Los textos de la interfaz principal no reciben desenfoque ni efectos de postprocesado. La distorsión CRT sobre el texto es una excepción solicitada por el usuario, limitada a emergencia y desactivada con movimiento reducido. No se añaden destellos de pantalla ni movimiento de cámara.

## Comprobación

La prueba mantenida de apertura está en `tests/browser/visual.e2e.ts`: usa el reloj del navegador para comprobar 0, 4 y 8 segundos, geometría fija de la imagen, transparencia central creciente del shader y pausa. `npm run capture:ui` adjunta las tres capturas y añade una grabación de toda la apertura con el reloj normal, desde la aplicación real. El grabador aislado `output/playwright/record-portal.html` y los vídeos enlazados a continuación son evidencias históricas; no se usan para comprobar ni grabar nuevas versiones.

En Firefox 159.0 de escritorio se compararon capturas con y sin filtro y con los canales alineados. La prueba confirmó la distorsión y la separación RGB. Se completó una misión alternando Emergencia durante la preparación y la transferencia. Se comprobaron el rechazo de una orden fuera de secuencia, el avance del reloj y el consumo de recursos. El modo conservó la pausa, el historial y la orden en curso, y la victoria permaneció al recargar. [Resultados de Firefox](output/playwright/crt-firefox-check.json) · [Captura](output/playwright/firefox-crt-desktop.png).

Corrección del CRT en WebKit. `output/playwright/verify-emergency.js` comprueba los píxeles de la cabecera con el filtro activo y desactivado, verifica el contraste del botón de sonido y completa una misión alternando los modos sin usar el portapapeles. Pasó en WebKit 18.4 y 27.2 y en Chromium. En los tres, la barra de energía al 55 % ocupó 154 de los 283 píxeles comprobados. [Resultados](output/playwright/crt-webkit-check.json) · [Captura de WebKit 18.4](output/playwright/crt-webkit-18.4.png).

Distorsión de televisión antigua en emergencia (15 de noviembre de 2026): 30 pruebas y compilación correctas. La integración en Chrome completó una misión ganada y conservó ese resultado al recargar. Alternar la presentación mantuvo progreso, reloj, historial, borrador y pausa; el tiempo y los recursos siguieron sus reglas. Comprobados la animación y su congelación al pausar, la retirada del filtro y los mapas al salir, la suspensión y recuperación del dibujo WebGL, el tratamiento estático con movimiento reducido, el efecto sin WebGL, la ayuda y el control por teclado. Las dos presentaciones se comprobaron a anchos de `320px`, `390px`, `768px` y `1100px` sin desbordamiento horizontal; en emergencia tampoco se solaparon las lecturas comprobadas. No se detectaron errores de JavaScript. Registro: [crt-check.log](output/playwright/crt-check.log).

Capturas: [escritorio CRT](output/playwright/crt-desktop.png), [móvil CRT](output/playwright/crt-mobile.png), [tableta CRT](output/playwright/crt-tablet.png) e [interfaz principal restaurada](output/playwright/crt-restored.png). Estos resultados proceden de Chrome de escritorio con tamaños de ventana simulados; no se han probado Safari, Firefox ni un móvil físico.

Con CRT activo en Chrome de escritorio a `1440 × 900`, una muestra de 120 intervalos entre frames, tomada sin grabación simultánea, dio mediana de `16,7ms`, percentil 95 de `17,4ms` y máximo de `17,6ms`. Son intervalos del ciclo de animación, no el tiempo aislado de ejecución del efecto ni una garantía de rendimiento móvil. Registro: [crt-record.log](output/playwright/crt-record.log); script: `output/playwright/record-crt.js`. [Demostración CRT de 11,2 segundos](output/playwright/minerva-crt.mp4).

Refuerzo de animaciones y toroide (15 de noviembre de 2026): 25 pruebas correctas. Comprobados arranque, rechazo, repetición sin reactivación, pausa, continuidad al activar el lector, movimiento reducido y alternativa sin WebGL. Capturas de escritorio y móvil sin desbordamiento. Muestra de 44 intervalos de frame durante el shader en Chrome de escritorio: mediana 16,7 ms y percentil 95 de 17,7 ms; no constituye una garantía de rendimiento en dispositivos móviles. Script: `output/playwright/verify-toroid.js`.

Animaciones por orden (15 de noviembre de 2026): 23 pruebas y compilación correctas. Partida completa en Chrome con ambas superficies WebGL activas, respuestas para operaciones y utilidades, rechazo, repetición de órdenes, selección por botón, ajuste por controles, pausa y cancelación del reinicio. Comprobados movimiento reducido sin WebGL, recuperación tras perder el contexto, órdenes rápidas sin animaciones pendientes y un error largo a ancho móvil sin desbordamiento. Capturas a 1440 × 900, 768 × 1024 y 390 × 909. Se corrigieron el desbordamiento transitorio del barrido y el tamaño del estado sin señal. [Demostración de 28 segundos](output/playwright/minerva-commands.mp4). Scripts: `output/playwright/verify-commands.js` y `output/playwright/confirm-commands.js`. No se han probado teléfonos físicos, Safari ni Firefox en esta revisión.

Revisión del portal con paisaje (15 de noviembre de 2026): 18 pruebas y compilación correctas. Comprobación en navegador de apertura, pausa, transferencia completa, cierre y reinicio, con WebGL activo y sin errores en consola; revisión del portal a ancho móvil. La prueba de `createEffects` cubre también la imagen y apertura sin contexto WebGL, los estados cerrados y el movimiento reducido. [Grabación anterior de la máscara irregular (apertura de 2,4 s)](output/playwright/portal-opening-mask.mp4).

`npm test` incluye estados de señal y portal, actividad, pausa y movimiento reducido. La comprobación anterior de navegador ejercita dibujo real, pérdida/restauración del contexto, alternativa sin WebGL y una partida completa en `.impeccable/review/refinement/verify.js`, con resultados y capturas en esa carpeta. `capture-confirm.js` comprueba además el historial tras cambiar de tamaño. La comprobación CRT posterior se registra en el archivo enlazado más arriba.

Grabación de una partida real a 1600 × 900 y 30 fps: [Minerva con efectos](output/playwright/minerva-final.mp4). Muestra sintonización, fijación, apertura y transferencia; el audio está desactivado durante la grabación.

Referencias de plataforma: [buenas prácticas de WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices), [restauración del contexto](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextrestored_event) y [WEBGL_lose_context](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_lose_context).
