import { randomUUID } from 'node:crypto'
import { Prisma, User } from '@/generated/prisma/client'
import { UsersRepository } from '@/repositories/users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findById(id: string): Promise<User | null> {
    return this.items.find((item) => item.id === id) ?? null
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.items.find((item) => item.email === email) ?? null
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      role: (data.role as User['role']) ?? 'USER',
      validated_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    }
    this.items.push(user)
    return user
  }
}
