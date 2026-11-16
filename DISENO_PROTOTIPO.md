# Minerva - decisiones del prototipo

Una consola de laboratorio oscura, contenida y legible: el ámbar representa la señal que manipula el jugador.

La pantalla responde a «¿Qué falta para volver a casa?». Un encabezado de misión, tres subsistemas en paralelo y una consola con una guía contextual componen un único espacio de trabajo.

Ichidai contiene recursos; Nidai muestra lector, destino y portal; Sandai contiene cinco señales y el ajuste de frecuencia/amplitud. La firma visual es la onda real del puzle y el diagrama del portal, ambos construidos con SVG y estado de juego.

La selección toma la dirección data-terminal, semilla 359318743. La consola solicitada justifica IBM Plex Mono; Public Sans se usa para la interfaz. Se sustituye la barra lateral sorteada por un encabezado porque solo existe un espacio de trabajo. Superficies oscuras neutras, indicadores discretos, controles activos subrayados y sin brillos decorativos.

El movimiento se limita al trazado de la onda, los indicadores de progreso y los cambios de estado. La preferencia de movimiento reducido detiene el desplazamiento de la onda. La misión se pausa al ocultar la pestaña.

Alcance: aplicación nueva sin código previo que modificar. Incluye motor de comandos/reglas, entrada jQuery Terminal, tres subsistemas, audio Howler, SVG, guardado validado, pruebas de reglas, recorrido de navegador y documentación. Solo se escribe una clave propia de localStorage. Reiniciar requiere confirmación.

Primera misión: preparar recursos, activar lector, encontrar la segunda señal (el hogar), sincronizarla, conectar, abrir el portal y transferir. El tiempo solo corre cuando el portal está abierto. Los comandos de configuración repetidos son inocuos. Los errores de orden se explican. Se puede repetir tras un fallo.

Para esta primera versión no hay claves de acceso, mando de game master, teletransporte antiguo ni múltiples misiones. A petición del usuario, los sonidos sintéticos iniciales se han sustituido por 16 archivos idénticos a los del repositorio original. Su correspondencia y procedencia están documentadas en README.md y public/sounds/originals.json.

## Revisión visual

ROUND 1

Seen in one second: una consola oscura con tres sistemas y una misión de retorno.
Idea (one sentence): recuperar un portal de laboratorio haciendo cooperar sus tres subsistemas.
Live thing: la sincronización de ondas de Sandai modifica el destino disponible para Nidai.
Layout words by section: encabezado=misión y reloj / sistemas=tres instrumentos / trabajo=consola y guía.
Scores: design 7 · usability 6.5 · creativity 7 · content 8 → overall 7.0.
Caps applied: se evalúa como aplicación, con monospace, separadores y numeración funcionales.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. `output/design-check/mobile-fold.jpg`: el botón de inicio quedaba tras los tres sistemas. La introducción pasa arriba antes de comenzar.
2. `output/design-check/tablet-fold.jpg`: Nidai y las leyendas se comprimían en tres columnas. En tableta se usan dos columnas y Sandai ocupa el ancho completo.
3. Las etiquetas pequeñas y los números necesitaban mayor consistencia. Se fija un mínimo de 11 px y cifras tabulares; se mantienen los textos auxiliares compactos.

ROUND 2

Seen in one second: Minerva propone volver a casa y permite iniciar la misión desde la primera pantalla.
Idea (one sentence): una consola de retorno que combina órdenes escritas con instrumentos del portal.
Live thing: la onda ámbar se ajusta contra una referencia real; los recursos y la transferencia reflejan el motor de juego.
Layout words by section: escritorio=tres sistemas y consola con guía / tableta=dos sistemas y espectro ancho / móvil=introducción seguida de instrumentos apilados.
Scores: design 7.5 · usability 7.5 · creativity 7 · content 8 → overall 7.5.
Caps applied: ninguno adicional a los criterios de aplicación; valoración interna, no evaluación de usuarios.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. `output/design-final/desktop-fold.jpg`: abundan los textos de 11-12 px. Se acepta como límite del prototipo; una siguiente revisión debería priorizar legibilidad con usuarios.
2. `output/design-final/mobile-page-01.jpg`: tres instrumentos requieren desplazamiento. Una futura interfaz móvil puede seguir el subsistema activo sin ocultar los otros.
3. `output/design-final/tablet-page-01.jpg`: antes de empezar hay espacio libre en la consola. Se reserva para su historial durante la partida.

El inspector de la compilación final pasa a 1440, 768 y 390 px, sin fallos y con un aviso de texto pequeño. Se han abierto las capturas de cada tamaño. No hay imágenes de terceros: el símbolo y los instrumentos SVG se han creado para el prototipo. Los sonidos proceden del Minerva original.

## Comprobaciones funcionales

Ocho pruebas de Vitest cubren la misión completa, el orden de preparación, las repeticiones, el destino y la sincronización, la pausa, el cierre por tiempo, entradas numéricas inválidas y guardados corruptos. Cuatro pruebas adicionales cubren el audio: ausencia de capas duplicadas mientras carga, secuencia de arranque/bucle/cierre, pausa y silencio, y reintento de carga. La compilación de TypeScript y Vite pasa.

En Chrome se comprueba el recorrido de victoria en desarrollo y en la versión compilada, el ajuste con deslizadores, autocompletado, historial, salida con Esc y Mayús+Tab, recuperación de partida en pausa, cancelación del reinicio y representación literal de entradas con HTML. No se han probado teléfonos físicos ni lectores de pantalla reales.

Tras recuperar el audio original se comprueban los 16 archivos contra sus identificadores de Git, tanto en public como en dist. En Chrome se verifica su carga y decodificación, el paso real del arranque al bucle del toroide y del portal, el silencio completo al desactivar sonido, la pausa sin avance de la posición de reproducción y el cierre de todas las capas al ganar. La mezcla no se ha calibrado en altavoces o auriculares físicos distintos.
