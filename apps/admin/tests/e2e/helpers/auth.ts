import type { Page } from '@playwright/test'

export const API_BASE = 'http://localhost:3333'
export const ADMIN_EMAIL = 'admin-login@test.com'
export const ADMIN_PASSWORD = '123456'

export async function loginAsAdmin(page: Page) {
  await page.goto('/login')
  await page.getByLabel('E-mail').fill(ADMIN_EMAIL)
  await page.getByLabel('Senha').fill(ADMIN_PASSWORD)
  await page.getByRole('button', { name: /entrar/i }).click()
  await page.waitForURL('/dashboard')
}

export async function loginAs(page: Page, email: string, password: string) {
  await page.goto('/login')
  await page.getByLabel('E-mail').fill(email)
  await page.getByLabel('Senha').fill(password)
  await page.getByRole('button', { name: /entrar/i }).click()
  await page.waitForURL('/dashboard')
}
