import { Badge } from '@/components/ui/badge'

type Role = 'ADMIN' | 'MEMBER' | 'USER'

const roleConfig: Record<Role, { label: string; className: string }> = {
  ADMIN: { label: 'Admin', className: 'bg-red-500/15 text-red-500 border-red-500/20' },
  MEMBER: { label: 'Member', className: 'bg-blue-500/15 text-blue-500 border-blue-500/20' },
  USER: { label: 'User', className: 'bg-muted text-muted-foreground border-border' },
}

export function RoleBadge({ role }: { role: Role }) {
  const { label, className } = roleConfig[role]
  return (
    <Badge variant="outline" className={`text-xs font-medium ${className}`}>
      {label}
    </Badge>
  )
}
