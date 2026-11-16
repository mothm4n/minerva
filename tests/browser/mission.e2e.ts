import { test, expect, begin, command, preparePortal, savedGame } from './helpers';

test('completa los tres subsistemas y conserva la victoria al recargar', async ({ page }) => {
  await begin(page);
  await command(page, 'nidai start portal');
  await expect(page.locator('#command-feedback')).toHaveAttribute('data-kind', 'error');
  expect((await savedGame(page)).energy).toBe(100);
  await preparePortal(page);
  await command(page, 'nidai start portal');
  await expect.poll(async () => (await savedGame(page)).stage).toBe('open');
  await command(page, 'nidai transfer');
  await expect.poll(async () => (await savedGame(page)).stage).toBe('transfer');
  await page.locator('#emergency').click();
  await expect.poll(async () => (await savedGame(page)).stage, { timeout: 20_000 }).toBe('won');
  await expect(page.locator('#result-dialog')).toBeVisible();
  expect((await savedGame(page)).transferred).toBe(10);
  await page.locator('#close-result').click();
  await page.reload();
  await expect.poll(async () => (await savedGame(page)).stage).toBe('won');
  await expect(page.locator('.terminal-output')).toContainText('Session restored.');
});

test('pausa, recupera el guardado y pide confirmación al reiniciar', async ({ page }) => {
  await begin(page);
  await preparePortal(page);
  await command(page, 'nidai start portal');
  await expect.poll(async () => (await savedGame(page)).remaining).toBeLessThan(44);
  await page.locator('#pause').click();
  const paused = await savedGame(page);
  expect(paused.paused).toBe(true);
  await page.waitForTimeout(1100);
  expect(await savedGame(page)).toEqual(paused);
  await page.reload();
  await expect(page.locator('body')).toHaveAttribute('data-paused', 'true');
  expect(await savedGame(page)).toEqual(paused);
  await page.locator('#pause').click();
  await expect.poll(async () => (await savedGame(page)).remaining).toBeLessThan(paused.remaining);
  await page.locator('#pause').click();
  const beforeReset = await savedGame(page);
  await command(page, 'restart');
  await expect(page.locator('#reset-dialog')).toBeVisible();
  await page.locator('#cancel-reset').click();
  expect(await savedGame(page)).toEqual(beforeReset);
  await command(page, 'restart');
  await page.locator('#confirm-reset').click();
  await expect.poll(async () => (await savedGame(page)).stage).toBe('matter');
  expect(await savedGame(page)).toMatchObject({ energy: 100, matter: 0, cooling: 0, remaining: 45, paused: false });
});

test('permite completar órdenes, recuperar el historial y salir con el teclado', async ({ page }) => {
  await begin(page);
  await page.locator('#focus-terminal').click();
  await page.keyboard.type('ichidai plug w_');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect.poll(async () => (await savedGame(page)).stage).toBe('cooling');
  await page.keyboard.press('ArrowUp');
  await expect(page.locator('.cmd')).toContainText('ichidai plug w_matter');
  await page.keyboard.press('Escape');
  await expect(page.locator('#focus-terminal')).toBeFocused();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('#focus-terminal')).toBeFocused();
});

test('el idioma conserva el progreso y la consola sigue en inglés', async ({ page }) => {
  await begin(page);
  await command(page, 'ichidai plug w_matter');
  await page.locator('#pause').click();
  const paused = await savedGame(page);
  await page.locator('#focus-terminal').click();
  await page.keyboard.type('ichidai plug cooling');
  await page.locator('.utilities [popovertarget="guide"]').click();
  for (const language of ['ja', 'en', 'es']) {
    await page.locator('#language').selectOption(language);
    await expect(page.locator('html')).toHaveAttribute('lang', language);
    await expect(page.locator('#console')).toHaveAttribute('lang', 'en');
    await expect(page.locator('.cmd')).toContainText('ichidai plug cooling');
    expect(await savedGame(page)).toEqual(paused);
  }
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.locator('.terminal-output')).toContainText('Session restored.');
});

test('descarta un guardado inválido sin bloquear el inicio', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('minerva.prototype.v1', '{invalid'));
  await page.goto('/');
  await expect(page.locator('#save-status')).not.toBeEmpty();
  await page.locator('#start').click();
  await expect.poll(async () => (await savedGame(page)).stage).toBe('matter');
  expect((await savedGame(page)).energy).toBe(100);
});
