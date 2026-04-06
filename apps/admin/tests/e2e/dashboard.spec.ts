import { test, expect } from '@playwright/test'
import { loginAsAdmin } from './helpers/auth'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
  })

  test('exibe cards de estatísticas com valores do banco', async ({ page }) => {
    await expect(page.getByText('Total de Usuários')).toBeVisible()
    await expect(page.getByText('Usuários Ativos')).toBeVisible()
    await expect(page.getByText('Não Validados')).toBeVisible()
    await expect(page.getByText('Administradores')).toBeVisible()
  })

  test('tabela de usuários recentes exibe usuários do seed', async ({ page }) => {
    await expect(page.getByText('Usuários Recentes')).toBeVisible()
    // O seed cria "Admin E2E" como o usuário admin principal
    await expect(page.getByText('Admin E2E')).toBeVisible()
  })
})
