import bcrypt from 'bcryptjs'
const { hash } = bcrypt
import type { User } from '@/generated/prisma/client'
import type { UsersRepository } from '@/repositories/users-repository'
import { UserAlreadyExistsError } from '@/shared/errors/user-already-exists-error'

interface RegisterServiceRequest {
  name: string
  email: string
  password: string
  locale: string
}

interface RegisterServiceResponse {
  user: User
}

export class RegisterService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
    locale,
  }: RegisterServiceRequest): Promise<RegisterServiceResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const passwordHash = await hash(password, 6)

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
      locale,
    })

    return { user }
  }
}
