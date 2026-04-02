import { test, expect } from '@playwright/test'

test.describe('Route guards', () => {
  test('acesso não autenticado a /dashboard redireciona para /login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/login')
  })

  test('acesso não autenticado a / redireciona para /login', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/login')
  })
})
