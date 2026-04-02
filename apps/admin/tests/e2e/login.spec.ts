import { test, expect } from '@playwright/test'

// Requer usuário admin seedado no banco antes de rodar.
// Credenciais usadas nos testes E2E da API (admin-authenticate.e2e.spec.ts):
//   email: admin-login@test.com  |  password: 123456  |  role: ADMIN
const ADMIN_EMAIL = 'admin-login@test.com'
const ADMIN_PASSWORD = '123456'

test.describe('Login page', () => {
  test('login bem-sucedido redireciona para /dashboard', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('E-mail').fill(ADMIN_EMAIL)
    await page.getByLabel('Senha').fill(ADMIN_PASSWORD)
    await page.getByRole('button', { name: /entrar/i }).click()
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
    // Faz login pela UI para popular o store
    await page.goto('/login')
    await page.getByLabel('E-mail').fill(ADMIN_EMAIL)
    await page.getByLabel('Senha').fill(ADMIN_PASSWORD)
    await page.getByRole('button', { name: /entrar/i }).click()
    await expect(page).toHaveURL('/dashboard')

    // Tenta navegar de volta para /login — guard deve redirecionar para /dashboard
    await page.goto('/login')
    await expect(page).toHaveURL('/dashboard')
  })
})
