import { test as base, expect, type Page } from '@playwright/test';
import type { Game } from '../../src/game';

export const test = base.extend({
  page: async ({ page }, use) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
    });
    await use(page);
    expect(errors, 'JavaScript errors or missing assets').toEqual([]);
  },
});
export { expect };

export async function savedGame(page: Page): Promise<Game> {
  return page.evaluate(() => JSON.parse(localStorage.getItem('minerva.prototype.v1')!).game);
}

export async function begin(page: Page) {
  await page.goto('./');
  await page.locator('#start').click();
  await expect(page.locator('#sound')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#sound').click();
  await expect.poll(async () => (await savedGame(page)).stage).toBe('matter');
}

export async function command(page: Page, value: string) {
  await page.locator('#focus-terminal').click();
  await page.keyboard.type(value);
  await page.keyboard.press('Enter');
}

export async function preparePortal(page: Page) {
  for (const value of [
    'ichidai plug w_matter', 'ichidai plug cooling', 'ichidai plug toroid',
    'nidai set reader', 'sandai show connections', 'sandai select 2',
    'sandai tune 3.4 0.62', 'sandai lock', 'nidai connect 532924',
  ]) await command(page, value);
  await expect.poll(async () => (await savedGame(page)).stage).toBe('portal');
}
