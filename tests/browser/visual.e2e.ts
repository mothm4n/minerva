import { test, expect, begin, command, preparePortal, savedGame } from './helpers';

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
