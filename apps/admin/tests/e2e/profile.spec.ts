import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'

const PASS_CHANGE_EMAIL = 'password-change@test.com'
const ORIGINAL_PASSWORD = '123456'
const NEW_PASSWORD = 'novaSenha456'

test('alterar senha encerra sessão e impede acesso ao dashboard', async ({ page }) => {
  await loginAs(page, PASS_CHANGE_EMAIL, ORIGINAL_PASSWORD)
  await page.goto('/profile')

  await page.getByLabel('Senha atual').fill(ORIGINAL_PASSWORD)
  await page.getByLabel('Nova senha', { exact: true }).fill(NEW_PASSWORD)
  await page.getByLabel('Confirmar nova senha').fill(NEW_PASSWORD)
  await page.getByRole('button', { name: 'Alterar senha' }).click()

  // Após mudança de senha a sessão é encerrada e o usuário vai para /login
  await expect(page).toHaveURL('/login')

  // Tentar acessar /dashboard sem sessão redireciona para /login
  await page.goto('/dashboard')
  await expect(page).toHaveURL('/login')
})
