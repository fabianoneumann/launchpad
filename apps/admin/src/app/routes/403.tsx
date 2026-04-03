import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/403')({
  component: ForbiddenPage,
})

function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-7xl font-bold text-primary">403</h1>
        <p className="text-xl text-muted-foreground">
          Você não tem permissão para acessar esta página
        </p>
        <Button asChild>
          <a href="/dashboard">Voltar ao painel</a>
        </Button>
      </div>
    </div>
  )
}
