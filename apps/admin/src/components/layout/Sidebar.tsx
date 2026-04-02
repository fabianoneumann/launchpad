import { BarChart3, CreditCard, LayoutDashboard, LogOut, Users } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { logoutAdmin } from '@/features/auth/api/auth.api'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { router } from '@/app/router'

interface NavItem {
  label: string
  icon: LucideIcon
  to?: string
  disabled?: boolean
}

interface NavSection {
  label: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    label: 'Geral',
    items: [{ label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Usuários',
    items: [{ label: 'Usuários', to: '/users', icon: Users }],
  },
  {
    label: 'Operações',
    items: [{ label: 'Relatórios', icon: BarChart3, disabled: true }],
  },
  {
    label: 'Financeiro',
    items: [{ label: 'Pagamentos', icon: CreditCard, disabled: true }],
  },
]

const linkBase =
  'flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors'

function SidebarContent() {
  const [confirmOpen, setConfirmOpen] = useState(false)

  function handleLogout() {
    logoutAdmin().catch(() => {})
    useAuthStore.getState().clearSession()
    router.navigate({ to: '/login' })
  }

  return (
    <div className="flex flex-col h-full bg-sidebar">
      <div className="p-6 pb-4">
        <p className="text-lg font-bold text-sidebar-foreground tracking-tight">Admin Panel</p>
      </div>

      <nav className="flex-1 px-3 space-y-6 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="px-3 mb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {section.label}
            </p>
            <div className="space-y-1">
              {section.items.map((item) =>
                item.disabled || !item.to ? (
                  <span
                    key={item.label}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground/40 cursor-not-allowed"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Em breve
                    </Badge>
                  </span>
                ) : (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={linkBase}
                    activeProps={{ className: 'bg-primary/10 text-primary font-medium' }}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ),
              )}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 pb-4 border-t border-sidebar-border pt-4 mt-2">
        <button className={`${linkBase} w-full`} onClick={() => setConfirmOpen(true)}>
          <LogOut className="h-4 w-4" />
          Sair
        </button>
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Confirmar saída"
          description="Tem certeza que deseja sair do painel?"
          confirmLabel="Sair"
          variant="destructive"
          onConfirm={handleLogout}
        />
      </div>
    </div>
  )
}

interface SidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex w-60 border-r border-sidebar-border flex-shrink-0 sticky top-0 h-screen overflow-hidden flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile */}
      <Sheet open={mobileOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent side="left" className="w-60 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
