---
name: Minerva
description: "Un puente de mando de instrumentos angulares y órdenes escritas."
colors:
  amber: "#ffbe19"
  mint: "#37f8ab"
  red: "#ff3b45"
  cyan: "#38ddff"
  magenta: "#ee65ff"
  line: "#f0ad0c"
  muted: "#c4ac77"
  black: "#080707"
  terminal-output: "#89f5c9"
  terminal-error: "#ff5065"
  prose: "#bce2ce"
  overlay: "#080e0b"
  primary-hover: "#ffdb72"
  disabled-text: "#b69b62"
  disabled-border: "#665023"
  emergency-text: "#a4e8b2"
  emergency-bg: "#050a06"
  emergency-line: "#52785a"
  emergency-muted: "#8cba96"
  emergency-disabled-border: "#38533d"
  emergency-meter: "#152a1b"
  emergency-error: "#ff9f91"
  emergency-hover: "#d3f9da"
  crt-mask: "#000"
  crt-scanline: "#0003"
  crt-scanline-reduced: "#0002"
typography:
  display:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "clamp(25px, 2.66vw, 45px)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.04em"
  headline:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "clamp(20px, 2.2vw, 37px)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "0.018em"
  label:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "clamp(16px, 1.4vw, 24px)"
    fontWeight: 600
  readout:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "clamp(25px, 2.6vw, 45px)"
    fontWeight: 700
    lineHeight: 1
  body:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "clamp(14px, 1.2vw, 20px)"
    fontWeight: 400
    lineHeight: 1.5
  terminal-output:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "clamp(14px, 1.05vw, 18px)"
    fontWeight: 400
    lineHeight: "1.25em"
  command:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "clamp(18px, 1.6vw, 28px)"
    fontWeight: 400
    lineHeight: "1.25em"
  clock:
    fontFamily: "DSEG, IBM Plex Mono, monospace"
    fontSize: "clamp(24px, 2.45vw, 42px)"
    fontWeight: 700
    lineHeight: 1.2
  emergency-display:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "clamp(14px, 1.4vw, 21px)"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0"
  emergency-headline:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "clamp(12px, 1.1vw, 17px)"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0"
  emergency-label:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "12px"
    fontWeight: 400
  emergency-readout:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1
  emergency-clock:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "32px"
    fontWeight: 400
    lineHeight: 1.2
spacing:
  gap-6: "6px"
  gap-8: "8px"
  gap-10: "10px"
  inset-12: "12px"
  section-16: "16px"
  overlay-24: "24px"
components:
  button-primary:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.black}"
    padding: "3px 12px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.black}"
  button-secondary:
    backgroundColor: "{colors.black}"
    textColor: "{colors.amber}"
    typography: "{typography.label}"
    padding: "3px 12px"
  button-secondary-hover:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.black}"
  button-utility:
    backgroundColor: "{colors.black}"
    textColor: "{colors.amber}"
    typography: "{typography.label}"
    padding: "3px 12px"
  signal-choice:
    backgroundColor: "{colors.black}"
    textColor: "{colors.amber}"
    padding: "2px 9px"
  signal-choice-selected:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.black}"
    padding: "2px 9px"
  input-range:
    width: "100%"
    height: "25px"
  instrument-panel:
    backgroundColor: "{colors.line}"
    textColor: "{colors.amber}"
    padding: "3px"
  reader-state:
    backgroundColor: "{colors.line}"
    textColor: "{colors.mint}"
    padding: "3px 9px"
  navigation:
    textColor: "{colors.amber}"
    typography: "{typography.label}"
  command:
    backgroundColor: "{colors.black}"
    textColor: "{colors.amber}"
    typography: "{typography.command}"
    padding: "9px 0"
  button-emergency:
    backgroundColor: "{colors.emergency-bg}"
    textColor: "{colors.emergency-text}"
    typography: "{typography.emergency-label}"
    padding: "5px 8px"
  button-emergency-hover:
    backgroundColor: "{colors.emergency-text}"
    textColor: "{colors.emergency-bg}"
  button-emergency-active:
    backgroundColor: "{colors.emergency-text}"
    textColor: "{colors.emergency-bg}"
    typography: "{typography.emergency-label}"
    padding: "5px 8px"
  button-emergency-primary:
    backgroundColor: "{colors.emergency-text}"
    textColor: "{colors.emergency-bg}"
    padding: "5px 8px"
  button-emergency-primary-hover:
    backgroundColor: "{colors.emergency-hover}"
    textColor: "{colors.emergency-bg}"
  instrument-panel-emergency:
    backgroundColor: "{colors.emergency-bg}"
    textColor: "{colors.emergency-text}"
    padding: "3px"
