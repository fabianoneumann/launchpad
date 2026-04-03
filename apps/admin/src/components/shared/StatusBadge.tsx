import { Badge } from '@/components/ui/badge'

export function StatusBadge({ deletedAt }: { deletedAt: string | null }) {
  return deletedAt ? (
    <Badge
      variant="outline"
      className="text-xs font-medium bg-red-500/15 text-red-400 border-red-500/20"
    >
      Deletado
    </Badge>
  ) : (
    <Badge
      variant="outline"
      className="text-xs font-medium bg-emerald-500/15 text-emerald-500 border-emerald-500/20"
    >
      Ativo
    </Badge>
  )
}
