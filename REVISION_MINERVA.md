# Minerva - revisión y propuesta web

Revisión: 15 de noviembre de 2026.

Repositorio: [mothm4n/minerva](https://github.com/mothm4n/minerva). Referencia examinada: `2788f1a5d7f4ae83bc206cda9b5095247f1b04f8`.

Preferencia confirmada: versión para navegador, simulando una línea de comandos, para un solo jugador y sin intervención de game master.

Este documento recoge la revisión del código y una propuesta de adaptación. La versión web todavía no está implementada.

## Recomendación

Reimplementar el juego con tecnologías web y conservar su identidad: Ichidai, Nidai, Sandai, comandos, recursos, ondas y portales. El trabajo principal consiste en convertir una herramienta dirigida por un game master en una experiencia que pueda completarse de forma autónoma.

La primera versión puede funcionar enteramente en el navegador. En el código de aplicación examinado, el cliente TCP está declarado pero no se utiliza para conectar, enviar o recibir datos. No hace falta reproducir un servidor de juego para conservar ese comportamiento. [Declaración original](https://github.com/mothm4n/minerva/blob/2788f1a5d7f4ae83bc206cda9b5095247f1b04f8/src/testApp.h#L75).

## Qué contiene el original

Es una aplicación C++ con openFrameworks, OpenGL y bibliotecas de sonido, preparada para Visual Studio y Windows. El proyecto referencia dependencias externas mediante rutas relativas que no están incluidas como código fuente en este repositorio. Casi toda la aplicación vive en `src/testApp.cpp`, con unas 2.660 líneas que mezclan reglas, entrada de teclado, dibujo, sonido y tiempos. [Proyecto](https://github.com/mothm4n/minerva/blob/2788f1a5d7f4ae83bc206cda9b5095247f1b04f8/networkTcpClientExample.vcxproj), [aplicación](https://github.com/mothm4n/minerva/blob/2788f1a5d7f4ae83bc206cda9b5095247f1b04f8/src/testApp.cpp).

El historial consultado contiene cambios de aplicación de octubre de 2010 y un cambio del README de julio de 2017. También hay ejecutables, DLL, archivos de compilación y una copia antigua del archivo principal. No aparecen pruebas automatizadas en el árbol examinado; `testApp` es el nombre de la aplicación.

| Subsistema | Función existente | Qué conservar |
| --- | --- | --- |
| Ichidai | Electricidad, refrigeración, materia W y activación del toroide | Preparación y diagnóstico de los recursos |
| Nidai | Lector, conexión a destinos, portal y teletransporte | Secuencia de activación y consecuencias de cada orden |
| Sandai | Selección de ondas, ajuste de frecuencia y amplitud, anclaje | Puzle de sincronización y descubrimiento del destino |

Hay cinco códigos de mundo y dos modos: el de portal, identificado en pantalla como versión 10.0, y el antiguo de teletransporte, identificado como 0.69b. El modo antiguo incluye habitaciones que el game master habilita manualmente. No son solo dos apariencias: cambian los comandos y los requisitos. [Comandos y destinos](https://github.com/mothm4n/minerva/blob/2788f1a5d7f4ae83bc206cda9b5095247f1b04f8/src/testApp.cpp#L13), [selección de modo](https://github.com/mothm4n/minerva/blob/2788f1a5d7f4ae83bc206cda9b5095247f1b04f8/src/testApp.cpp#L469).

Los recursos incluyen siete imágenes y 21 archivos de sonido. Son material para evaluar al recuperar la ambientación; no he comprobado su reproducción ni sus licencias.

## Cambios necesarios para jugar solo

1. **Abastecimiento de materia W.** Empieza en cero y el incremento del comando `ichidai plug w_matter` está comentado. Las vías activas para aumentarla son el control del master y la apertura forzada. El recorrido ordinario no permite sostener el portal sin esa ayuda. La nueva versión debe cargarla mediante una acción del jugador y explicar el coste. [Carga de materia](https://github.com/mothm4n/minerva/blob/2788f1a5d7f4ae83bc206cda9b5095247f1b04f8/src/testApp.cpp#L1821).

2. **Resultado del puzle.** Enter asigna directamente `gameOK=true`. Además, el permiso de continuar (`fOK`) se concede al terminar la secuencia según los pasos anteriores, sin exigir haber superado la sincronización. Para una partida autónoma, el umbral debe validar realmente la onda y desbloquear el destino correcto. [Enter](https://github.com/mothm4n/minerva/blob/2788f1a5d7f4ae83bc206cda9b5095247f1b04f8/src/testApp.cpp#L1399), [validación y avance](https://github.com/mothm4n/minerva/blob/2788f1a5d7f4ae83bc206cda9b5095247f1b04f8/src/testApp.cpp#L2037).

3. **Objetivo y desenlace.** El original abre el portal, consume recursos y acaba cerrándolo. No he encontrado una condición explícita de misión completada. Propongo que una primera misión termine cuando el jugador estabilice el portal hacia el destino requerido y complete una transferencia. Esta misión sería diseño nuevo, no contenido recuperado.

4. **Pistas y claves.** Las contraseñas están en el código y en las instrucciones para el master. Si se conservan como parte del juego, deben poder descubrirse dentro de la experiencia mediante registros o pistas. Una clave narrativa no necesita convertirse en una cuenta de usuario.

5. **Recuperación.** Repetir algunos comandos puede invalidar pasos que ya estaban completados y seguir consumiendo recursos. Propongo que una orden ya realizada informe del estado sin penalización, que las operaciones inválidas expliquen qué falta y que un fallo permita reintentar la misión.

6. **Reloj fiable.** Muchas transiciones comprueban un segundo exacto, por ejemplo `T == countdown + 5`. Un salto en las actualizaciones puede omitir esa transición. La nueva lógica debe avanzar por tiempo transcurrido y ejecutar cada transición una sola vez. Propongo pausar la partida al ocultar la pestaña; los navegadores limitan temporizadores y animaciones en segundo plano. [Temporización original](https://github.com/mothm4n/minerva/blob/2788f1a5d7f4ae83bc206cda9b5095247f1b04f8/src/testApp.cpp#L1824), [comportamiento del navegador](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API).

7. **Interpretación exacta de órdenes.** Actualmente se busca cada comando como un fragmento de texto, de modo que puede reconocerse dentro de una entrada más larga. Conviene reconocer la orden completa y validar sus argumentos, con un mensaje útil cuando falle. [Interpretación original](https://github.com/mothm4n/minerva/blob/2788f1a5d7f4ae83bc206cda9b5095247f1b04f8/src/testApp.cpp#L425).

## Primera versión propuesta

Una misión completa basada en el modo portal, pensada inicialmente para ordenador con teclado. Conservar los nombres y las órdenes originales permite reconocer Minerva desde la primera interacción.

Secuencia propuesta:

1. Arranque del sistema y presentación del objetivo.
2. Consulta de ayuda y descubrimiento de las claves dentro del juego.
3. Carga de materia W, activación de refrigeración y toroide.
4. Activación del lector y selección de una señal en Sandai.
5. Ajuste de la onda hasta alcanzar la sincronización requerida.
6. Conexión al código descubierto.
7. Apertura y estabilización del portal, seguida de la transferencia y el desenlace.

Órdenes originales que forman el recorrido principal:

```text
help
ichidai plug w_matter
ichidai plug cooling
ichidai plug toroid
nidai set reader
sandai show connections
nidai connect <código descubierto>
nidai start portal
```

Mantener también el diagnóstico y el reinicio. Añadir historial de órdenes, autocompletado, ayuda contextual, pausa y guardado de progreso. Las ayudas no deben revelar respuestas del puzle.

La pantalla propuesta tiene tres zonas de estado compactas para los subsistemas y una consola principal con historial, mensajes y prompt. La onda aparece en el área de Sandai durante el puzle. Tipografía monoespaciada, fondo oscuro, colores legibles y sonido discreto conservan el carácter de terminal. Las animaciones deben poder reducirse y el juego debe seguir siendo comprensible sin sonido.

Dejar el teletransporte antiguo para una segunda misión permitiría validar primero un recorrido completo. Esto es una propuesta de alcance, no una decisión confirmada por el usuario.

## Implementación mínima

HTML y CSS para la consola y los indicadores; TypeScript para interpretar comandos y gestionar la partida; SVG o Canvas para las ondas. La lógica del juego debe estar separada del dibujo y del audio, con estados explícitos y unas pocas funciones para órdenes y avance del tiempo.

No se necesita una terminal del sistema operativo: las órdenes tienen significado dentro del juego. Un campo de texto y un historial accesible cubren la interacción inicial. La salida se debe insertar como texto, sin interpretar HTML introducido por el jugador ni ejecutar órdenes del equipo.

Para guardar una partida pequeña, `localStorage` permite conservar datos entre sesiones. Hay que validar lo recuperado y manejar almacenamiento bloqueado o datos inválidos. El guardado sería local a ese navegador y podría perderse al borrar sus datos. [Documentación de almacenamiento](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

El sonido debe iniciarse tras una interacción explícita y tolerar que el navegador lo bloquee. [Reproducción de audio](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay).

El alcance de implementación incluiría reglas de juego, comandos, consola, puzle, sonido, guardado, contenido de misión, pruebas y documentación. Evitar una traducción literal de las variables globales del C++ permite corregir los acoplamientos observados.

## Comprobaciones para considerar terminada esa versión

- Se puede completar la misión desde cero sin conocer las contraseñas del README ni usar controles del master.
- Una onda incorrecta no desbloquea el destino; una correcta sí.
- Un comando inválido o repetido no rompe el progreso ni consume recursos indebidamente.
- Los recursos quedan dentro de sus límites y el agotamiento produce un desenlace recuperable.
- Pausar, ocultar la pestaña y recargar conservan un estado coherente y no duplican eventos.
- Guardado no disponible o inválido y audio bloqueado no impiden jugar.
- Todo el recorrido funciona con teclado; hay foco visible y estados comprensibles sin depender solo del color.

## Límites de esta revisión

He leído el código principal, las cabeceras, el arranque, las instrucciones, el proyecto de compilación, el árbol de archivos y el historial reciente. La revisión es estática: no he compilado ni ejecutado los binarios de Windows, ni probado su sonido o aspecto en funcionamiento. Los hallazgos se refieren al código examinado; no garantizan que los ejecutables publicados correspondan exactamente a él.

No he modificado el repositorio remoto ni implementado todavía la adaptación. El equilibrio de recursos, las pistas y la duración de la misión deben validarse jugando.