---

# Design System: Minerva

## Overview

**Creative North Star: "Puente de mando"**

Minerva se presenta como una máquina que se opera mediante órdenes escritas. La referencia elegida por el usuario es la UI de Evangelion: negro dominante, trazos luminosos, rótulos condensados y carcasas angulares. Los instrumentos muestran consecuencias verificables de la partida; la consola mantiene la prioridad de interacción.

La densidad pertenece a un panel de control, con marcos que conectan los subsistemas y lecturas grandes que se distinguen del historial. La luz se concentra en señales y anillos, con halos cálidos en títulos, marcos y lecturas de Nidai y brillo menta en los medidores. El texto permanece nítido y la ornamentación estructural no sustituye etiquetas, estados ni controles accesibles.

El protocolo de emergencia es una variante conmutable de terminal antiguo: texto verde pálido, monoespaciada, marcos rectos y distorsión de televisión sobre la interfaz real. Por petición expresa del usuario, esta variante permite desplazar levemente el texto, separar sus canales y superponer barrido y ruido. Comparte los controles y el estado de la interfaz principal; al alternarlo se conservan el progreso, la pausa, el historial y la orden en curso. No modifica las reglas ni detiene el reloj de misión. La preferencia de presentación dura hasta recargar la página.

**Key Characteristics:**

- Negro de fondo y ámbar para la estructura y las órdenes.
- Menta para recursos y lecturas; cian y magenta para comparar señales.
- Marcos recortados, doble borde y conexiones entre instrumentos.
- Rótulos condensados, consola monoespaciada y reloj de siete segmentos.
- Efectos ligados a datos reales, con pausa, movimiento reducido y alternativa SVG.
- Protocolo de emergencia reversible, con información operativa y distorsión de televisión antigua; líneas estáticas con movimiento reducido.

Este documento describe la implementación de `index.html`, `src/style.css`, `src/main.ts`, `src/effects.ts`, `src/crt.ts` y `src/shaders/`. La composición aprobada se conserva en `.impeccable/surfaces/index-html.md`; no existe una semilla conceptual adicional. El sistema registrado no constituye una aprobación de fidelidad por píxeles.

## Validación de la interfaz

Desde el 16 de noviembre de 2026, por petición del usuario, el criterio de cierre combina la composición A con las adaptaciones posteriores documentadas en PRODUCT.md y este archivo. `npm run test:visual` comprueba geometría y legibilidad en el navegador; forma parte de `ci:local`. La revisión visual valora marcos, jerarquía, color y coherencia de los efectos con EFECTOS.md sobre capturas actuales. Aprobar las pruebas no certifica por sí solo el acabado artístico.

- Mantener tres instrumentos arriba y consola a todo el ancho debajo en escritorio, con Sandai dominante. En móvil se admite el desplazamiento y la redistribución descritos en Layout.
- Mantener el historial compacto (13-18px) y el prompt independiente y mayor (17-28px). El tamaño original del boceto fue sustituido expresamente por el usuario.
- Comprobar sincronía al 100 %, transferencia de dos cifras y lecturas completas dentro de Nidai en los tres idiomas. Número y símbolo permanecen juntos. Las pruebas de presentación cubren además pausa, movimiento reducido y alternativa sin WebGL.
- Comparar los estados reales: texto, frecuencia, progreso, imagen del destino y movimiento siguen la partida. Sus diferencias respecto a una imagen fija son esperadas; las curvas y geometría SVG son instrumentos de datos.

