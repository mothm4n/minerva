import { test, expect, begin, command, preparePortal, savedGame } from './helpers';
import { translations } from '../../src/i18n';

const capture = process.env.MINERVA_CAPTURE === '1';
const viewports = [
  { width: 1672, height: 941 },
  { width: 1440, height: 900 },
  { width: 1280, height: 800 },
  { width: 768, height: 1024 },
  { width: 390, height: 909 },
  { width: 320, height: 900 },
];

test.use({ video: capture ? { mode: 'on', size: { width: 1672, height: 941 } } : 'off' });

test('la composición A conserva tres instrumentos y la consola compacta debajo', async ({ page }, testInfo) => {
  await begin(page);
  await preparePortal(page);
  await page.locator('#pause').click();
  await page.evaluate(() => document.fonts.ready);
  for (const viewport of viewports) {
    await test.step(`${viewport.width} × ${viewport.height}`, async () => {
      await page.setViewportSize(viewport);
      const layout = await page.evaluate(() => {
        const rect = (selector: string) => document.querySelector(selector)!.getBoundingClientRect().toJSON();
        const font = (selector: string) => parseFloat(getComputedStyle(document.querySelector(selector)!).fontSize);
        return {
          instruments: ['#ichidai', '#sandai', '#nidai'].map(rect),
          systems: rect('.systems'), console: rect('#console'), prompt: rect('#terminal .cmd'),
          history: rect('.terminal-output'),
          historyFont: font('.terminal-output'), promptFont: font('#terminal .cmd'),
          pageWidth: document.documentElement.scrollWidth,
          pageHeight: document.documentElement.scrollHeight,
        };
      });
      const { instruments, systems, console: terminal, prompt, history } = layout;
      expect(layout.pageWidth).toBeLessThanOrEqual(viewport.width);
      expect(terminal.top).toBeGreaterThanOrEqual(systems.bottom);
      expect(Math.abs(terminal.left - systems.left)).toBeLessThanOrEqual(1);
      expect(Math.abs(terminal.right - systems.right)).toBeLessThanOrEqual(1);
      for (const instrument of instruments) {
        expect(instrument.width).toBeGreaterThan(0);
        expect(instrument.height).toBeGreaterThan(0);
        expect(instrument.bottom).toBeLessThanOrEqual(terminal.top);
      }
      if (viewport.width > 900) {
        expect(layout.pageHeight).toBeLessThanOrEqual(viewport.height);
        expect(Math.max(...instruments.map(box => box.top)) - Math.min(...instruments.map(box => box.top))).toBeLessThanOrEqual(1);
        expect(instruments[0].right).toBeLessThanOrEqual(instruments[1].left);
        expect(instruments[1].right).toBeLessThanOrEqual(instruments[2].left);
        expect(instruments[1].width).toBeGreaterThan(instruments[0].width);
        expect(instruments[1].width).toBeGreaterThan(instruments[2].width);
      }
      expect(layout.historyFont).toBeGreaterThanOrEqual(13);
      expect(layout.historyFont).toBeLessThanOrEqual(18);
      expect(layout.promptFont).toBeGreaterThan(layout.historyFont);
      expect(layout.promptFont).toBeLessThanOrEqual(28);
      expect(prompt.top).toBeGreaterThanOrEqual(history.bottom - 1);
      expect(prompt.bottom).toBeLessThanOrEqual(terminal.bottom);
      expect(prompt.height).toBeGreaterThan(0);
      if (capture) await testInfo.attach(`composition-${viewport.width}`, {
        body: await page.screenshot({ path: testInfo.outputPath(`composition-${viewport.width}.png`), fullPage: true }), contentType: 'image/png',
      });
    });
  }
});

