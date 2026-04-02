import type { Role, User } from '@/generated/prisma/client'
import type { UsersRepository } from '@/repositories/users-repository'

interface ListUsersServiceRequest {
  page: number
  perPage: number
  role?: Role
  search?: string
  showDeleted?: boolean
  onlyDeleted?: boolean
}

interface ListUsersServiceResponse {
  users: User[]
  total: number
}

export class ListUsersService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    page,
    perPage,
    role,
    search,
    showDeleted,
    onlyDeleted,
  }: ListUsersServiceRequest): Promise<ListUsersServiceResponse> {
    const [users, total] = await Promise.all([
      this.usersRepository.findMany({ page, perPage, role, search, showDeleted, onlyDeleted }),
      this.usersRepository.count({ role, search, showDeleted, onlyDeleted }),
    ])

    return { users, total }
  }
}