El resultado histórico de Impeccable (71,39 % frente al 72 %) permanece en `.impeccable/build/state.json` y sus informes locales, sin alterarlo ni declararlo superado. Es una comparación con el boceto anterior a estas adaptaciones, no el criterio de cierre vigente. Un `fix` de ese registro requiere traducirse a un defecto reproducible del contrato actual antes de abrir trabajo. El porcentaje global y los falsos positivos ya documentados sobre tamaño del prompt o SVG no exigen modificar la UI.

Para revisar un cambio: ejecutar `ci:local`, generar evidencias con `capture:ui` y valorar únicamente las diferencias del lote frente a este contrato. Anotar defectos concretos pendientes o cerrar el lote si no quedan; conservar por separado cualquier resultado histórico. Un nuevo cambio de dirección requiere una petición del usuario y actualizar este contrato.

## Colors

La paleta combina tinta negra y señalización luminosa con funciones diferenciadas. Los valores del frontmatter son la referencia normativa; las bandas tonales del sidecar son muestras auxiliares generadas para el visor, no colores adicionales de la interfaz.

### Primary

- **Ámbar de operación** (`amber`): identidad, títulos, órdenes, botones y marcas de escala. El botón principal invierte el fondo negro y usa ámbar claro (`primary-hover`) al apuntarlo.
- **Ámbar de estructura** (`line`): contornos, separadores y doble borde. Mantiene las superficies legibles sin convertir cada marco en una acción.

### Secondary

- **Menta de lectura** (`mint`): cantidades, sincronía, selección de señal, estados disponibles y foco de teclado.
- **Menta de respuesta** (`terminal-output`): salida ordinaria de la consola, menos intensa que los números de los instrumentos.

### Tertiary

- **Cian de referencia** (`cyan`) y **magenta de ajuste** (`magenta`): ondas de referencia y del jugador, acompañadas por una leyenda textual.
- **Rojo de bloqueo** (`red`): portal cerrado, avisos y reloj en peligro. **Rojo de error** (`terminal-error`) identifica respuestas fallidas de la consola; el shader usa una aproximación de este tono para el arco de alerta.

### Neutral

- **Negro de instrumento** (`black`): negro cálido de la superficie principal, interiores y fondo de consola.
- **Negro de ayuda** (`overlay`): ayuda desplegable y diálogos.
- **Marfil verde** (`prose`): explicaciones de bienvenida, ayuda y confirmación.
- **Ámbar atenuado** (`muted`): información secundaria y estados vacíos.
- **Ámbar deshabilitado** (`disabled-text`, `disabled-border`): controles que no están disponibles.

### Variante de emergencia

- **Verde de terminal** (`emergency-text`): texto, órdenes, lecturas, foco y selección. Sustituye el ámbar y la menta mientras la variante está activa.
- **Verde claro de interacción** (`emergency-hover`): respuesta al apuntar el botón principal.
- **Rojo de emergencia** (`emergency-error`): bloqueos, peligro y respuestas fallidas de la consola.
- **Negro verde de terminal** (`emergency-bg`), **verde de marco** (`emergency-line`) y **verde secundario** (`emergency-muted`): superficie, contornos rectos e información secundaria o deshabilitada.
- **Verde de borde atenuado** (`emergency-disabled-border`) y **verde de medidor** (`emergency-meter`): límite del control deshabilitado y fondo de las barras de recursos.
- **Negro de máscara CRT** (`crt-mask`): extremo opaco de la máscara que concentra el ruido en la zona inferior. **Negro de barrido** (`crt-scanline`) y **negro de barrido reducido** (`crt-scanline-reduced`): líneas superpuestas, con menor opacidad al solicitar movimiento reducido.

