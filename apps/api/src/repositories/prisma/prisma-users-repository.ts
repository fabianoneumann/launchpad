import { Prisma, User } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import { UsersRepository } from '@/repositories/users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findFirst({ where: { id, deleted_at: null } })
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findFirst({ where: { email, deleted_at: null } })
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data })
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({ where: { id }, data })
  }
}
