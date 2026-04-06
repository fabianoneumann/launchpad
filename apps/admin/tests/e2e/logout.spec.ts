import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'

const LOGOUT_EMAIL = 'logout@test.com'
const LOGOUT_PASSWORD = '123456'

test('logout: confirmar redireciona para /login e protege rotas', async ({ page }) => {
  await loginAs(page, LOGOUT_EMAIL, LOGOUT_PASSWORD)

  await page.getByRole('button', { name: 'Sair' }).click()
  await page.getByRole('button', { name: /^sair$/i }).click()

  await expect(page).toHaveURL(/\/login/)

  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/login/)
})
