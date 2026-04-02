import type { Prisma, Role, User } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import type { UserStats, UsersRepository } from '@/repositories/users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findFirst({ where: { id, deleted_at: null } })
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findFirst({ where: { email, deleted_at: null } })
  }

  async findMany({
    page,
    perPage,
    role,
    search,
    showDeleted,
    onlyDeleted,
  }: {
    page: number
    perPage: number
    role?: Role
    search?: string
    showDeleted?: boolean
    onlyDeleted?: boolean
  }): Promise<User[]> {
    const deletedFilter = onlyDeleted
      ? { deleted_at: { not: null } }
      : showDeleted
        ? {}
        : { deleted_at: null }

    return prisma.user.findMany({
      where: {
        ...deletedFilter,
        ...(role ? { role } : {}),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }),
      },
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { created_at: 'desc' },
    })
  }

  async count({
    role,
    search,
    showDeleted,
    onlyDeleted,
  }: {
    role?: Role
    search?: string
    showDeleted?: boolean
    onlyDeleted?: boolean
  }): Promise<number> {
    const deletedFilter = onlyDeleted
      ? { deleted_at: { not: null } }
      : showDeleted
        ? {}
        : { deleted_at: null }

    return prisma.user.count({
      where: {
        ...deletedFilter,
        ...(role ? { role } : {}),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }),
      },
    })
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data })
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({ where: { id }, data })
  }

  async delete(id: string): Promise<void> {
    await prisma.user.update({ where: { id }, data: { deleted_at: new Date() } })
  }

  async incrementTokenVersion(id: string): Promise<void> {
    await prisma.user.update({ where: { id }, data: { token_version: { increment: 1 } } })
  }

  async stats(): Promise<UserStats> {
    const [total, active, unvalidated, admins, members, users] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { deleted_at: null } }),
      prisma.user.count({ where: { validated_at: null, deleted_at: null } }),
      prisma.user.count({ where: { role: 'ADMIN', deleted_at: null } }),
      prisma.user.count({ where: { role: 'MEMBER', deleted_at: null } }),
      prisma.user.count({ where: { role: 'USER', deleted_at: null } }),
    ])

    return {
      total,
      active,
      unvalidated,
      byRole: { ADMIN: admins, MEMBER: members, USER: users },
    }
  }
}
