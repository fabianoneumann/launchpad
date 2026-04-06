import { test, expect, type APIRequestContext } from '@playwright/test'
import { loginAsAdmin, API_BASE, ADMIN_EMAIL, ADMIN_PASSWORD } from './helpers/auth'

async function getAdminToken(request: APIRequestContext): Promise<string> {
  const res = await request.post(`${API_BASE}/auth/admin/login`, {
    data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  })
  const { token } = await res.json()
  return token
}

async function createIsolatedUser(request: APIRequestContext, token: string) {
  const res = await request.post(`${API_BASE}/users`, {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      name: 'Detail Test',
      email: `detail-test-${Date.now()}@test.com`,
      role: 'USER',
      locale: 'pt-BR',
    },
  })
  const { user } = await res.json()
  return user
}

test.describe('User detail page', () => {
  test('clicar em "Ver detalhes" navega para /users/:id', async ({ page, request }) => {
    const token = await getAdminToken(request)
    const user = await createIsolatedUser(request, token)

    await loginAsAdmin(page)
    await page.goto('/users')
    await page
      .getByRole('row', { name: new RegExp(user.email) })
      .getByRole('link')
      .click()

    await expect(page).toHaveURL(new RegExp(`/users/${user.id}`))

    await request.delete(`${API_BASE}/users/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  })

  test('editar nome: salvar persiste o dado', async ({ page, request }) => {
    const token = await getAdminToken(request)
    const user = await createIsolatedUser(request, token)

    await loginAsAdmin(page)
    await page.goto(`/users/${user.id}`)

    await page.getByRole('button', { name: 'Editar' }).click()
    await page.getByLabel('Nome').fill('Nome Atualizado')
    await page.getByRole('button', { name: 'Salvar' }).click()

    await expect(page.getByText('Usuário atualizado com sucesso')).toBeVisible()
    await page.reload()
    await page.getByRole('button', { name: 'Editar' }).click()
    await expect(page.getByLabel('Nome')).toHaveValue('Nome Atualizado')

    await request.delete(`${API_BASE}/users/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  })

  test('alterar role: badge atualizado após confirmar', async ({ page, request }) => {
    const token = await getAdminToken(request)
    const user = await createIsolatedUser(request, token)

    await loginAsAdmin(page)
    await page.goto(`/users/${user.id}`)

    await page.getByRole('button', { name: /alterar perfil/i }).click()
    await page.getByRole('combobox').click()
    await page.getByRole('option', { name: 'Member' }).click()
    await page.getByRole('button', { name: 'Confirmar' }).click()

    await expect(page.getByText('Perfil alterado com sucesso')).toBeVisible()
    await page.getByRole('dialog').waitFor({ state: 'hidden' })
    await expect(page.getByText('Member')).toBeVisible()

    await request.delete(`${API_BASE}/users/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  })

  test('excluir usuário: redireciona para /users', async ({ page, request }) => {
    const token = await getAdminToken(request)
    const user = await createIsolatedUser(request, token)

    await loginAsAdmin(page)
    await page.goto(`/users/${user.id}`)

    await page.getByRole('button', { name: 'Excluir' }).click()
    await page.getByRole('alertdialog').getByRole('button', { name: 'Excluir' }).click()

    await expect(page).toHaveURL(/\/users/)
  })
})
