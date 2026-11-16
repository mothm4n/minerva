# Minerva - referencias para la nueva interfaz

## Punto de partida

Acuerdo del 15 de noviembre de 2026: replantear el estilo y la UI desde cero con Impeccable. Primero preparar el proyecto; después reunir los ejemplos y elementos que aporte el usuario y construir la dirección visual a partir de ellos.

La apariencia del prototipo y las decisiones visuales de `DISENO_PROTOTIPO.md` son antecedentes, no requisitos para el nuevo diseño. No heredar por defecto su paleta, tipografías, distribución, iconos ni tratamiento de la consola.

## Estado

- Recibidas nueve imágenes de Evangelion como referencia del usuario el 15 de noviembre de 2026. Originales conservados en `assets/references/evangelion/`.
- Tres propuestas en imagen generadas. El usuario eligió A - Puente de mando el 15 de noviembre de 2026.
- Confirmado el 15 de noviembre de 2026: mantener la base del juego (recuperar los tres subsistemas, sintonizar una señal y abrir un portal) y replantear la UI.
- La preparación no modifica la aplicación ni sus partidas guardadas.

## Cómo recoger cada referencia

Registrar su enlace o archivo, el elemento concreto que interesa al usuario y lo que quiere aprovechar de él. Distinguir una preferencia confirmada de una interpretación pendiente. Una referencia a un botón, una pantalla o una animación no implica adoptar toda la estética del ejemplo.

| Referencia | Elemento concreto | Qué aprovechar | Qué evitar | Estado |
| --- | --- | --- | --- | --- |
| [01 - MAGI](assets/references/evangelion/01-magi.png) | Tres módulos dentro de un instrumento circular, anillos y rótulos naranjas/verdes | Relaciones visibles entre los tres subsistemas; geometría que explica dependencias | Microtexto ilegible y rotación del texto operativo | Aportada por el usuario; lectura propuesta |
| [02 - Cuenta atrás](assets/references/evangelion/02-countdown.png) | Cifras de siete segmentos dominantes, etiquetas condensadas y bandas de estado | El tiempo como instrumento principal durante la apertura del portal | Inclinar la UI para imitar el encuadre de la captura; usar cifras segmentadas en texto corriente | Aportada por el usuario; lectura propuesta |
| [03 - Campo de sensores](assets/references/evangelion/03-sensor-field.png) | Campo multicolor sobre negro, retícula y escalas, datos en ámbar | Una visualización amplia para sintonización o campo del portal | Usar el espectro multicolor como decoración de toda la interfaz | Aportada por el usuario; lectura propuesta |
| [04 - Teléfono NERV](assets/references/evangelion/04-nerv-phone.png) | Módulos compactos, cableado, indicadores y superficies rojo oscuro | Gramática consistente para muchos controles reales dentro de un mismo sistema | Heredar la densidad y el tamaño de letra de un teléfono antiguo | Aportada por el usuario; lectura propuesta |
| [05 - Malla de sincronización](assets/references/evangelion/05-sync-mesh.png) | Ondas multicolor con malla hexagonal y ejes graduados | Relacionar frecuencia, amplitud y superposición con Sandai | Confundir grosor, brillo o detalle de malla con información que el juego no calcula | Aportada por el usuario; lectura propuesta |
| [06 - Ondas superpuestas](assets/references/evangelion/06-waveforms.png) | Familias de trazos rojos, azules y blancos, escala y gran área negra | Hacer visible la aproximación entre señal objetivo y señal ajustada | Añadir múltiples señales decorativas que oculten las dos que se comparan | Aportada por el usuario; lectura propuesta |
| [07 - Flujo sincronizado](assets/references/evangelion/07-sync-flow.png) | Chevrones verdes conectados con líneas ámbar y etiquetas SYNC | Mostrar preparación, conexión y transferencia con dirección y estado | Suponer que cada repetición debe ser un botón | Aportada por el usuario; lectura propuesta |
| [08 - Flujo con fallos](assets/references/evangelion/08-sync-fault.png) | Ramas verdes y rojas, cruces y etiquetas técnicas | Diagnóstico de dependencias; distinguir una ruta lista de una bloqueada | Comunicar el fallo solo mediante color | Aportada por el usuario; lectura propuesta |
| [09 - Acceso CENTRAL DOGMA](assets/references/evangelion/09-central-dogma.png) | Rótulo rojo iluminado, identificación, nivel de acceso y cierre | Estados inequívocos de conexión, bloqueo y emergencia para Nidai | Importar logos, nombres o controles de acceso que no pertenecen a Minerva | Aportada por el usuario; lectura propuesta |

