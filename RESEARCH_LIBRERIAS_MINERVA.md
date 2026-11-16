# Minerva - investigación de bibliotecas para la versión web

Fecha de consulta: 15 de noviembre de 2026. Alcance confirmado: juego para un solo jugador, en navegador, con una línea de comandos simulada. Contexto funcional: [revisión del original](REVISION_MINERVA.md).

Las capacidades y versiones se contrastaron con documentación, código y publicaciones oficiales. Las valoraciones de encaje y la selección de tecnologías son recomendaciones para Minerva, no resultados de una prueba de rendimiento o de accesibilidad.

## Recomendación ejecutiva

**Para la primera Minerva jugable elegiría jQuery Terminal, TypeScript, Vite y Howler.js.** Dibujaría las ondas con SVG nativo y mantendría las reglas en una pequeña máquina de estados escrita en TypeScript. Guardado local con la API del navegador y pruebas con Vitest y Playwright.

La elección de terminal merece distinguir dos necesidades:

- **Una consola de juego con órdenes propias:** jQuery Terminal ya incluye edición, historial, autocompletado y prompts. Es mi primera candidata para reducir el trabajo de interacción. Sus órdenes pueden resolverse íntegramente en JavaScript del navegador. [Funciones y modelo de comandos](https://github.com/jcubic/jquery.terminal/blob/2.48.1/README.md#features), [documentación oficial](https://terminal.jcubic.pl/).
- **Emulación fiel de un terminal VT/ANSI:** elegiría xterm.js si necesitamos secuencias de terminal e interfaces de texto de pantalla completa. `xterm-readline` puede añadir edición e historial; todavía habría que implementar las órdenes y el completado del juego. [API de xterm](https://xtermjs.org/docs/api/terminal/classes/terminal/), [xterm-readline](https://github.com/strtok/xterm-readline/tree/b4d3b96311850f34b5f0e6eae121aa9f65eb34d5).

Mi criterio es que Minerva necesita sobre todo la primera experiencia: `ichidai plug cooling` debe cambiar el estado del juego, y la onda y los indicadores pueden ser elementos web independientes. No hay una necesidad funcional actual que justifique conectar una shell real.

## Comparación de terminales

| Opción | Lo que aporta | Lo que queda por hacer | Veredicto para Minerva |
| --- | --- | --- | --- |
| **jQuery Terminal** | Editor de línea, historial, búsqueda de historial, completado, prompts, estilos y comandos locales. [Funciones](https://github.com/jcubic/jquery.terminal/blob/2.48.1/README.md#features) | Reglas y validación de órdenes; integración y comprobación de accesibilidad. Introduce jQuery. [Dependencias](https://github.com/jcubic/jquery.terminal/blob/2.48.1/package.json) | **Primera candidata para la consola de juego.** |
| **xterm.js + xterm-readline** | Emulación, Unicode/IME, selección, scrollback y temas; Readline añade edición e historial. [xterm](https://github.com/xtermjs/xterm.js/blob/6.0.0/README.md), [Readline](https://github.com/strtok/xterm-readline/tree/b4d3b96311850f34b5f0e6eae121aa9f65eb34d5) | Integrar el complemento, completado e intérprete del juego. | **Mejor alternativa si la fidelidad VT/ANSI es un requisito.** |
| **HTML con input o textarea y registro de mensajes** | Entrada y contenido HTML; `role="log"` permite anunciar mensajes añadidos con prioridad moderada. [Rol log](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/log_role) | Implementar historial, completado, atajos y apariencia de terminal; validar foco y anuncios. | **Alternativa sencilla si la consola acaba siendo muy personalizada.** No replicar un editor completo sin necesidad. |
| **ghostty-web** | Parser de Ghostty compilado a WASM y objetivo de compatibilidad con la API de xterm.js; requiere inicialización del módulo. [README](https://github.com/coder/ghostty-web/blob/main/README.md) | La misma capa de órdenes/editor que en un emulador, más integrar y cargar el WASM. La compatibilidad completa debe comprobarse. | **Reservar.** No encuentro una ventaja necesaria para las órdenes y curvas de Minerva. |
| **term.js** | Emulador anterior del que deriva xterm.js; el propio README indica que ya no se mantiene y remite a xterm.js. [Aviso del proyecto](https://github.com/chjj/term.js#readme) | Asumir mantenimiento de una base sin soporte declarado. | **Descartar para un proyecto nuevo.** |

xterm.js tampoco necesita un servidor para Minerva: se pueden consumir `onData` y producir `write` localmente. Es una decisión de integración basada en su API. [API oficial](https://xtermjs.org/docs/api/terminal/classes/terminal/).

### jQuery Terminal: por qué la elegiría y qué hay que cuidar

El estilo es personalizable. El README documenta caracteres chinos y japoneses, pero **califica el soporte móvil como experimental**. Esto requiere validar móvil si entra en alcance; no invalida su uso en ordenador. [README](https://github.com/jcubic/jquery.terminal/blob/2.48.1/README.md#features).

`2.48.1` incluye tipos TypeScript y declara `jquery: ^3.7.1` y `@types/jquery` como dependencias. Respetaría ese rango sin forzar jQuery 4 ni añadir tipos específicos de Terminal. [Manifest](https://github.com/jcubic/jquery.terminal/blob/2.48.1/package.json).

`jquery-mousewheel` **no es obligatorio** en esta versión: el código usa ese plugin si existe y, en caso contrario, conecta el evento de rueda disponible en el navegador. No lo añadiría. [Implementación de rueda](https://github.com/jcubic/jquery.terminal/blob/2.48.1/js/jquery.terminal.js#L13555).

Usaría una función local con una tabla cerrada de órdenes. El completado debe ofrecer solo información ya descubierta. La API permite completar mediante una función o lista y solicitar entradas con otro prompt. [API](https://terminal.jcubic.pl/api_reference.php).

El código oculta al lector de pantalla el cursor visual duplicado y usa un textarea en escritorio. **Eso no demuestra accesibilidad completa.** Hay que probar mensajes, claves, foco y navegación. [Entrada y cursor](https://github.com/jcubic/jquery.terminal/blob/2.48.1/js/jquery.terminal.js#L2392).

Las entradas del jugador tienen que mostrarse literalmente. Propuesta: aplicar `$.terminal.escape_formatting(texto)` y usar `echo` con `raw: false`, `exec: false`, `formatters: false` y `convertLinks: false`; mantener desactivados `invokeMethods`, `execHash` y `anyLinks`. Esto evita habilitar características de interpretación que no necesita Minerva. Hay que verificar el comportamiento con texto que contenga HTML, corchetes, enlaces y secuencias de control. [Escape de formato](https://github.com/jcubic/jquery.terminal/blob/2.48.1/js/jquery.terminal.js#L6527), [opciones de salida](https://github.com/jcubic/jquery.terminal/blob/2.48.1/js/jquery.terminal.js#L8951), [advertencias del proyecto](https://github.com/jcubic/jquery.terminal/blob/2.48.1/README.md#security).

El historial de la consola no es el guardado de la misión. Propongo mantener un estado de juego independiente; tampoco conservar las claves narrativas en el historial de órdenes.

### xterm.js: cómo lo usaría si elegimos emulación completa

La combinación sería **`@xterm/xterm` + `@xterm/addon-fit` + `xterm-readline`**, junto con el CSS de xterm. FitAddon ajusta filas y columnas al contenedor. xterm incluye tipos y no declara dependencias de ejecución en 6.0.0. [Addons](https://xtermjs.org/docs/guides/using-addons/), [manifest](https://github.com/xtermjs/xterm.js/blob/6.0.0/package.json).

El complemento Readline aporta edición multilínea, Unicode e historial. El manifest examinado declara versión `2.0.0`, licencia MIT, tipos integrados y compatibilidad `@xterm/xterm: ^5.5.0 || ^6.0.0`. No encontré una API de autocompletado documentada. Es **versión del repositorio**, no una comprobación de la última publicación npm; el changelog la fecha el 2 de noviembre de 2026. [Código y README](https://github.com/strtok/xterm-readline/tree/b4d3b96311850f34b5f0e6eae121aa9f65eb34d5), [manifest](https://github.com/strtok/xterm-readline/blob/b4d3b96311850f34b5f0e6eae121aa9f65eb34d5/package.json), [changelog](https://github.com/strtok/xterm-readline/blob/b4d3b96311850f34b5f0e6eae121aa9f65eb34d5/CHANGELOG.md).

No cargaría otros addons inicialmente. Search busca en la salida, WebLinks maneja enlaces y WebGL ofrece otro renderizador; son capacidades distintas del completado de órdenes. [Addons](https://github.com/xtermjs/xterm.js/tree/6.0.0/addons).

`screenReaderMode` y `minimumContrastRatio` son opciones explícitas que hay que configurar y probar. La compatibilidad oficial apunta a versiones recientes de Chrome, Edge, Firefox y Safari; no debe transformarse en una promesa de que todo teclado virtual o lector de pantalla funcionará sin pruebas. [Opciones](https://xtermjs.org/docs/api/terminal/interfaces/iterminaloptions/), [navegadores](https://github.com/xtermjs/xterm.js/blob/6.0.0/README.md#browser-support).

### ghostty-web: alternativa actual, sin ventaja clara en este alcance

La release `0.4.0` incluye iOS e IME; el README describe compatibilidad de API como objetivo. No asumiría que cualquier integración xterm funciona cambiando el import. Lo evaluaría si apareciera un requisito de emulación que los anteriores no cubran. Es una valoración de alcance, no de rendimiento. [Release](https://github.com/coder/ghostty-web/releases/tag/v0.4.0), [README](https://github.com/coder/ghostty-web/blob/main/README.md).

## Sonido, ondas, estado y estructura de la aplicación

| Área | Selección recomendada | Motivo y alternativa |
| --- | --- | --- |
| **Audio de ambientación y efectos** | **Howler.js** | Reproduce archivos, gestiona bucles, volumen, fundidos y eventos de carga/reproducción; usa Web Audio con alternativa HTML5 Audio. Encaja con los sonidos existentes. [Documentación oficial](https://github.com/goldfire/howler.js/tree/v2.2.4#documentation) |
| **Síntesis o puzles musicales** | Tone.js solo si el diseño lo pide | Aporta sintetizadores, efectos y planificación musical mediante un transporte. Para reproducir los efectos actuales no usaría esa capa. [Tone.js](https://github.com/Tonejs/Tone.js/blob/15.1.22/README.md) |
| **Audio mínimo** | Web Audio nativo si quedan pocos sonidos | Permite construir un grafo de fuentes y efectos sin biblioteca. Mi valoración: si recuperamos muchas capas de audio, Howler evita escribir su gestión; para unos pocos pitidos, la API nativa puede bastar. [Web Audio](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) |
| **Ondas de Sandai** | **SVG nativo** | El original genera una curva senoidal a partir de frecuencia, amplitud y tiempo. Unos pocos paths son una representación directa; no hacen falta gráficos estadísticos. [Curva original](https://github.com/mothm4n/minerva/blob/2788f1a5d7f4ae83bc206cda9b5095247f1b04f8/src/testApp.cpp#L2150), [SVG](https://developer.mozilla.org/en-US/docs/Web/SVG) |
| **Lógica de partida** | **Estados explícitos y función de transición en TypeScript** | Decisión de diseño: una misión corta no necesita una biblioteca de estado. Separar órdenes, reglas y efectos permite comprobar el recorrido sin dibujar la interfaz. |
| **Múltiples misiones con lógica paralela** | XState si se alcanza esa complejidad | Ofrece máquinas de estados, actores, condiciones, transiciones temporizadas y persistencia de snapshots. Lo adoptaría cuando esa estructura reduzca código real, no por anticipación. [XState](https://stately.ai/docs/xstate), [tiempos](https://stately.ai/docs/delayed-transitions), [persistencia](https://stately.ai/docs/persistence) |
| **Desarrollo y distribución** | **Vite + TypeScript, plantilla vanilla-ts** | Vite incluye esa plantilla y genera archivos estáticos para producción. Es suficiente para una pantalla con consola y tres subsistemas. [Guía](https://vite.dev/guide/) |
| **Guardar partida** | **localStorage** | Persiste valores de texto por origen entre sesiones; puede estar bloqueado. Para el estado pequeño propuesto usaría JSON versionado y validado. [API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) |
| **Pruebas de reglas y tiempos** | **Vitest** | Se integra con Vite y dispone de temporizadores simulados. Probaría secuencia válida, fallos, recursos y reintentos. [Guía](https://vitest.dev/guide/), [reloj simulado](https://vitest.dev/guide/mocking/timers) |
| **Recorrido completo en navegador** | **Playwright** | Permite probar Chromium, Firefox y WebKit. Usaría pocos recorridos completos, incluyendo entrada de comandos y recuperación al recargar. [Documentación](https://playwright.dev/docs/intro) |

**Howler necesita validar compatibilidad actual:** su release observada es de septiembre de 2023. Eso no prueba abandono ni compatibilidad con navegadores de 2026. Probaría las capas reales de audio y su recuperación tras pausar. [Release](https://github.com/goldfire/howler.js/releases/tag/v2.2.4).

Para las ondas mantendría controles y valores también en HTML. Si las animaciones crecieran y una medición justificase cambiar, Canvas 2D sería el siguiente paso. Canvas dibuja un bitmap y sus objetos no se exponen como HTML semántico a las herramientas de accesibilidad. [Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API#accessibility_concerns).

Chart.js ofrece gráficos, escalas y plugins; PixiJS ofrece renderizado gráfico con WebGL/WebGPU. No elegiría ninguno para unas pocas curvas senoidales. Los reconsideraría respectivamente para un panel de datos extenso o escenas con muchos elementos gráficos. [Chart.js](https://www.chartjs.org/docs/latest/), [PixiJS](https://pixijs.com/).

React y Svelte ofrecen componentes y estado reactivo. No los añadiría para esta primera pantalla; si se eligen por preferencia del equipo, el contenedor del terminal debe tener un único propietario y destruir su instancia al desmontarse. [React](https://react.dev/learn), [Svelte](https://svelte.dev/docs/svelte/overview), [destroy de Terminal](https://terminal.jcubic.pl/api_reference.php).

## Versiones y licencias comprobadas

Estas son las últimas **releases publicadas en GitHub observadas** durante la consulta, no una comprobación de los dist-tags del registro npm ni una recomendación de instalar automáticamente la versión más alta. Las licencias indicadas corresponden al proyecto principal; no se ha auditado cada dependencia o recurso multimedia.

| Proyecto | Release observada | Fecha de publicación | Licencia principal |
| --- | --- | --- | --- |
| jQuery Terminal | [2.48.1](https://github.com/jcubic/jquery.terminal/releases/tag/2.48.1) | 8 octubre 2026 | [MIT](https://github.com/jcubic/jquery.terminal/blob/2.48.1/LICENSE) |
| xterm.js | [6.0.0](https://github.com/xtermjs/xterm.js/releases/tag/6.0.0) | 22 diciembre 2025 | [MIT](https://github.com/xtermjs/xterm.js/blob/6.0.0/LICENSE) |
| ghostty-web | [0.4.0](https://github.com/coder/ghostty-web/releases/tag/v0.4.0) | 9 diciembre 2025 | [MIT](https://github.com/coder/ghostty-web/blob/main/LICENSE) |
| Howler.js | [2.2.4](https://github.com/goldfire/howler.js/releases/tag/v2.2.4) | 19 septiembre 2023 | [MIT](https://github.com/goldfire/howler.js/blob/v2.2.4/LICENSE.md) |
| Tone.js | [15.1.22](https://github.com/Tonejs/Tone.js/releases/tag/15.1.22) | 12 julio 2026 | [MIT](https://github.com/Tonejs/Tone.js/blob/15.1.22/LICENSE.md) |
| XState | [5.33.4](https://github.com/statelyai/xstate/releases/tag/xstate%405.33.4) | 7 noviembre 2026 | [MIT](https://github.com/statelyai/xstate/blob/next/LICENSE) |
| Vite | [8.3.8](https://github.com/vitejs/vite/releases/tag/v8.3.8) | 11 noviembre 2026 | [MIT](https://github.com/vitejs/vite/blob/v8.3.8/LICENSE) |
| Vitest | [5.1.0](https://github.com/vitest-dev/vitest/releases/tag/v5.1.0) | 2 noviembre 2026 | [MIT](https://github.com/vitest-dev/vitest/blob/v5.1.0/LICENSE) |
| Playwright | [1.65.1](https://github.com/microsoft/playwright/releases/tag/v1.65.1) | 13 noviembre 2026 | [Apache-2.0](https://github.com/microsoft/playwright/blob/v1.65.1/LICENSE) |

Las versiones concretas de Vite, Vitest y su entorno de ejecución deben comprobarse juntas al crear el proyecto. El rango declarado de jQuery Terminal es un dato más útil para esa decisión que la antigüedad del nombre jQuery. No he instalado estos paquetes ni construido un bundle para medir tamaño o compatibilidad.

## Condiciones de integración que ninguna biblioteca resuelve sola

- **Audio:** el navegador puede bloquear la reproducción antes de una interacción. Empezar al pulsar Comenzar, manejar el rechazo y permitir continuar sin sonido. Howler no elimina esta política. [Autoplay](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay).
- **Tiempo:** los navegadores limitan temporizadores y suelen detener animaciones en pestañas ocultas. Propongo pausar la misión al ocultarse y calcular su avance por tiempo transcurrido. [Page Visibility](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API).
- **Teclado:** los eventos dependen de la distribución y las teclas pueden tener significado fuera del juego. Dar foco explícito a consola o puzle, probar tildes y composición, y proporcionar una salida documentada si Tab completa comandos. [KeyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key), [W3C: sin trampas de teclado](https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html).
- **Lectura de mensajes:** separar el registro narrativo de los contadores que cambian continuamente. `role="log"` tiene comportamiento live polite, pero la frecuencia de anuncios depende de la integración. [ARIA log](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/log_role).
- **Guardado:** persistir en hitos, validar el estado recuperado y manejar almacenamiento bloqueado o JSON inválido. El progreso local no se sincroniza por sí mismo entre dispositivos. [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

## Validación corta antes de cerrar la selección

No haría dos aplicaciones completas. Construiría una prueba pequeña de **jQuery Terminal** con tres órdenes (`help`, una orden con espacios y una entrada de clave), un panel de estado, una onda y dos sonidos. Criterios de aceptación propuestos:

1. Edición en mitad de una línea, borrar, pegar, historial y completado funcionan sin ejecutar entradas parciales.
2. Se conservan exactamente las órdenes originales con espacios y se rechazan argumentos inválidos.
3. Texto con tildes, Unicode, HTML y formato de terminal se muestra de forma controlada.
4. Se puede entrar y salir del terminal y del puzle solo con teclado; el lector de pantalla anuncia mensajes útiles sin duplicados.
5. Redimensionar y usar zoom mantiene visible el prompt; el scroll permite consultar la salida sin forzar al usuario al final.
6. La partida se pausa al ocultarse, el audio vuelve de forma controlada y el guardado no depende del historial visual.
7. Se prueba en Chrome, Firefox y Safari de escritorio. Si móvil pasa a ser objetivo, se añaden dispositivos reales iOS y Android; la emulación de tamaño de pantalla no acredita el teclado virtual.

Si esa prueba exige demasiadas adaptaciones, compararía **xterm.js + FitAddon + Readline** y **un input HTML propio** con los mismos criterios. Elegiría la solución que complete esos recorridos con menos código de adaptación.

## Límites de la investigación

No se han instalado paquetes, ejecutado demos, medido tamaños o rendimiento, ni realizado pruebas con lectores de pantalla, IME o dispositivos móviles. Las recomendaciones se basan en capacidad documentada, código publicado y encaje con el alcance de Minerva. El principal punto pendiente es validar la interacción real de la consola; el segundo es la compatibilidad actual del audio.
