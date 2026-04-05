import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, Eye, Plus, Trash2, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import type { ColumnDef } from '@tanstack/react-table'
import { Link } from '@tanstack/react-router'
import { router } from '@/app/router'
import { Route } from '@/app/routes/_layout/users/'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { useUsers } from '../hooks/useUsers'
import { deleteUser } from '../api/users.api'
import type { User } from '../types'
import { CreateUserDialog } from './CreateUserDialog'
import { PageLayout } from '@/components/layout/PageLayout'
import { DataTable } from '@/components/shared/DataTable/DataTable'
import { RoleBadge } from '@/components/shared/RoleBadge'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function UsersPage() {
  const { page, perPage, role, search, status } = Route.useSearch()
  const queryClient = useQueryClient()
  const { data, isLoading } = useUsers({ page, perPage, role, search, status })
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const currentUser = useAuthStore((s) => s.user)

  function navigate(
    patch: Partial<{
      page: number
      perPage: number
      role: User['role'] | undefined
      search: string | undefined
      status: 'active' | 'deleted' | 'all'
    }>,
  ) {
    router.navigate({
      to: '/users',
      search: { page, perPage, role, search, status, ...patch },
    })
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await deleteUser(deleteId)
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Usuário excluído com sucesso')
    } catch {
      toast.error('Erro ao excluir usuário')
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const columns: ColumnDef<User>[] = [
    { accessorKey: 'name', header: 'Nome' },
    { accessorKey: 'email', header: 'Email' },
    {
      accessorKey: 'role',
      header: 'Perfil',
      cell: ({ row }) => <RoleBadge role={row.original.role} />,
    },
    {
      id: 'validated',
      header: 'Validado',
      cell: ({ row }) =>
        row.original.validated_at ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        ) : (
          <XCircle className="h-4 w-4 text-muted-foreground/40" />
        ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge deletedAt={row.original.deleted_at} />,
    },
    {
      accessorKey: 'created_at',
      header: 'Criado em',
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString('pt-BR'),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                  <Link to="/users/$id" params={{ id: user.id }}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Ver detalhes</TooltipContent>
            </Tooltip>
            {!user.deleted_at && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      disabled={currentUser?.id === user.id}
                      onClick={() => setDeleteId(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {currentUser?.id === user.id
                    ? 'Você não pode excluir sua própria conta'
                    : 'Excluir'}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <PageLayout
      title="Usuários"
      actions={
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      }
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Buscar por nome ou email..."
          className="sm:max-w-xs"
          defaultValue={search ?? ''}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              navigate({ search: e.currentTarget.value || undefined, page: 1 })
            }
          }}
        />
        <Select
          value={role ?? 'all'}
          onValueChange={(v) =>
            navigate({ role: v === 'all' ? undefined : (v as User['role']), page: 1 })
          }
        >
          <SelectTrigger className="sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="MEMBER">Member</SelectItem>
            <SelectItem value="USER">User</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={status}
          onValueChange={(v) => navigate({ status: v as typeof status, page: 1 })}
        >
          <SelectTrigger className="sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="deleted">Somente deletados</SelectItem>
            <SelectItem value="all">Todos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={data?.users ?? []}
        isLoading={isLoading}
        rowCount={data?.total}
        pagination={{ page, pageSize: perPage, onPageChange: (p) => navigate({ page: p }) }}
        rowClassName={(row) => (row.deleted_at ? 'opacity-50' : '')}
        emptyState={
          <EmptyState title="Nenhum usuário encontrado" description="Tente ajustar os filtros." />
        }
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Excluir usuário"
        description="Tem certeza que deseja excluir este usuário?"
        confirmLabel="Excluir"
        variant="destructive"
        isPending={isDeleting}
        onConfirm={handleDelete}
      />

      <CreateUserDialog open={createOpen} onOpenChange={setCreateOpen} />
    </PageLayout>
  )
}