La comparación de ondas conserva `cyan` y `magenta`; la referencia añade un trazo discontinuo y la señal del jugador mantiene el continuo. La leyenda y el nombre accesible identifican ambas señales.

**The Señal con significado Rule.** Mantener cian para la referencia, magenta para el ajuste y menta para las lecturas; expresar también el estado mediante texto, selección o geometría.

## Typography

**Display Font:** Barlow Condensed, con alternativa sans-serif. Se sirven localmente los pesos 600 y 700.

**Body Font:** IBM Plex Mono, con alternativa monospace. Los pesos 400 y 500 proceden del paquete local de fuentes.

**Label/Mono Font:** Barlow Condensed para rótulos; IBM Plex Mono para órdenes, historial y explicaciones. DSEG Bold se reserva al reloj y se carga localmente.

La interfaz permite inglés, japonés y castellano desde Ayuda. La consola completa conserva siempre el inglés y declara su propio idioma para lectores de pantalla. Los rótulos japoneses usan fuentes locales compatibles con japonés; títulos y estados permiten envolver. Los recursos adaptan el tamaño del rótulo al ancho de su columna (`clamp(11px, 16cqw, 20px)`).

**Character:** La tipografía condensada concentra nombres y cantidades en los instrumentos. La monoespaciada separa la lectura operativa de la escritura de órdenes. Los números emplean cifras tabulares; no hay una escala modular única. La cabecera y los títulos de subsistema añaden un espaciado de letras leve, registrado en sus tokens.

### Hierarchy

- **Display** (`display`): identidad y nombre de misión, en mayúsculas.
- **Headline** (`headline`): títulos de subsistema, con peso menor que la cabecera.
- **Readout** (`readout`): cantidades de recursos, en menta; la sincronía utiliza su propia escala observada (`clamp(26px, 2.7vw, 46px)`) y mantiene cifra y porcentaje en una línea.
- **Body** (`body`): introducción monoespaciada, con longitud máxima de 65 caracteres (`65ch`). La prosa de ayuda conserva la familia condensada y el tamaño de su contenedor.
- **Label** (`label`): botones y acciones de la cabecera, en mayúsculas salvo el acceso de texto a la consola.
- **Terminal output** (`terminal-output`): respuestas e historial, compactos y de peso regular. **Command** (`command`): orden actual, también de peso regular y mayor que el historial. La escala reducida responde al ajuste solicitado tras aprobar el boceto A.
- **Clock** (`clock`): ventana de retorno, contenida en el bisel lateral. El reloj permanece en una línea; el rótulo inferior puede envolver y explica cuándo comienza a descontar.

En emergencia, IBM Plex Mono también compone la cabecera, los títulos, los controles y el reloj. Los tokens `emergency-display`, `emergency-headline`, `emergency-label`, `emergency-readout` y `emergency-clock` registran esta escala más compacta; el prompt y el historial conservan su separación y sus tamaños adaptables. Hasta `560px`, los títulos de subsistema usan `14px`, las cantidades `18px` y las utilidades `11px`.

**The Orden visible Rule.** El prompt permanece separado del historial desplazable y con una escala mayor; no reducir ambos a una sola jerarquía de texto.

## Layout

El escritorio ocupa la altura dinámica de la ventana (`100dvh`). El cuerpo deja un margen interior de `6px 10px 17px`, una cabecera de `clamp(44px, 5.8vh, 64px)` y una separación principal de `10px`. La cabecera amplia usa relleno horizontal de `38px` y separación de `30px`. El contenido distribuye instrumentos y consola en filas con proporción `1.17fr / 1fr`.

En esta superficie, los instrumentos usan columnas `372fr / 824fr / 436fr`, separadas por `10px`: Ichidai, Sandai y Nidai. La consola recorre todo el ancho inferior. El espaciado es compacto y contextual; los valores del frontmatter registran medidas recurrentes, no una nueva escala obligatoria para todos los elementos.