for (const language of ['es', 'en', 'ja']) {
  test(`sincronía al 100 % y transferencia legibles en todos los tamaños - ${language}`, async ({ page }, testInfo) => {
    await page.addInitScript(value => localStorage.setItem('minerva.language', value), language);
    await begin(page);
    await preparePortal(page);
    await expect(page.locator('#sync-value')).toHaveText('100 %');
    await command(page, 'nidai start portal');
    await command(page, 'nidai transfer');
    await expect.poll(async () => (await savedGame(page)).transferred).toBeGreaterThanOrEqual(3);
    await page.locator('#pause').click();
    await expect(page.locator('body')).toHaveAttribute('data-paused', 'true');
    await expect(page.locator('#transfer-value')).toHaveText(/^\d{2} %$/);
    await page.evaluate(() => document.fonts.ready);
    for (const viewport of viewports) {
      await test.step(`${viewport.width} × ${viewport.height}`, async () => {
        await page.setViewportSize(viewport);
        for (const [selector, container] of [['#sync-value', '.sync-readout'], ['#transfer-value', '#transfer-status']]) {
          await expect(page.locator(selector)).toBeVisible();
          const reading = await page.locator(selector).evaluate((element, parent) => {
            const range = document.createRange();
            range.selectNodeContents(element);
            return {
              lines: new Set(Array.from(range.getClientRects(), rect => Math.round(rect.top))).size,
              text: range.getBoundingClientRect().toJSON(),
              container: element.closest(parent)!.getBoundingClientRect().toJSON(),
            };
          }, container);
          expect(reading.lines, `${selector} must stay on one line`).toBe(1);
          expect(reading.text.left).toBeGreaterThanOrEqual(reading.container.left - 1);
          expect(reading.text.right).toBeLessThanOrEqual(reading.container.right + 1);
        }
        const panel = (await page.locator('#nidai').boundingBox())!;
        for (const selector of ['#transfer-status', '.portal-status', '.mission-time']) {
          const reading = (await page.locator(selector).boundingBox())!;
          expect(reading.y, `${selector} top`).toBeGreaterThanOrEqual(panel.y);
          expect(reading.y + reading.height, `${selector} bottom`).toBeLessThanOrEqual(panel.y + panel.height - 3);
          expect(reading.x).toBeGreaterThanOrEqual(panel.x);
          expect(reading.x + reading.width).toBeLessThanOrEqual(panel.x + panel.width);
        }
        if (capture) await testInfo.attach(`transfer-${language}-${viewport.width}`, {
          body: await page.screenshot({ path: testInfo.outputPath(`transfer-${language}-${viewport.width}.png`), fullPage: true }), contentType: 'image/png',
        });
      });
    }
  });
}

test('el toroide dibuja al arrancar, se congela al pausar y no vuelve a arrancar al repetir la orden', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
  await page.addInitScript(() => {
    const draw = WebGLRenderingContext.prototype.drawArrays;
    WebGLRenderingContext.prototype.drawArrays = function (...args) {
      draw.apply(this, args);
      const canvas = this.canvas as HTMLCanvasElement;
      if (canvas.id === 'toroid-effects') canvas.dataset.testDraws = String(Number(canvas.dataset.testDraws ?? 0) + 1);
    };
  });
  await begin(page);
  await page.clock.pauseAt(new Date('2026-01-01T00:01:00Z'));
  const field = page.locator('#reactor-startup');
  const canvas = page.locator('#toroid-effects');
  const state = page.locator('#magnet-state');
  const progress = () => field.evaluate(node => Number(node.style.getPropertyValue('--ignition')));
  const draws = async () => Number(await canvas.getAttribute('data-test-draws'));

  await command(page, 'ichidai plug toroid');
  await expect(page.locator('#command-feedback')).toHaveAttribute('data-kind', 'error');
  await page.clock.runFor(64);
  await expect(field).toHaveAttribute('data-active', 'false');
  expect(await draws()).toBe(0);

  await command(page, 'ichidai plug w_matter');
  await command(page, 'ichidai plug cooling');
  await command(page, 'ichidai plug toroid');
  await expect(page.locator('#command-result')).toHaveText('Toroid powered up.');
  await page.clock.runFor(64);
  await expect(field).toBeVisible();
  await expect(state).toHaveText('Cargando');
  await expect(canvas).toHaveAttribute('data-ready', 'true');
  expect(await draws()).toBeGreaterThan(0);

  await page.clock.runFor(1736);
  await expect(state).toHaveText('Confinando');
  expect(await progress()).toBeCloseTo(0.5, 2);
  await page.locator('#pause').click();
  await page.clock.runFor(64);
  const paused = await progress();
  const pausedDraws = await draws();
  await page.clock.runFor(1000);
  expect(await progress()).toBe(paused);
  expect(await draws()).toBe(pausedDraws);

  await page.locator('#pause').click();
  await command(page, 'ichidai plug toroid');
  await expect(page.locator('#command-result')).toHaveText('That system is already active. No resources were consumed.');
  await page.clock.runFor(128);
  expect(await progress()).toBeGreaterThan(paused);
  expect(await draws()).toBeGreaterThan(pausedDraws);
  await page.clock.runFor(1700);
  await expect(state).toHaveText('Estable');
  await expect(field).toHaveAttribute('data-active', 'false');

  const settledDraws = await draws();
  await command(page, 'ichidai plug toroid');
  await page.clock.runFor(200);
  await expect(field).toHaveAttribute('data-active', 'false');
  expect(await draws()).toBe(settledDraws);
});

const protectedReadouts = {
  ichidai: '.system-heading h2, .resource label, .resource-value, .toroid-state, .reactor-caption',
  sandai: '.system-heading h2, .signal-toolbar, .sync-readout, #wave-empty, .y-axis, .x-axis, .wave-legend',
  nidai: '.system-heading h2, .reader-status, .destination-status, .portal-status, .mission-time, #transfer-status',
};

