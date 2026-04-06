import { test, expect } from '@playwright/test'
import { loginAsAdmin, API_BASE, API_ADMIN_EMAIL, API_ADMIN_PASSWORD } from './helpers/auth'

test.describe('Users page', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/users')
    await expect(page).toHaveURL(/\/users/)
  })

  test('filtro "Somente deletados" exibe deleted@test.com', async ({ page }) => {
    await page.getByRole('combobox').filter({ hasText: 'Ativos' }).click()
    await page.getByRole('option', { name: 'Somente deletados' }).click()
    await expect(page.getByText('deleted@test.com')).toBeVisible()
  })

  test('excluir usuário: confirmar remove da lista', async ({ page, request }) => {
    const loginRes = await request.post(`${API_BASE}/auth/admin/login`, {
      data: { email: API_ADMIN_EMAIL, password: API_ADMIN_PASSWORD },
    })
    const { token } = await loginRes.json()

    const createRes = await request.post(`${API_BASE}/users`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: 'Delete Test',
        email: `delete-test-${Date.now()}@test.com`,
        role: 'USER',
        locale: 'pt-BR',
      },
    })
    const { user } = await createRes.json()

    await page.goto('/users')
    await expect(page).toHaveURL(/\/users/)
    await page.getByRole('row', { name: new RegExp(user.email) })
      .getByRole('button', { name: 'Excluir' })
      .click()
    await page.getByRole('button', { name: /^excluir$/i }).click()

    await expect(page.getByText('Usuário excluído com sucesso')).toBeVisible()
    await expect(page.getByText(user.email)).not.toBeVisible()
  })

  test('criar usuário: modal abre, submit exibe toast e usuário aparece na lista', async ({
    page,
    request,
  }) => {
    const email = `new-user-${Date.now()}@test.com`

    await page.getByRole('button', { name: 'Novo Usuário' }).click()
    await page.getByLabel('Nome').fill('New User Test')
    await page.getByLabel('Email').fill(email)
    await page.getByRole('button', { name: /criar/i }).click()

    await expect(
      page.getByText('Usuário criado. Um convite foi enviado para o e-mail cadastrado.'),
    ).toBeVisible()
    await expect(page.getByText(email)).toBeVisible()

    // Limpeza via API
    const loginRes = await request.post(`${API_BASE}/auth/admin/login`, {
      data: { email: API_ADMIN_EMAIL, password: API_ADMIN_PASSWORD },
    })
    const { token } = await loginRes.json()
    const listRes = await request.get(
      `${API_BASE}/users?search=${encodeURIComponent(email)}`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    const { users } = await listRes.json()
    if (users?.[0]?.id) {
      await request.delete(`${API_BASE}/users/${users[0].id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    }
  })
})
