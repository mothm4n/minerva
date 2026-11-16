# Minerva - producto

<!-- impeccable:product-schema 1 -->

## Platform

web

## Product Purpose

Juego web cuya misión consiste en recuperar tres subsistemas, sintonizar una señal y abrir un portal para volver a casa. El usuario confirmó el 15 de noviembre de 2026 que esta base se mantiene y que el trabajo solicitado consiste en replantear la UI.

## Operating Context

El prototipo existente permite jugar individualmente en el navegador sin intervención de un game master. Combina órdenes de texto con controles para operar los subsistemas. Esta descripción procede de `README.md` y de la implementación; no prescribe la composición de la futura interfaz.

El usuario confirmó que la línea de comandos es la entrada principal. Los elementos visuales muestran el estado y las consecuencias de las órdenes; la nueva UI debe mantener esa relación.

## Capabilities and Constraints

- Ichidai gestiona materia W, refrigeración y energía del toroide.
- Sandai permite explorar señales y ajustar frecuencia y amplitud para sincronizarlas.
- Nidai conecta con el destino, abre el portal y realiza la transferencia.
- El prototipo dispone de ayuda, pistas, pausa, reinicio con confirmación, audio opcional y guardado local. Son capacidades existentes que el rediseño debe tener en cuenta.
- El alcance confirmado es el rediseño de la UI. No se han solicitado cambios de reglas, duración, dificultad, destinos ni formato de guardado.
- El equilibrio y los valores concretos del prototipo no constituyen compromisos permanentes de producto.

## Brand Commitments

El proyecto se llama Minerva. El usuario ha pedido empezar de cero con su estilo y UI mediante Impeccable, usando como base los ejemplos y elementos que aportará. La apariencia actual y las decisiones visuales de `DISENO_PROTOTIPO.md` son antecedentes, no autoridad para el nuevo diseño.

El 15 de noviembre de 2026, el usuario aportó nueve imágenes e identificó explícitamente la UI de Evangelion como referencia para investigar. El usuario eligió la propuesta A - Puente de mando: instrumentos arriba y consola ancha debajo. La imagen aprobada está en `.impeccable/mocks/01-puente-de-mando.png`. Después solicitó una base de efectos y animaciones con shaders y WebGL. En la revisión posterior pidió más efectos de shaders y una letra más pequeña en la consola; estas preferencias actualizan la escala y el movimiento del boceto A.

## Evidence on Hand

- `README.md`: capacidades y controles actuales.
- `src/game.ts`: reglas y estados implementados.
- `src/main.ts`, `index.html` y `src/audio.ts`: interacción, controles y audio existentes.
- `src/game.test.ts`: pruebas existentes de las reglas.
- `REFERENCIAS_UI.md` y `assets/references/evangelion/`: nueve referencias aportadas por el usuario y su lectura provisional.
- `RESEARCH_UI_EVANGELION.md`: investigación de fuentes primarias y propuestas de aplicación a Minerva; no constituye una dirección visual aprobada.

## Open Decisions

La composición A y el referente Evangelion están aprobados. El alcance incluye efectos WebGL vinculados al estado real, pausa, movimiento reducido y alternativa SVG. El público más específico no se ha confirmado.
