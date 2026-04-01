import type { Prisma, Role, User } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import type { UsersRepository } from '@/repositories/users-repository'

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
  }: {
    page: number
    perPage: number
    role?: Role
    search?: string
    showDeleted?: boolean
  }): Promise<User[]> {
    return prisma.user.findMany({
      where: {
        ...(showDeleted ? {} : { deleted_at: null }),
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
  }: {
    role?: Role
    search?: string
    showDeleted?: boolean
  }): Promise<number> {
    return prisma.user.count({
      where: {
        ...(showDeleted ? {} : { deleted_at: null }),
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
}
