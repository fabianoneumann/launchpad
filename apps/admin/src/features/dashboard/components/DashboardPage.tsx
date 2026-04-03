'use no memo'

import type { ColumnDef } from '@tanstack/react-table'
import { ShieldCheck, UserCheck, Users, UserX } from 'lucide-react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { User } from '@/features/users/types'
import { PageLayout } from '@/components/layout/PageLayout'
import { DataTable } from '@/components/shared/DataTable/DataTable'
import { RoleBadge } from '@/components/shared/RoleBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDashboardStats } from '../hooks/useDashboardStats'
import { useRecentUsers } from '../hooks/useRecentUsers'

const chartData = [
  { month: 'Nov', total: 12 },
  { month: 'Dez', total: 19 },
  { month: 'Jan', total: 8 },
  { month: 'Fev', total: 24 },
  { month: 'Mar', total: 17 },
  { month: 'Abr', total: 31 },
]

const recentColumns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Nome' },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'role',
    header: 'Perfil',
    cell: ({ row }) => <RoleBadge role={row.original.role} />,
  },
  {
    accessorKey: 'created_at',
    header: 'Criado em',
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString('pt-BR'),
  },
]

export function DashboardPage() {
  const { data: stats } = useDashboardStats()
  const { data: recentUsers, isLoading: recentLoading } = useRecentUsers()

  const cards = [
    { label: 'Total de Usuários', value: stats?.total, Icon: Users },
    { label: 'Usuários Ativos', value: stats?.active, Icon: UserCheck },
    { label: 'Não Validados', value: stats?.unvalidated, Icon: UserX },
    { label: 'Administradores', value: stats?.byRole.ADMIN, Icon: ShieldCheck },
  ]

  return (
    <PageLayout title="Dashboard">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map(({ label, value, Icon }) => (
            <Card key={label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{value ?? '—'}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Novos usuários por mês</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData}>
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      color: 'var(--foreground)',
                    }}
                  />
                  <Bar dataKey="total" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Usuários Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={recentColumns}
                data={recentUsers?.users ?? []}
                isLoading={recentLoading}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
