import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/$')({
  component: NotFoundPage,
})

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <p className="text-xl text-muted-foreground">Página não encontrada</p>
        <Button asChild>
          <a href="/dashboard">Voltar ao painel</a>
        </Button>
      </div>
    </div>
  )
}
