import { test, expect } from '@playwright/test'
import { loginAsAdmin, ADMIN_EMAIL, ADMIN_PASSWORD } from './helpers/auth'

test.describe('Login page', () => {
  test('login bem-sucedido redireciona para /dashboard', async ({ page }) => {
    await loginAsAdmin(page)
    await expect(page).toHaveURL('/dashboard')
  })

  test('credenciais inválidas exibem toast de erro', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('E-mail').fill(ADMIN_EMAIL)
    await page.getByLabel('Senha').fill('senha-errada')
    await page.getByRole('button', { name: /entrar/i }).click()
    await expect(page.getByText('Credenciais inválidas')).toBeVisible()
  })

  test('usuário autenticado é redirecionado para /dashboard ao acessar /login', async ({
    page,
  }) => {
    await loginAsAdmin(page)
    await page.goto('/login')
    await expect(page).toHaveURL('/dashboard')
  })
})
