import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/dashboard/')({
  component: () => <h1>Dashboard</h1>,
})
