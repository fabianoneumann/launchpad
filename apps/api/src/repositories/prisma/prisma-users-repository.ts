import { Prisma, Role, User } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import { UsersRepository } from '@/repositories/users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findFirst({ where: { id, deleted_at: null } })
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findFirst({ where: { email, deleted_at: null } })
  }

  async findMany({ page, perPage, role }: { page: number; perPage: number; role?: Role }): Promise<User[]> {
    return prisma.user.findMany({
      where: { deleted_at: null, ...(role ? { role } : {}) },
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { created_at: 'desc' },
    })
  }

  async count({ role }: { role?: Role }): Promise<number> {
    return prisma.user.count({
      where: { deleted_at: null, ...(role ? { role } : {}) },
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
