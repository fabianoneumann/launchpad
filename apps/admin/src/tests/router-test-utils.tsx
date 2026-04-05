import { render } from '@testing-library/react'
import {
  createRootRoute,
  createRouter,
  createMemoryHistory,
  RouterProvider,
  Outlet,
  type AnyRoute,
} from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from '@/components/ui/tooltip'

export function createTestQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } })
}

export const rootRoute = createRootRoute({ component: Outlet })

interface RenderWithRouterOptions {
  initialPath?: string
  routes?: AnyRoute[]
  queryClient?: QueryClient
}

export function renderWithRouter({
  initialPath = '/',
  routes = [],
  queryClient = createTestQueryClient(),
}: RenderWithRouterOptions = {}) {
  const router = createRouter({
    routeTree: rootRoute.addChildren(routes),
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  })

  const result = render(
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
    </QueryClientProvider>,
  )

  return { ...result, router, queryClient }
}
