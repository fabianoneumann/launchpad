import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'
import {
  BarChart3,
  Bell,
  Eye,
  EyeOff,
  LayoutDashboard,
  Loader2,
  Settings,
  Shield,
  Users,
} from 'lucide-react'
import { router } from '@/app/router'
import { Route } from '@/app/routes/login'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { loginAdmin } from '../api/auth.api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const schema = z.object({
  email: z.email({ message: 'E-mail inválido' }),
  password: z.string().min(6, { message: 'Mínimo 6 caracteres' }),
})

type FormData = z.infer<typeof schema>

const decorativeIcons = [
  { Icon: LayoutDashboard, className: 'top-[8%] left-[12%] w-16 h-16 rotate-12' },
  { Icon: Users, className: 'top-[22%] left-[55%] w-12 h-12 -rotate-6' },
  { Icon: BarChart3, className: 'top-[50%] left-[18%] w-20 h-20 rotate-[30deg]' },
  { Icon: Shield, className: 'top-[65%] left-[60%] w-14 h-14 -rotate-12' },
  { Icon: Settings, className: 'top-[35%] left-[75%] w-10 h-10 rotate-45' },
  { Icon: Bell, className: 'top-[80%] left-[30%] w-12 h-12 rotate-6' },
  { Icon: LayoutDashboard, className: 'top-[12%] left-[80%] w-8 h-8 -rotate-[20deg]' },
  { Icon: Users, className: 'top-[75%] left-[78%] w-16 h-16 rotate-[15deg]' },
]

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const { redirect: redirectTo } = Route.useSearch()

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async ({ email, password }: FormData) => {
    try {
      const { token, user } = await loginAdmin(email, password)
      useAuthStore.getState().setSession(user, token)
      if (redirectTo?.startsWith('/')) {
        router.navigate({ href: redirectTo })
      } else {
        router.navigate({ to: '/dashboard' })
      }
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        toast.error('Credenciais inválidas')
      }
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Painel esquerdo — decorativo */}
      <div
        className="hidden lg:flex lg:w-[60%] relative overflow-hidden items-end p-10"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, hsl(239 84% 67% / 0.15), transparent 50%),
            radial-gradient(ellipse at 80% 20%, hsl(263 70% 58% / 0.12), transparent 50%),
            radial-gradient(ellipse at 60% 80%, hsl(160 60% 45% / 0.08), transparent 50%),
            hsl(240 10% 3.9%)
          `,
        }}
      >
        {decorativeIcons.map(({ Icon, className }, i) => (
          <Icon key={i} className={`absolute text-white/[0.07] ${className}`} />
        ))}
        <div className="relative z-10">
          <p className="text-2xl font-bold text-white/90">launchpad</p>
          <p className="text-sm text-white/50 mt-1">Painel de administração</p>
        </div>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10 bg-background">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <p className="text-lg font-bold text-foreground">launchpad</p>
            <h1 className="text-2xl font-bold tracking-tight">Entrar no painel</h1>
            <p className="text-sm text-muted-foreground">
              Acesse com suas credenciais de administrador
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@exemplo.com"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••"
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground"
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Entrar
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <a
              href="/forgot-password"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Esqueci minha senha
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
