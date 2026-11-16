# Minerva - investigación de interfaces de Evangelion

Fecha: 15 de noviembre de 2026. Alcance: referencias visuales y criterios para futuras propuestas en imagen. No se ha implementado una nueva interfaz ni elegido una dirección definitiva.

## Hallazgo principal

La base más útil para Minerva es una **interfaz de instrumentación dentro de la ficción**: operar recursos, interpretar señales y autorizar una transferencia debería sentirse como manejar una máquina. Esta es una lectura de las nueve imágenes aportadas, no una denominación oficial de estilo. Lo característico es la combinación de datos, geometría, jerarquía y estados; el color por sí solo no la reproduce.

Las capturas permiten distinguir cuatro familias compatibles: arquitectura MAGI, telemetría de ondas, circuitos de sincronización y señalética de emergencia. Conviene asignar a cada familia una función real de Minerva antes de mezclarlas. La base funcional confirmada está en [PRODUCT.md](PRODUCT.md); el inventario de imágenes y preferencias, en [REFERENCIAS_UI.md](REFERENCIAS_UI.md).

## Fuentes verificadas y qué mirar

Todas las fuentes externas de esta selección pertenecen al fabricante, creador o autor del trabajo descrito. Un proyecto personal es evidencia de su propia reinterpretación, no de cómo se produjo la serie.

