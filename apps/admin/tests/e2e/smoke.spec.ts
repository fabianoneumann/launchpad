import { expect, test } from '@playwright/test'
import { loginAsAdmin } from './helpers/auth'

test('dashboard is reachable', async ({ page }) => {
  await loginAsAdmin(page)
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
})
