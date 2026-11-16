# Minerva

- `main` contiene la web para un jugador. La versión original está en `legacy/openframeworks`, fijada por `v1.0.0-openframeworks`. Conserva esa referencia histórica.
- Antes de cambiar reglas o alcance, lee `PRODUCT.md`. Para interfaz lee `DESIGN.md`; para audio, shaders o CRT, lee `EFECTOS.md`. `DISENO_PROTOTIPO.md` y los documentos `RESEARCH_*` son antecedentes, no requisitos actuales.
- Los comandos de instalación y comprobación están en `README.md`. Ejecuta `npm run check` al cambiar código y `npm run ci:local` antes de publicar. El CI es local; conserva las pruebas de navegador en `tests/browser/`.
- `public/sounds/originals.json` identifica los audios originales. Las pruebas verifican sus bytes. Consulta el código antiguo con `git show v1.0.0-openframeworks:src/testApp.cpp` sin cambiar de rama ni descargarlo otra vez.
- `output/` y `.impeccable/review/` son evidencias locales descartables. Conserva en Git las pruebas que deban poder repetirse.
- Usa el guion corto (`-`) como separador al redactar.