- Hasta `1350px`, se reducen márgenes internos y la barra de señal puede envolver su contenido.
- Hasta `900px`, Ichidai y Nidai comparten la primera fila en proporción `1fr / 1.5fr`; Sandai ocupa la segunda. La consola reserva al menos `210px` y toma el `42%` de su contenedor. Se ocultan el subtítulo de misión, las franjas y las conexiones ornamentales, incluida la base trazada bajo el portal. El portal vuelve a centrarse verticalmente y la sincronía recupera ancho automático. El historial pasa a `15px` y la orden a `20px`.
- Hasta `560px`, la página permite desplazamiento vertical. Los instrumentos ocupan dos columnas iguales y filas de `220px` y `260px`; la consola mide `390px`. El historial usa `13px` y la orden `17px`. Se oculta el botón de pantalla completa y las pistas de teclado pueden envolver. El prompt permanece visible dentro de la consola, pero no queda fijado a la ventana cuando la página se desplaza.
- Hasta `380px`, Ichidai, Nidai y Sandai se apilan en filas de `220px`, `220px` y `300px`, evitando comprimir el reloj. La sincronía ocupa una fila propia para que las cinco señales permanezcan visibles. Entre `561px` y `900px`, estado y reloj comparten dos columnas y la transferencia ocupa una fila propia.
- Por encima de `560px`, una altura de ventana de hasta `650px` activa una altura mínima de página de `600px`. Por debajo de ese espacio puede ser necesario desplazarse verticalmente.

El ancho mínimo declarado es `320px`. La adaptación compacta no equivale a una validación en teléfonos reales: las capturas de revisión proceden de Chrome de escritorio; teclado virtual, Safari, Firefox y lectores de pantalla reales quedan fuera de esa comprobación.

En emergencia, la cabecera admite varias líneas y tiene altura automática, con mínimo de `48px`. La página conserva una altura mínima de `780px` en escritorio. Los recursos pasan a filas con nombre, cantidad y barra horizontal; la sincronía entra en el flujo antes de la gráfica, que reserva al menos `120px`. Nidai concentra estado, reloj y transferencia en una columna. Hasta `900px`, la página adopta altura automática con mínimo de `100dvh`; los instrumentos ocupan dos filas de `340px` y la consola reserva `420px`. Hasta `560px`, los instrumentos se apilan en orden Ichidai, Sandai y Nidai, con alturas automáticas para Ichidai y Nidai; Sandai reserva `340px` y la consola conserva `420px`. Para alojar el control Emergencia, ambas presentaciones ocultan el subtítulo y las franjas de cabecera hasta `1100px` y permiten que las utilidades envuelvan en móvil.

## Elevation & Depth

La profundidad se construye con contornos superpuestos, recortes, fondos negros y un resplandor interior cálido en las carcasas (`box-shadow: inset 0 0 5px #e18a0055`). La carcasa exterior deja el interior negro a `2px` y añade un segundo contorno interior a `5px`; los biseles pequeños usan un interior a `1px`. La ayuda y los diálogos tienen borde ámbar; el fondo del diálogo usa negro translúcido (`#000c`).

El brillo animado pertenece a las ondas y al portal WebGL. La cabecera y los títulos de subsistema combinan un halo naranja corto con otro rojo más difuso; el conjunto de instrumentos, el doble borde y los biseles de Nidai refuerzan esa luz cálida. Los medidores conservan el brillo menta; el estado del portal y el reloj reciben halos propios. Los valores exactos de cada tratamiento se registran en las extensiones de sombras del sidecar. En la interfaz principal, el texto de la consola no recibe brillo, desenfoque ni postprocesado. Las transiciones de botones duran `0.15s`; el nivel de los medidores cambia en `0.9s cubic-bezier(.22,.61,.36,1)`. La apertura del portal se expresa durante `8s` y deriva del reloj de la partida.