for (const language of ['es', 'en', 'ja'] as const) {
  test(`los rótulos activos dejan libres las lecturas en móvil - ${language}`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.addInitScript(value => localStorage.setItem('minerva.language', value), language);
    await begin(page);
    await expect(page.locator('html')).toHaveAttribute('lang', language);
    await page.evaluate(() => document.fonts.ready);

    for (const [order, label, ...systems] of [
      ['ichidai plug toroid', 'COMMAND REJECTED', 'ichidai'],
      ['ichidai plug w_matter', 'POWER SUPPLY', 'ichidai'],
      ['ichidai plug cooling', 'POWER SUPPLY', 'ichidai'],
      ['ichidai plug toroid', 'Magnetic field', 'ichidai'],
      ['nidai set reader', 'READER ONLINE', 'nidai', 'sandai', 'ichidai'],
      ['sandai show connections', 'SIGNAL SCAN', 'sandai'],
      ['sandai select 2', 'WAVE TUNING', 'sandai'],
      ['sandai tune 3.4 0.62', 'WAVE TUNING', 'sandai'],
      ['sandai lock', 'SIGNAL LOCKED', 'sandai', 'nidai'],
      ['nidai connect 532924', 'LINK CONFIRMED', 'nidai'],
      ['nidai start portal', 'PORTAL OPEN', 'nidai'],
      ['nidai transfer', 'TRANSFER', 'nidai'],
    ] as const) {
      await test.step(order, async () => {
        await command(page, order);
        const isField = label === 'Magnetic field';
        const selector = isField ? '.reactor-caption' : '.command-stamp';
        const panels = systems.map(system => page.locator(`#${system}`));
        for (const panel of panels) {
          const caption = panel.locator(selector);
          await expect(caption).toHaveText(language === 'en' ? label : translations[label][language]);
          if (!isField) await caption.evaluate(node => {
            // Hold the label at its readable midpoint for both widths.
            const [animation] = node.getAnimations();
            animation.pause();
            animation.currentTime = Number(animation.effect!.getTiming().duration) / 2;
          });
        }
        if (order === 'nidai transfer') await expect(page.locator('#transfer-status')).toBeVisible();
        for (const width of [320, 390]) {
          await page.setViewportSize({ width, height: 900 });
          for (const [index, system] of systems.entries()) {
            const caption = panels[index].locator(selector);
            await expect(caption).toBeVisible();
            const geometry = await caption.evaluate((node, readouts) => {
              const panel = node.closest('.system')!;
              const label = (node.closest('.reactor-startup') ?? node).getBoundingClientRect();
              const bounds = panel.getBoundingClientRect();
              const overlaps = (rect: DOMRect) => label.left < rect.right - 0.5 && label.right > rect.left + 0.5 &&
                label.top < rect.bottom - 0.5 && label.bottom > rect.top + 0.5;
              const collisions = [...panel.querySelectorAll(readouts)].filter(readout => {
                if (node === readout || getComputedStyle(readout).visibility !== 'visible') return false;
                const text = document.createRange();
                text.selectNodeContents(readout);
                return [...text.getClientRects()].some(rect => rect.width > 0 && rect.height > 0 && overlaps(rect));
              }).map(readout => readout.textContent?.trim());
              return {
                inside: label.left >= bounds.left && label.right <= bounds.right && label.top >= bounds.top && label.bottom <= bounds.bottom,
                visible: Number(getComputedStyle(node).opacity) > 0.5,
                collisions,
              };
            }, protectedReadouts[system]);
            expect.soft(geometry, `${label} in ${system} at ${width}px`).toEqual({ inside: true, visible: true, collisions: [] });
          }
        }
        if (!isField) for (const panel of panels) await panel.locator(selector).evaluate(node => {
          node.getAnimations().forEach(animation => animation.finish());
        });
      });
    }
  });
}