| Fuente | Qué está verificado | Utilidad visual |
| --- | --- | --- |
| [flapper3 - Evangelion: 3.0+1.0](https://www.flapper3.co.jp/en/works/123/) | El estudio declara haber diseñado y producido parte de los gráficos de monitor de la película de 2021. Publica créditos y material del proyecto. | Referencia profesional directa de gráficos que sí pertenecen a una producción de Evangelion. Su atribución no se extiende a las capturas del usuario. |
| [NTT Docomo - presentación del SH-06D NERV](https://www.docomo.ne.jp/info/news_release/2012/06/22_00.html) | El anuncio describe un teléfono supervisado por Studio Khara, con interfaz 3D basada en MAGI y aplicaciones y widgets propios. | Confirma que el lenguaje NERV se trasladó oficialmente a un aparato interactivo. Es especialmente pertinente para la imagen 04. |
| [Docomo - manual oficial SH-06D NERV](https://www.docomo.ne.jp/binary/pdf/support/manual/SH-06D_NERV_J_01.pdf#page=3) | Las páginas 3 y 4 del PDF presentan MAGI Home y widgets de reloj, batería, música, CPU, memoria, USB y otros datos. | Observar cómo una misma gramática convierte funciones distintas en instrumentos reconocibles. El manual explica interacción además de apariencia. |
| [Sharp - pantallas de la actualización SH-06D NERV](https://k-tai.sharp.co.jp/support/d/sh-06d/download/update/intro_n/function.html) | El fabricante muestra cambios de ajustes, perfil, estado, volumen y llamadas, y menciona MAGI Home. | Galería oficial útil para estudiar estados cotidianos, menús y controles, además de pantallas espectaculares. |
| [Fontworks/Monotype - Matisse-EB en Evangelion](https://fontworks.co.jp/column/394/) | La fundición documenta el uso de Matisse-EB y la composición de los títulos de episodio; también muestra créditos y otros usos. | Fuente principal para distinguir el lenguaje de los títulos del lenguaje de los instrumentos. |
| [Fontworks/Monotype - producto EVA Matisse](https://fontworks.co.jp/products/evamatisse/) | La ficha distingue EVA Matisse Classic, usada en la serie de TV, y EVA Matisse Standard, usada en las nuevas películas. La edición descrita figura como retirada de la venta. | Comparar variantes tipográficas; no convertir esta ficha en una recomendación de compra ni asumir que identifica la fuente de todos los monitores. |
| [Pedro Fleming - Neon Genesis Evangelion Screen Graphics](https://www.pedrofleming.com/neongenesisevangelion) | El autor lo identifica como proyecto personal. Publica numerosos fotogramas, HUD y material de proceso. | La referencia externa más abundante de esta selección para comparar composiciones, densidades y separación entre datos y decoración. Es una reinterpretación, no un encargo oficial de Evangelion. |
| [EthanThatOneKid - obsidian-nerv](https://github.com/ethanthatonekid/obsidian-nerv) | Su autor presenta un tema para Obsidian inspirado en MAGI y EVA-01, con captura, demostración y código. Lo identifica como homenaje de aficionados. | Contrastar cómo se adapta esa influencia a una aplicación de uso continuo. No se propone instalarlo ni copiar su organización en Minerva. |

## Cuatro familias extraídas de las imágenes

Los siguientes nombres son categorías de trabajo para este proyecto. Las observaciones se apoyan en las capturas enlazadas; las aplicaciones a Minerva son propuestas, todavía no decisiones aprobadas.

### 1. Arquitectura MAGI - sistemas que cooperan

En [01 - MAGI](assets/references/evangelion/01-magi.png) aparecen anillos concéntricos, un centro compuesto por tres piezas y etiquetas orientadas según la geometría. En [04 - teléfono NERV](assets/references/evangelion/04-nerv-phone.png), las regiones poligonales y los módulos compactos articulan una pantalla muy densa.

**Qué tomar:** piezas que parecen pertenecer a un sistema mayor, líneas de conexión, numeración, estados internos y una geometría que hace visible la relación entre módulos. La pantalla puede funcionar como un esquema operativo, no solo como un conjunto de recuadros.

**Aplicación posible:** una vista general donde Ichidai, Sandai y Nidai sean tres partes de la máquina. Activar recursos, fijar una señal y habilitar el portal produciría cambios en sus conexiones. Mantener los nombres propios de Minerva.

**Límite:** el círculo y los hexágonos no deberían obligar a leer instrucciones giradas ni a encajar controles en zonas pequeñas. El teléfono inspira una gramática; no obliga a conservar su densidad o su estructura móvil.

### 2. Telemetría biológica - el instrumento como protagonista

En [03 - campo de sensores](assets/references/evangelion/03-sensor-field.png), una forma multicolor ocupa casi todo el campo y se cruza con escalas. [05 - malla de sincronización](assets/references/evangelion/05-sync-mesh.png) y [06 - ondas](assets/references/evangelion/06-waveforms.png) superponen curvas, tramas y referencias de medición sobre negro.

**Qué tomar:** una gráfica con presencia suficiente para ser el centro de la interacción; ejes, marcas y unidades que ayudan a leerla; varias señales distinguibles; color localizado dentro del dato. El negro conserva espacios entre trazos y permite interpretar superposiciones.

**Aplicación posible:** convertir Sandai en el instrumento principal durante la sintonización. Mostrar la señal objetivo y la señal ajustable con frecuencia, amplitud y porcentaje de coincidencia claramente vinculados. Las variaciones visuales deben corresponder a los valores del juego.

**Límite:** varias decenas de ondas resultarían sugerentes, pero podrían esconder qué está manipulando el jugador. Un campo multicolor puede ser expresivo sin teñir también botones, títulos y fondos.

### 3. Circuitos de sincronización - una red con estados

En [07 - flujo SYNC](assets/references/evangelion/07-sync-flow.png), filas de segmentos verdes y pequeñas etiquetas ámbar siguen rutas verticales. [08 - fallo de sincronización](assets/references/evangelion/08-sync-fault.png) contrapone segmentos verdes y rojos, conexiones finas y cambios de estado localizados.

**Qué tomar:** repetición ordenada, trayectorias legibles, diferencias de estado en partes concretas de la red y contraste entre conexiones finas y bloques activos. El propio diagrama cuenta dónde funciona o falla el sistema.

**Aplicación posible:** Ichidai puede mostrar qué recursos alimentan cada etapa; Nidai, qué partes del enlace están listas. Un fallo podría señalar el tramo o requisito afectado, acompañado de una explicación breve.

**Límite:** no inventar docenas de nodos puramente decorativos. Conservar una correspondencia comprensible entre cada estado visible y la misión. Las etiquetas y formas deben seguir distinguiendo los estados cuando el color no baste.

### 4. Emergencia industrial - tiempo, acceso y consecuencias

[02 - cuenta atrás](assets/references/evangelion/02-countdown.png) concentra la atención en cifras segmentadas enormes, etiquetas compactas y bandas de estado. [09 - Central Dogma](assets/references/evangelion/09-central-dogma.png) sitúa una señal luminosa de acceso dentro de una estructura física oscura.

**Qué tomar:** un dato dominante, mensajes breves, jerarquía abrupta cuando cambia la situación y una separación clara entre identificación, estado y acción. La máquina parece tener restricciones y consecuencias.

**Aplicación posible:** durante la apertura del portal, hacer que el tiempo restante y la transferencia tengan más peso que los diagnósticos secundarios. Antes de abrir, el estado de acceso puede comunicar qué falta; después, la emergencia debe resultar inequívoca.

**Límite:** reservar la intensidad para momentos que la justifican. Si todo parece una alarma desde el arranque, el cierre real del portal pierde fuerza.

## Tipografía, color y movimiento

**Tipografía.** La fuente Matisse-EB está documentada para los títulos y otros usos de Evangelion, pero esa evidencia no identifica automáticamente las letras de estas nueve pantallas. [Fontworks/Monotype](https://fontworks.co.jp/column/394/). En las capturas se observan encabezados compactos sin remates, números segmentados y etiquetas técnicas; no se ha identificado su familia exacta. Para Minerva propongo separar encabezados, datos tabulares y reloj. La fidelidad dependerá tanto de proporción, escala y composición como del nombre de una fuente. La consola debe conservar buena lectura en español.

Para pruebas posteriores, dos candidatas prácticas son [DSEG7, de Keshikan](https://www.keshikan.net/fonts-e.html), una familia de segmentos, y [Barlow Condensed](https://github.com/jpt/barlow), variante condensada de Barlow. Son alternativas propuestas para Minerva, no identificaciones de las fuentes de Evangelion. No se han descargado ni instalado.

**Color.** Como propuesta semántica derivada de las capturas: negro para el campo de trabajo; ámbar/naranja para estructura y medición; verde para conexión o disponibilidad; rojo para bloqueo o peligro. Magenta, violeta y cian pueden distinguir señales dentro del instrumento de Sandai. Esto no es una paleta oficial extraída de producción ni una asignación universal de colores en Evangelion. Los valores exactos se decidirán al comparar las propuestas en imagen.

**Movimiento.** Las imágenes son estáticas: no permiten determinar velocidades, frecuencias de destello ni transiciones originales. Como propuesta para Minerva, las ondas responderían al ajuste, los segmentos marcarían el avance real y una transición breve comunicaría la apertura del portal. El manual del teléfono sí documenta animación y actualización en ciertos widgets, con posibilidad de detenerlas, pero eso no prueba cómo se animan los monitores de las películas. [Manual oficial, página 4 del PDF](https://www.docomo.ne.jp/binary/pdf/support/manual/SH-06D_NERV_J_01.pdf#page=4).

## Qué merece compararse en las próximas imágenes

Propongo explorar tres composiciones, manteniendo las mismas funciones para que la comparación sea útil:

1. **Máquina MAGI:** tres subsistemas articulados alrededor del estado de la misión, con la consola integrada en el esquema.
2. **Estación de sintonización:** Sandai domina la superficie; recursos y portal acompañan el proceso como instrumentos secundarios.
3. **Puesto de control industrial:** gran reloj y estado operativo, rutas de alimentación y acceso, controles y consola con jerarquía muy directa.

Son hipótesis de composición. No constituyen tres estilos aprobados ni sustituyen la selección del usuario. Una posible síntesis posterior sería usar arquitectura MAGI como estructura, telemetría para Sandai y señalética de emergencia solo cuando el portal esté activo.

## Términos útiles para ampliar la búsqueda

- `Evangelion monitor graphics`, `NERV interface`, `MAGI system UI`, `Evangelion FUI`.
- `SH-06D NERV MAGI home`, `SH-06D NERV ウィジェット`.
- `エヴァンゲリオン モニターグラフィックス`, `エヴァンゲリオン モニターデザイン`.
- `Evangelion synchronization waveform`, `Evangelion internal power countdown`.
- `Pedro Fleming Neon Genesis Evangelion Screen Graphics`, `flapper3 Evangelion 3.0+1.0`.

Estas consultas sirven para descubrir material; la atribución debe comprobarse en su fuente. Las búsquedas amplias de interfaces futuristas devuelven reinterpretaciones que pueden apartarse bastante de las referencias elegidas.

## Límites de la investigación

No se ha identificado el episodio, minuto, autor o procedencia de cada captura aportada, ni demostrado que todas correspondan directamente a fotogramas de la serie. Tampoco se han atribuido fuentes exactas, medidas o colores oficiales a partir de estas imágenes. No se han descargado recursos externos ni evaluado librerías para implementación. El siguiente resultado acordado será visual: propuestas en imagen antes de construir la interfaz elegida.