Las observaciones de esta tabla describen las imágenes y proponen usos; no son preferencias de detalle confirmadas por el usuario. La investigación externa se recoge en [RESEARCH_UI_EVANGELION.md](RESEARCH_UI_EVANGELION.md), con fuentes originales y distinción entre material oficial y reinterpretaciones.

## Lectura visual provisional

Las capturas combinan instrumentación, diagramas de sistemas y señalética de emergencia. El negro deja espacio a los trazos luminosos; ámbar/naranja organiza y rotula; verde y rojo distinguen estados en los diagramas de flujo; el multicolor se concentra en los campos y ondas. Estas funciones son observaciones de las imágenes aportadas, no una especificación oficial de Evangelion.

La jerarquía alterna grandes datos operativos con anotaciones técnicas pequeñas. Hay tipografía condensada, números segmentados, líneas finas, escalas y geometría modular. La aplicación concreta a Minerva debe conservar texto legible, controles reconocibles y estados que también se expliquen mediante etiquetas o formas.

Las imágenes son estáticas: no permiten confirmar velocidad de animación, secuencias de transición ni comportamiento interactivo. El movimiento se estudiará como una propuesta, no como una reproducción verificada de estas capturas.

## Familias que explorar

- **MAGI - arquitectura de sistemas:** Ichidai, Sandai y Nidai como módulos relacionados; líneas de conexión y estado.
- **Instrumentación de sincronización:** ondas, campo, escalas y superposición como protagonista de Sandai.
- **Circuitos de sincronización:** rutas de recursos y conexión, segmentos activos y fallos localizados en Ichidai y Nidai.
- **Secuencia de emergencia:** reloj de gran tamaño, cambios de estado y señalética para la ventana del portal.

Estas familias informaron las tres propuestas. La composición aprobada es A - Puente de mando. El teléfono NERV aporta además una referencia de traducción de ese lenguaje a controles y módulos manipulables.

## Decisiones abiertas

Composición y navegación; protagonismo de la consola y los instrumentos; tipografía; color; iconografía; materiales y texturas; movimiento; adaptación a distintos tamaños de pantalla.

La composición A fija la prioridad: instrumentos grandes arriba y consola ancha abajo. Tampoco convertir los límites del prototipo en decisiones de producto confirmadas.

## Primera ronda de propuestas

Petición confirmada: aplicación a pantalla completa, instrumentos grandes y línea de comandos como entrada principal. Modo de la superficie: Operate. Las propuestas son composiciones de escritorio 16:9 para un único campo de visión, sin desplazamiento de página; el historial de terminal podrá desplazarse de forma independiente al implementar.

Las tres muestran el mismo estado de sintonización: señal 02, frecuencia 3.2 Hz, amplitud 57 %, sincronía 92 % frente al umbral 97 %, energía 55 %, refrigeración y materia W al 100 %. El portal está cerrado y los 45 segundos todavía no corren. La orden `sandai tune 3.4 0.62` está escrita en el prompt, pendiente de ejecutar. Es contenido de demostración derivado de las reglas, no una partida del usuario.

| Propuesta | Composición | Ventaja | Compromiso |
| --- | --- | --- | --- |
| [A - Puente de mando](.impeccable/mocks/01-puente-de-mando.png) | Instrumentos en la zona superior y consola ancha debajo | Prompt muy visible y lectura simultánea de los tres subsistemas | Menos altura para historial que la opción lateral |
| [B - Terminal lateral](.impeccable/mocks/02-terminal-lateral.png) | Terminal alta a la izquierda; ondas, recursos y portal a la derecha | Más espacio para seguir la secuencia de órdenes | La longitud visible de una orden depende del ancho de la columna |
| [C - Núcleo MAGI](.impeccable/mocks/03-nucleo-magi.png) | Instrumento circular y sectores angulares conectados con una consola inferior | Mayor presencia de máquina integrada y composición radial | Más geometría alrededor de los datos; requiere cuidar la jerarquía al implementar |

Son imágenes de composición. El dibujo de las gráficas no es una simulación matemática; su geometría, unidades, accesibilidad, comportamiento y adaptación a otros tamaños se validarán al construir la propuesta elegida. Los prompts y sus referencias se conservan junto a cada imagen. El usuario eligió A; la implementación sigue esa composición con gráficas calculadas desde el juego.

## Registro de decisiones

- `PRODUCT.md` recoge la base de producto confirmada y distingue las capacidades actuales de las decisiones todavía abiertas.
- Este archivo recogerá referencias y observaciones durante la exploración.
- `DESIGN.md` y `.impeccable/design.json` recogerán el sistema visual cuando exista una dirección elegida y construida.

La composición A está aprobada e implementada. El sistema de efectos utiliza WebGL nativo y conserva SVG como alternativa.
