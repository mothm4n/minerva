import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.MINERVA_TEST_PORT ?? 4175);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('MINERVA_TEST_PORT must be a port between 1024 and 65535.');
const deployedURL = process.env.MINERVA_TEST_URL;
const baseURL = deployedURL ?? `http://127.0.0.1:${port}/minerva/`;

export default defineConfig({
  testDir: './tests/browser',
  testMatch: '**/*.e2e.ts',
  forbidOnly: true,
  workers: 1,
  retries: 0,
  timeout: 45_000,
  globalTimeout: 5 * 60_000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    ...devices['Desktop Chrome'],
    baseURL,
    viewport: { width: 1440, height: 900 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: deployedURL ? undefined : {
    command: `npm run build && npm run preview -- --port ${port} --strictPort`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
