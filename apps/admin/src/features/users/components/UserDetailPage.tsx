import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { isAxiosError } from 'axios'
import { Loader2, Pencil, ShieldCheck, Trash2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Route } from '@/app/routes/_layout/users/$id'
import { router } from '@/app/router'
import { useAuthStore } from '@/features/auth/store/auth-store'
import type { User } from '../types'
import { useUser } from '../hooks/useUser'
import { useUpdateUser } from '../hooks/useUpdateUser'
import { useChangeUserRole } from '../hooks/useChangeUserRole'
import { useDeleteUser } from '../hooks/useDeleteUser'
import { PageLayout } from '@/components/layout/PageLayout'
import { RoleBadge } from '@/components/shared/RoleBadge'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const editSchema = z.object({
  name: z.string().min(1, 'Campo obrigatório'),
  email: z.string().email('Email inválido'),
})

type EditFormData = z.infer<typeof editSchema>

function formatDate(value: string | null) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function UserDetailPage() {
  const { id } = Route.useParams()
  const [isEditing, setIsEditing] = useState(false)
  const [roleDialogOpen, setRoleDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<User['role'] | ''>('')

  const { data } = useUser(id)
  const user = data?.user
  const currentUser = useAuthStore((s) => s.user)
  const isSelf = currentUser?.id === user?.id

  const updateUser = useUpdateUser(id)
  const changeRole = useChangeUserRole(id)
  const deleteUser = useDeleteUser()

  const form = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    defaultValues: { name: '', email: '' },
  })

  const { reset } = form

  useEffect(() => {
    if (user) reset({ name: user.name, email: user.email })
  }, [user, reset])

  const onSubmit = form.handleSubmit((data) => {
    updateUser.mutate(data, {
      onSuccess: () => setIsEditing(false),
      onError: (error) => {
        if (isAxiosError(error) && error.response?.status === 409) {
          form.setError('email', { message: 'Este email já está em uso' })
        }
      },
    })
  })

  return (
    <PageLayout
      title={user?.name ?? '...'}
      breadcrumbs={[{ label: 'Usuários', href: '/users' }, { label: user?.name ?? '...' }]}
      actions={
        <Button variant="outline" size="sm" asChild>
          <Link to="/users" search={{ page: 1, perPage: 10, status: 'active' }}>
            Voltar
          </Link>
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Informações</CardTitle>
            {!isEditing && !user?.deleted_at && user && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Pencil className="h-3.5 w-3.5 mr-1" />
                  Editar
                </Button>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isSelf}
                        onClick={() => {
                          setSelectedRole(user.role)
                          setRoleDialogOpen(true)
                        }}
                      >
                        <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                        Alterar Perfil
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isSelf
                      ? 'Você não pode alterar o perfil da sua própria conta'
                      : 'Alterar perfil'}
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        disabled={isSelf}
                        onClick={() => setDeleteDialogOpen(true)}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Excluir
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isSelf ? 'Você não pode excluir sua própria conta' : 'Excluir usuário'}
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={onSubmit} className="space-y-4" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" {...form.register('name')} />
                  {form.formState.errors.name && (
                    <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...form.register('email')} />
                  {form.formState.errors.email && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm" disabled={updateUser.isPending}>
                    {updateUser.isPending && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
                    Salvar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            ) : (
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">ID</dt>
                  <dd className="text-sm">
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">{user?.id}</code>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Nome</dt>
                  <dd className="text-sm font-medium">{user?.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Email</dt>
                  <dd className="text-sm">{user?.email}</dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-sm text-muted-foreground">Perfil</dt>
                  <dd>{user && <RoleBadge role={user.role} />}</dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-sm text-muted-foreground">Status</dt>
                  <dd>{user && <StatusBadge deletedAt={user.deleted_at} />}</dd>
                </div>
              </dl>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Datas</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Criado em</dt>
                <dd className="text-sm">{formatDate(user?.created_at ?? null)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Atualizado em</dt>
                <dd className="text-sm">{formatDate(user?.updated_at ?? null)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Validado em</dt>
                <dd className="text-sm">{formatDate(user?.validated_at ?? null)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Excluído em</dt>
                <dd className="text-sm">{formatDate(user?.deleted_at ?? null)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Perfil</DialogTitle>
          </DialogHeader>
          <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as User['role'])}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um perfil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="MEMBER">Member</SelectItem>
              <SelectItem value="USER">User</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              disabled={!selectedRole || changeRole.isPending}
              onClick={() => {
                if (selectedRole) {
                  changeRole.mutate(selectedRole as User['role'], {
                    onSuccess: () => setRoleDialogOpen(false),
                  })
                }
              }}
            >
              {changeRole.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Excluir usuário"
        description={`Tem certeza que deseja excluir ${user?.name ?? 'este usuário'}?`}
        confirmLabel="Excluir"
        variant="destructive"
        isPending={deleteUser.isPending}
        onConfirm={() =>
          deleteUser.mutate(id, {
            onSuccess: () =>
              router.navigate({ to: '/users', search: { page: 1, perPage: 10, status: 'active' } }),
          })
        }
      />
    </PageLayout>
  )
}
