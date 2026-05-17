import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { resetPassword } from '../api/auth.api'
import { Route } from '@/app/routes/reset-password'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const schema = z
  .object({
    newPassword: z.string().min(8, { message: 'Mínimo de 8 caracteres' }),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

export function ResetPasswordForm() {
  const { token } = Route.useSearch()
  const [status, setStatus] = useState<'form' | 'success' | 'error'>(() =>
    !token ? 'error' : 'form',
  )

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  })

  const onSubmit = async ({ newPassword }: FormData) => {
    try {
      await resetPassword(token, newPassword)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Redefinir senha</CardTitle>
          <CardDescription>
            {status === 'success'
              ? 'Senha redefinida com sucesso'
              : status === 'error'
                ? 'Link inválido ou expirado'
                : 'Crie uma nova senha para sua conta'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'success' ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
              <p className="text-sm text-muted-foreground text-center">
                Sua senha foi redefinida com sucesso.
              </p>
              <Button variant="outline" asChild>
                <Link to="/login">Ir para o login</Link>
              </Button>
            </div>
          ) : status === 'error' ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <XCircle className="h-12 w-12 text-destructive" />
              <p className="text-sm text-muted-foreground text-center">
                Este link de recuperação é inválido ou já expirou.
              </p>
              <Button variant="outline" asChild>
                <Link to="/forgot-password">Solicitar novo link</Link>
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova senha</FormLabel>
                      <FormControl>
                        <Input type="password" autoComplete="new-password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar senha</FormLabel>
                      <FormControl>
                        <Input type="password" autoComplete="new-password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Redefinir senha
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
