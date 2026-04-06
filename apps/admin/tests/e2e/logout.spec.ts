import { test, expect } from '@playwright/test'
import { loginAsAdmin } from './helpers/auth'

test('logout: confirmar redireciona para /login e protege rotas', async ({ page }) => {
  await loginAsAdmin(page)

  await page.getByRole('button', { name: 'Sair' }).click()
  await page.getByRole('button', { name: /^sair$/i }).click()

  await expect(page).toHaveURL('/login')

  await page.goto('/dashboard')
  await expect(page).toHaveURL('/login')
})
