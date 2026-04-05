import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { isAxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { useProfile } from '../hooks/useProfile'
import { useUpdateProfile } from '../hooks/useUpdateProfile'
import { useChangePassword } from '../hooks/useChangePassword'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const nameSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Campo obrigatório'),
    newPassword: z.string().min(6, 'Mínimo 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type NameFormData = z.infer<typeof nameSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

export function ProfilePage() {
  const { data } = useProfile()
  const user = data?.user

  const updateProfile = useUpdateProfile()
  const changePassword = useChangePassword()

  const profileForm = useForm<NameFormData>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: '' },
  })

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  const { reset: resetProfileForm } = profileForm

  useEffect(() => {
    if (user) resetProfileForm({ name: user.name })
  }, [user, resetProfileForm])

  const onSubmitProfile = profileForm.handleSubmit((data) => {
    updateProfile.mutate(data)
  })

  const onSubmitPassword = passwordForm.handleSubmit((data) => {
    changePassword.mutate(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      {
        onError: (error) => {
          if (isAxiosError(error) && error.response?.status === 401) {
            passwordForm.setError('currentPassword', { message: 'Senha atual incorreta' })
          }
        },
      },
    )
  })

  return (
    <PageLayout title="Meu Perfil">
      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informações pessoais</CardTitle>
            <CardDescription>Atualize seu nome de exibição.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmitProfile} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" {...profileForm.register('name')} />
                {profileForm.formState.errors.name && (
                  <p className="text-xs text-destructive">
                    {profileForm.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user?.email ?? ''} disabled />
              </div>
              <Button type="submit" disabled={updateProfile.isPending}>
                {updateProfile.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Salvar alterações
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Alterar senha</CardTitle>
            <CardDescription>Após salvar, você será redirecionado para o login.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmitPassword} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha atual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  {...passwordForm.register('currentPassword')}
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-xs text-destructive">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova senha</Label>
                <Input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  {...passwordForm.register('newPassword')}
                />
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-xs text-destructive">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  {...passwordForm.register('confirmPassword')}
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-xs text-destructive">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button type="submit" disabled={changePassword.isPending}>
                {changePassword.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Alterar senha
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}