// Read alpha immediately after drawing: WebGL may clear its buffer after compositing.
test.describe('apertura del portal con reloj controlado', () => {
  test('la máscara abre desde el centro en 8 segundos, sin zoom y con pausa', async ({ page }, testInfo) => {
    await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
    await page.addInitScript(() => {
      const draw = WebGLRenderingContext.prototype.drawArrays;
      WebGLRenderingContext.prototype.drawArrays = function (...args) {
        draw.apply(this, args);
        const canvas = this.canvas as HTMLCanvasElement;
        if (canvas.id !== 'portal-effects') return;
        canvas.dataset.testDraws = String(Number(canvas.dataset.testDraws ?? 0) + 1);
        if (canvas.dataset.testSample !== 'pending') return;
        const pixels = new Uint8Array(canvas.width * canvas.height * 4);
        this.readPixels(0, 0, canvas.width, canvas.height, this.RGBA, this.UNSIGNED_BYTE, pixels);
        let inside = 0, transparent = 0, center = 0, centerAlpha = 0;
        const scale = Math.min(canvas.width, canvas.height) / 2;
        for (let y = 0; y < canvas.height; y++) for (let x = 0; x < canvas.width; x++) {
          const radius = Math.hypot(x + 0.5 - canvas.width / 2, y + 0.5 - canvas.height / 2) / scale;
          const alpha = pixels[(y * canvas.width + x) * 4 + 3] / 255;
          if (radius < 0.75) { inside++; if (alpha < 0.5) transparent++; }
          if (radius < 0.04) { center++; centerAlpha += alpha; }
        }
        canvas.dataset.testSample = JSON.stringify({ openArea: transparent / inside, centerAlpha: centerAlpha / center, error: this.getError() });
      };
    });
    await begin(page);
    await preparePortal(page);
    await page.evaluate(() => document.fonts.ready);
    await page.locator('#portal-world').evaluate(image => (image as HTMLImageElement).decode());
    const imageBounds = await page.locator('#portal-world').boundingBox();
    await page.clock.pauseAt(new Date('2026-01-01T00:01:00Z'));
    const portal = page.locator('#portal-effects');
    const instrument = page.locator('.portal-instrument');
    const reveal = () => instrument.evaluate(element => Number((element as HTMLElement).style.getPropertyValue('--portal-reveal')));
    async function sample(name: string) {
      await portal.evaluate(element => { (element as HTMLElement).dataset.testSample = 'pending'; });
      await page.clock.runFor(32);
      await expect(portal).toHaveAttribute('data-ready', 'true');
      await expect(portal).not.toHaveAttribute('data-test-sample', 'pending');
      await expect(page.locator('#portal-world')).toHaveCSS('transform', 'none');
      expect(await page.locator('#portal-world').boundingBox()).toEqual(imageBounds);
      const pixels = JSON.parse((await portal.getAttribute('data-test-sample'))!) as { openArea: number; centerAlpha: number; error: number };
      expect(pixels.error).toBe(0);
      if (capture) await testInfo.attach(name, {
        body: await page.screenshot({ path: testInfo.outputPath(`${name}.png`) }), contentType: 'image/png',
      });
      return pixels;
    }
    await command(page, 'nidai start portal');
    const start = await sample('portal-0s');
    expect(await reveal()).toBeLessThan(0.001);
    expect(start.openArea).toBeLessThan(0.01);
    await page.clock.runFor(3936);
    const middle = await sample('portal-4s');
    expect(await reveal()).toBeCloseTo(0.5, 2);
    expect(middle.centerAlpha).toBeLessThan(0.25);
    expect(middle.openArea).toBeGreaterThan(start.openArea + 0.02);
    await page.locator('#pause').click();
    await page.clock.runFor(32);
    const pausedReveal = await reveal();
    const pausedGame = await savedGame(page);
    const pausedDraws = await portal.getAttribute('data-test-draws');
    await page.clock.runFor(1000);
    expect(await reveal()).toBe(pausedReveal);
    expect(await savedGame(page)).toEqual(pausedGame);
    expect(await portal.getAttribute('data-test-draws')).toBe(pausedDraws);
    await page.locator('#pause').click();
    await page.clock.runFor(3984);
    expect(await reveal()).toBeLessThan(1);
    const end = await sample('portal-8s');
    expect(await reveal()).toBe(1);
    expect(end.centerAlpha).toBeLessThan(0.25);
    expect(end.openArea).toBeGreaterThan(middle.openArea + 0.15);
    expect((await savedGame(page)).stage).toBe('open');
  });
});

if (capture) {
  test('grabación real de la apertura completa del portal', async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 1672, height: 941 });
    await begin(page);
    await preparePortal(page);
    await expect(page.locator('#portal-effects')).toHaveAttribute('data-ready', 'true');
    await command(page, 'nidai start portal');
    // Real time keeps the recorded eight-second animation at its original speed.
    await expect.poll(() => page.locator('.portal-instrument').evaluate(element =>
      Number((element as HTMLElement).style.getPropertyValue('--portal-reveal'))), { timeout: 12_000 }).toBe(1);
    await page.locator('#pause').click();
    expect((await savedGame(page)).stage).toBe('open');
    await expect(page.locator('#portal-world')).toHaveCSS('transform', 'none');
    await testInfo.attach('portal-completo', {
      body: await page.screenshot({ path: testInfo.outputPath('portal-completo.png') }), contentType: 'image/png',
    });
  });
}
