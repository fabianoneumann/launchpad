import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { createRoute } from '@tanstack/react-router'
import { renderWithRouter, rootRoute } from '@/tests/router-test-utils'
import { PageLayout } from './PageLayout'

function renderLayout(props: Omit<Parameters<typeof PageLayout>[0], 'children'>) {
  const route = createRoute({
    getParentRoute: () => rootRoute,
    path: 'test',
    component: () => (
      <PageLayout {...props}>
        <div>conteúdo</div>
      </PageLayout>
    ),
  })
  const usersStub = createRoute({
    getParentRoute: () => rootRoute,
    path: 'users',
    component: () => null,
  })
  return renderWithRouter({ initialPath: '/test', routes: [route, usersStub] })
}

describe('PageLayout', () => {
  it('renderiza título e children sem breadcrumbs', async () => {
    renderLayout({ title: 'Usuários' })
    await waitFor(() => expect(screen.getByText('Usuários')).toBeInTheDocument())
    expect(screen.getByText('conteúdo')).toBeInTheDocument()
  })

  it('renderiza breadcrumbs com Link para itens com href', async () => {
    renderLayout({
      title: 'Detalhe',
      breadcrumbs: [{ label: 'Usuários', href: '/users' }, { label: 'Detalhe' }],
    })
    await waitFor(() => expect(screen.getByText('Usuários')).toBeInTheDocument())
    expect(screen.getByRole('link', { name: 'Usuários' })).toBeInTheDocument()
  })

  it('item corrente (sem href) renderiza como texto, não como link', async () => {
    renderLayout({
      title: 'Detalhe',
      breadcrumbs: [{ label: 'Usuários', href: '/users' }, { label: 'Detalhe' }],
    })
    await waitFor(() => screen.getByRole('heading', { name: 'Detalhe' }))
    expect(screen.queryByRole('link', { name: 'Detalhe' })).not.toBeInTheDocument()
  })

  it('renderiza slot de actions quando fornecido', async () => {
    renderLayout({ title: 'Usuários', actions: <button>Novo</button> })
    await waitFor(() => expect(screen.getByRole('button', { name: 'Novo' })).toBeInTheDocument())
  })
})