**The Luz instrumental Rule.** En la interfaz principal, contener el brillo y el movimiento en la información del instrumento y mantener nítidos el texto, el prompt y los controles. La distorsión de televisión sobre el texto solo se permite en emergencia, por petición expresa del usuario, y se elimina con movimiento reducido.

La base de emergencia es plana: elimina las sombras, los filtros y las animaciones de los componentes; oculta las conexiones, el arranque del toroide y la imagen del portal. No dibuja instrumentos WebGL. Las ondas SVG quedan en fase fija y siguen reflejando frecuencia y amplitud reales; recursos, estado, reloj y transferencia continúan actualizándose. La respuesta a las órdenes permanece escrita, sin énfasis animado.

Sobre esa base, el ruido SVG desplaza cada fila del HTML hasta `3px` por eje. Los saltos verticales de la imagen completa llegan hasta `4,5px`. Rojo y azul se desplazan `1px` en sentidos opuestos. Las líneas de barrido ocupan `1px` cada `4px`. Una banda de `200px` recorre la pantalla a `35px/s` y un lienzo de `128 × 64` añade la interferencia inferior. El efecto se actualiza a un máximo de `24fps`, se congela al pausar y deja de dibujarse con la pestaña oculta. Salir de emergencia retira el efecto. Con movimiento reducido quedan solo líneas estáticas. La adaptación del shader y la atribución del ruido simplex se explican en `EFECTOS.md`.

Las órdenes tienen una respuesta de hasta 1200 ms sobre el subsistema afectado: carga ascendente en Ichidai, barrido y separación cromática en Sandai, convergencia al fijar e impulso radial en Nidai. Solo las lecturas realmente modificadas reciben énfasis de actualización; las consultas pueden señalar la lectura consultada. Los rechazos añaden rojo y una franja de alerta. Una línea persistente encima del historial identifica el subsistema y su respuesta, también en móvil. La línea usa Barlow Condensed, `clamp(14px, 1.15vw, 19px)` y 13 px en móvil; no sustituye el historial ni su tipografía. Con movimiento reducido quedan énfasis suaves de 300 ms y texto, sin desplazamiento ni glitch. Las órdenes sucesivas interrumpen las animaciones del mismo elemento. El arranque del toroide añade un campo eléctrico temporal en Ichidai durante 3,6 segundos: fluctúa en ámbar, se confina con marcas hexagonales y se estabiliza en menta. Los rótulos Cargando, Confinando y Estable explican la secuencia; los valores de recursos se mantienen visibles. El arranque comparte el reloj de misión, permanece al ejecutar otras órdenes y se omite con movimiento reducido. La implementación y atribución están en `EFECTOS.md`.

## Shapes

Los paneles principales usan un polígono de ocho vértices con cortes de `12px`. La cabecera amplía el corte a `16px`; los biseles de lecturas usan `7px`, salvo el estado del toroide, con corte más corto de `4px`. No se define una escala de esquinas redondeadas. Los estados de lector y destino rematan en una flecha de `10px`; el estado del toroide conserva la carcasa recortada.

El doble borde y las conexiones verticales entre paneles componen una máquina continua. Estas conexiones desaparecen en la vista compacta. Los selectores de señal se inclinan `-9deg`, mientras sus cifras compensan con `9deg`. La única geometría circular dominante pertenece a los anillos del portal; los medidores de recursos son barras rectangulares segmentadas.

En emergencia, paneles y biseles usan rectángulos sin recortes ni doble borde, con contorno de `1px`. Los selectores pierden su inclinación y los medidores se convierten en barras horizontales continuas de `6px`, sin brillo.

## Components

### Buttons

Acciones compactas con etiquetas condensadas y contorno fino. El botón normal usa negro, texto ámbar, borde estructural de `1px`, relleno de `3px 12px` y altura mínima de `36px`; al apuntarlo invierte ámbar y negro. El principal comienza con fondo ámbar y peso 700. Las utilidades Pausa y Ayuda prescinden del marco completo; Sonido conserva un bisel recortado. La selección de sonido se expresa también con `aria-pressed`.

