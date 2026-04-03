import { SearchX } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <SearchX className="h-12 w-12 text-muted-foreground/50 mb-4" />
      <p className="text-lg font-semibold text-foreground mb-1">{title}</p>
      {description && <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>}
      {action && action}
    </div>
  )
}
