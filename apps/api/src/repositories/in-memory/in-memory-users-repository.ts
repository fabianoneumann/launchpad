import { randomUUID } from 'node:crypto'
import type { Prisma, Role, User } from '@/generated/prisma/client'
import type { UsersRepository } from '@/repositories/users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findById(id: string): Promise<User | null> {
    return this.items.find((item) => item.id === id && item.deleted_at === null) ?? null
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.items.find((item) => item.email === email && item.deleted_at === null) ?? null
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
    return this.items
      .filter((item) => {
        if (onlyDeleted) return item.deleted_at !== null
        if (showDeleted) return true
        return item.deleted_at === null
      })
      .filter((item) => (role ? item.role === role : true))
      .filter((item) =>
        search
          ? item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.email.toLowerCase().includes(search.toLowerCase())
          : true,
      )
      .slice((page - 1) * perPage, page * perPage)
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
    return this.items
      .filter((item) => {
        if (onlyDeleted) return item.deleted_at !== null
        if (showDeleted) return true
        return item.deleted_at === null
      })
      .filter((item) => (role ? item.role === role : true))
      .filter((item) =>
        search
          ? item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.email.toLowerCase().includes(search.toLowerCase())
          : true,
      ).length
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      role: (data.role as User['role']) ?? 'USER',
      token_version: 0,
      locale: typeof data.locale === 'string' ? data.locale : 'pt-BR',
      validated_at: null,
      deleted_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    }
    this.items.push(user)
    return user
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index === -1) throw new Error('User not found')

    const current = this.items[index]
    this.items[index] = {
      ...current,
      name: typeof data.name === 'string' ? data.name : current.name,
      email: typeof data.email === 'string' ? data.email : current.email,
      password_hash:
        typeof data.password_hash === 'string' ? data.password_hash : current.password_hash,
      role: typeof data.role === 'string' ? (data.role as User['role']) : current.role,
      locale: typeof data.locale === 'string' ? data.locale : current.locale,
      validated_at: data.validated_at instanceof Date ? data.validated_at : current.validated_at,
      updated_at: new Date(),
    }
    return this.items[index]
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index !== -1) {
      this.items[index].deleted_at = new Date()
    }
  }

  async incrementTokenVersion(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index !== -1) {
      this.items[index].token_version += 1
    }
  }
}
