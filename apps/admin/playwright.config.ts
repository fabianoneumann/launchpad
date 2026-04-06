import { defineConfig, devices } from '@playwright/test'

// NO_COLOR conflicts with FORCE_COLOR (set by pnpm/terminal) causing a Node.js warning.
// Removing it here lets FORCE_COLOR take effect cleanly in all worker processes.
delete process.env.NO_COLOR

export default defineConfig({
  globalSetup: './tests/e2e/global-setup.ts',
  testDir: './tests/e2e',
  fullyParallel: true,
  workers: process.env.CI ? undefined : 3,
  timeout: 60000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  expect: {
    timeout: 10000,
  },
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
