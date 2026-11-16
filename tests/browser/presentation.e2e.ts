import { test, expect, begin, command, preparePortal, savedGame } from './helpers';

test('carga la imagen y las fuentes desde la ruta publicada', async ({ page }) => {
  await begin(page);
  const image = page.locator('#portal-world');
  await expect(image).toHaveAttribute('src', '/minerva/worlds/volcanic-citadel.png');
  await expect.poll(() => image.evaluate(node => (node as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.fonts.check('700 18px "Barlow Condensed"'))).toBe(true);
});

test('emergencia conserva borrador, historial y pausa; el CRT se detiene', async ({ page }) => {
  await begin(page);
  await command(page, 'ichidai plug w_matter');
  await command(page, 'pause');
  await page.locator('#focus-terminal').click();
  await page.keyboard.type('ichidai plug cooling');
  const paused = await savedGame(page);
  const history = await page.locator('.terminal-output').textContent();
  await page.locator('#emergency').click();
  await expect(page.locator('html')).toHaveAttribute('data-crt', 'on');
  const seed = await page.locator('#crt-noise').getAttribute('seed');
  await page.waitForTimeout(250);
  expect(await page.locator('#crt-noise').getAttribute('seed')).toBe(seed);
  expect(await savedGame(page)).toEqual(paused);
  expect(await page.locator('.terminal-output').textContent()).toBe(history);
  await expect(page.locator('.cmd')).toContainText('ichidai plug cooling');
  await page.locator('#pause').click();
  await expect.poll(() => page.locator('#crt-noise').getAttribute('seed')).not.toBe(seed);
  await page.locator('#emergency').click();
  await expect(page.locator('html')).not.toHaveAttribute('data-crt');
  await expect(page.locator('body')).toHaveCSS('filter', 'none');
});

test('el dibujo WebGL vuelve después de perder el contexto', async ({ page }) => {
  await begin(page);
  await preparePortal(page);
  const canvas = page.locator('#wave-effects');
  await expect(canvas).toHaveAttribute('data-ready', 'true');
  const contextLoss = await canvas.evaluateHandle(node => {
    const gl = (node as HTMLCanvasElement).getContext('webgl')!;
    const extension = gl.getExtension('WEBGL_lose_context');
    if (!extension) throw new Error('WEBGL_lose_context is unavailable');
    extension.loseContext();
    return extension;
  });
  await expect(canvas).toHaveAttribute('data-ready', 'false');
  await expect(page.locator('#reference-wave')).toHaveCSS('opacity', '1');
  await contextLoss.evaluate(extension => extension.restoreContext());
  await contextLoss.dispose();
  await expect(canvas).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('#reference-wave')).toHaveCSS('opacity', '0');
});

test('se puede ganar sin WebGL y con movimiento reducido', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, id, ...args) {
      if (String(id).includes('webgl')) return null;
      return Reflect.apply(getContext, this, [id, ...args]);
    } as typeof getContext;
  });
  await begin(page);
  await preparePortal(page);
  await expect(page.locator('#reference-wave')).toHaveCSS('opacity', '1');
  await expect(page.locator('#reference-wave')).toHaveAttribute('d', /^M0,/);
  await page.locator('#emergency').focus();
  await page.keyboard.press('Space');
  await expect(page.locator('html')).toHaveAttribute('data-crt', 'still');
  await expect(page.locator('body')).toHaveCSS('filter', 'none');
  await command(page, 'nidai start portal');
  await command(page, 'nidai transfer');
  await expect.poll(async () => (await savedGame(page)).stage, { timeout: 20_000 }).toBe('won');
});

test('mantiene accesibles consola e instrumentos en móvil, tableta y escritorio', async ({ page }) => {
  await begin(page);
  for (let index = 0; index < 8; index++) await command(page, 'help');
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const emergency of [false, true]) {
      if ((await page.locator('#emergency').getAttribute('aria-pressed') === 'true') !== emergency) await page.locator('#emergency').click();
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.locator('#focus-terminal').scrollIntoViewIfNeeded();
      await expect(page.locator('#focus-terminal')).toBeInViewport();
      await page.locator('#focus-terminal').click();
      await expect(page.locator('#terminal .cmd')).toBeInViewport();
      if (!emergency) {
        const scale = await page.evaluate(() => ({
          heading: parseFloat(getComputedStyle(document.querySelector('h1')!).fontSize),
          body: parseFloat(getComputedStyle(document.body).fontSize),
        }));
        expect(scale.heading / scale.body).toBeGreaterThanOrEqual(1.25);
      }
      await expect(page.locator('#wave')).toBeVisible();
      if (emergency) {
        const wave = await page.locator('#wave').boundingBox();
        expect(wave!.height, `Emergency wave at ${width}px`).toBeGreaterThanOrEqual(90);
      }
      const destination = await page.locator('.destination-status').boundingBox();
      const portal = await page.locator('.portal-status').boundingBox();
      expect(destination!.y + destination!.height).toBeLessThanOrEqual(portal!.y);
    }
  }
});