El foco visible usa un contorno menta de `2px` con desplazamiento interior de `-4px`. El estado deshabilitado conserva texto y borde atenuados y cursor de indisponibilidad. Los controles compactos de señal y pie de consola tienen alturas propias; no existe una regla universal de `36px` para todos los botones.

En emergencia, los botones usan monoespaciada de `12px`, relleno de `5px 8px` y altura mínima de `36px`. Los controles de cabecera recuperan un borde recto. La inversión de verde y negro expresa hover y selección; el botón principal usa el verde claro al apuntarlo. El foco conserva su contorno de `2px`, ahora verde de terminal, y los estados deshabilitados mantienen texto y borde atenuados.

### Chips

Los números de señal son botones de selección exclusiva, no etiquetas decorativas. Usan el recorte inclinado, peso 700, tamaño `clamp(18px, 1.6vw, 27px)` y relleno `2px 9px`. La selección ocupa el fondo menta con cifra negra y `aria-pressed="true"`. Los estados de lector y destino son indicadores no interactivos en flecha, con texto y un marcador cuadrado.

### Cards / Containers

Los paneles son carcasas de instrumentos, con fondo estructural, interior negro cálido y doble borde angular. El relleno base es `3px`; cada instrumento compone sus espacios interiores según la lectura. En Ichidai, las tres columnas distribuyen sus medidores con un ancho de `55.5%` y divisiones de `12px`; el nivel menta conserva bandas de `9px` y una separación de `3px`. Hasta `900px`, el ancho de los medidores pasa a `70%` y se elimina el ajuste lateral de la rejilla de recursos. La consola tiene su propio relleno de `12px 26px 9px`. Ayuda y diálogos usan un ancho máximo de `520px`, relleno `24px` y desplazamiento interno cuando su contenido excede la ventana.

### Inputs / Fields

La consola de jQuery Terminal es la entrada principal y expone un campo de texto accesible. El historial envuelve líneas y tiene desplazamiento independiente; el prompt ámbar queda fuera de ese desplazamiento. Tab completa, las flechas recorren historial, Enter ejecuta y Escape libera el foco. Un enlace inicial permite saltar a la consola y un botón visible devuelve el foco a la entrada.

Los ajustes alternativos de frecuencia y amplitud son controles nativos de rango, de ancho completo y altura `25px`, con acento menta, etiquetas y valores visibles. La ayuda permite preparar órdenes y fijar la señal. No se introduce un campo de texto genérico ajeno a la consola.

### Navigation

La cabecera reúne Emergencia, Sonido, Pausa, Ayuda y pantalla completa. Conserva etiquetas de texto y el control de pantalla completa usa SVG con nombre accesible. Emergencia alterna la presentación con `aria-pressed`, actualiza el nombre del protocolo y confirma el cambio en la línea de respuesta. La ayuda es un popover nativo con botón de cierre; reinicio y resultado usan diálogos. El reinicio mantiene la confirmación de pérdida del progreso.

### Instrumentos de señal y portal

La señal superpone la referencia cian y el ajuste magenta sobre una rejilla verde más visible, con marcas menores en los ejes vertical y horizontal. El eje horizontal representa un segundo y las curvas usan frecuencia y amplitud reales. En escritorio amplio, la barra superior reserva `96px` con `24px` de relleno inferior; la columna del eje vertical mide `56px` y el bisel de sincronía usa un ancho de `clamp(100px, 7.54vw, 126px)`. Tres estelas tenues de posiciones anteriores y un barrido luminoso acompañan los trazos principales; la proximidad a la sincronía añade un halo menta. Las estelas no alteran los valores medidos.

