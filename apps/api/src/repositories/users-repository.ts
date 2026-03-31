import type { Prisma, Role, User } from '@/generated/prisma/client'

export interface UsersRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findMany(params: { page: number; perPage: number; role?: Role }): Promise<User[]>
  count(params: { role?: Role }): Promise<number>
  create(data: Prisma.UserCreateInput): Promise<User>
  update(id: string, data: Prisma.UserUpdateInput): Promise<User>
  delete(id: string): Promise<void>
  incrementTokenVersion(id: string): Promise<void>
}
