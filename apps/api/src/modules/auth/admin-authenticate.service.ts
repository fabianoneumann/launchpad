import bcrypt from 'bcryptjs'
const { compare } = bcrypt
import type { User } from '@/generated/prisma/client'
import type { UsersRepository } from '@/repositories/users-repository'
import { InvalidCredentialsError } from '@/shared/errors/invalid-credentials-error'
import { InsufficientRoleError } from '@/shared/errors/insufficient-role-error'

const roleHierarchy = { ADMIN: 3, MEMBER: 2, USER: 1 } as const

interface AdminAuthenticateServiceRequest {
  email: string
  password: string
}

interface AdminAuthenticateServiceResponse {
  user: User
}

export class AdminAuthenticateService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AdminAuthenticateServiceRequest): Promise<AdminAuthenticateServiceResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatch = await compare(password, user.password_hash)

    if (!doesPasswordMatch) {
      throw new InvalidCredentialsError()
    }

    if (roleHierarchy[user.role] < roleHierarchy['MEMBER']) {
      throw new InsufficientRoleError()
    }

    return { user }
  }
}