El portal combina anillos segmentados en rotación, un núcleo hexagonal, tres brazos angulares con contornos anidados y un arco que muestra tiempo disponible, transferencia o retorno completado. El núcleo y los brazos conservan esa geometría en la alternativa SVG. En escritorio, el instrumento comparte la rejilla con lecturas de al menos `112px` y se alinea arriba; una línea vertical conecta visualmente con el trazo horizontal inferior. La vista compacta retira esos trazos y devuelve el instrumento al centro vertical. Al abrirse, una onda radial revela anillos de profundidad y filamentos interiores; durante la transferencia, el campo mezcla cian y magenta según el avance real y aumenta la intensidad del flujo de partículas. La rotación se activa al energizar el toroide y se acelera con el portal abierto. El estado cerrado se expresa en rojo y el abierto en menta; el reloj de peligro conserva su señal de texto y color. La lectura de transferencia usa `clamp(12px, 1vw, 17px)` (`11px` y altura de línea `1` hasta `560px`) y conserva su valor completo y permite envolver las palabras traducidas.

Hasta `560px`, cuando la transferencia está visible, Nidai compacta sus tres lecturas para evitar recortes: separación de `2px`, estado de portal de `14px` con relleno de `2px`, reloj de `22px` y rótulo de `10px`. El bisel del reloj usa relleno y separación de `2px`. Esta reducción del estado y del reloj solo se aplica mientras aparece la transferencia.

WebGL 1 nativo dibuja únicamente ondas y portal. Etiquetas, estado y reloj permanecen en HTML; SVG ofrece la alternativa cuando WebGL falta, falla o pierde el contexto. La recuperación reconstruye los recursos gráficos sin alterar la partida. La densidad de dibujo se limita a `1.5` y se omite el dibujo si los valores no cambian o la pestaña está oculta.

La pausa congela el tiempo visual. Al ocultar la pestaña se pausa la partida. Movimiento reducido fija la fase de las ondas y la rotación del portal, elimina las estelas, el barrido, el flujo de partículas, la onda de apertura y el parpadeo del cursor; el campo abierto aparece sin transición y los cambios de datos siguen visibles. El resultado SVG conserva la información necesaria, aunque el brillo y los trazos no son idénticos al shader. Los detalles técnicos y los límites de la comprobación están en `EFECTOS.md`.

## Do's and Don'ts

### Do:

- **Do** conservar la consola como entrada principal y mostrar las consecuencias en los instrumentos.
- **Do** usar texto, forma y estado accesible junto al color para explicar selección, bloqueo o disponibilidad.
- **Do** mantener la relación cian/referencia, magenta/jugador y menta/lecturas.
- **Do** conservar el prompt fuera del desplazamiento del historial y ofrecer una salida de foco por teclado.
- **Do** derivar los efectos del estado real y mantener pausa, movimiento reducido y alternativa SVG.
- **Do** servir las fuentes locales y preservar la separación entre rótulos, órdenes y reloj.
- **Do** mantener los controles, los datos y la orden en curso al alternar el protocolo de emergencia.
- **Do** conservar cian y magenta en emergencia, con referencia discontinua y ajuste continuo.

### Don't:

- **Don't** sustituir las carcasas angulares por una familia de tarjetas redondeadas.
- **Don't** aplicar brillo, desenfoque o postprocesado al texto de la consola principal; la distorsión CRT solicitada es una excepción exclusiva de emergencia.
- **Don't** mostrar datos de demostración como si fueran estados de la partida.
- **Don't** añadir movimiento de cámara ni destellos de pantalla a los efectos instrumentales.
- **Don't** ocultar controles necesarios para operar al adaptar la vista compacta.
- **Don't** interpretar la composición de escritorio como una obligación de eliminar el desplazamiento vertical en móvil.
- **Don't** convertir el protocolo de emergencia en una pausa, un reinicio o una variante de las reglas de juego.
- **Don't** reintroducir los halos y las animaciones instrumentales o el dibujo WebGL en emergencia; mantener la distorsión CRT acotada y respetar pausa y movimiento reducido.
