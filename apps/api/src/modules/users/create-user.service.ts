import { createHash, randomBytes } from 'node:crypto'
import { hash } from 'bcryptjs'
import type { User } from '@/generated/prisma/client'
import type { UsersRepository } from '@/repositories/users-repository'
import type { PasswordResetTokensRepository } from '@/repositories/password-reset-tokens-repository'
import type { MailProvider } from '@/lib/mail/mail-provider'
import { env } from '@/env'
import { UserAlreadyExistsError } from '@/shared/errors/user-already-exists-error'

interface CreateUserServiceRequest {
  name: string
  email: string
  role: 'ADMIN' | 'MEMBER' | 'USER'
  locale?: string
}

interface CreateUserServiceResponse {
  user: User
}

export class CreateUserService {
  constructor(
    private usersRepository: UsersRepository,
    private passwordResetTokensRepository: PasswordResetTokensRepository,
    private mailProvider: MailProvider,
  ) {}

  async execute({
    name,
    email,
    role,
    locale = 'pt-BR',
  }: CreateUserServiceRequest): Promise<CreateUserServiceResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const password_hash = await hash(randomBytes(32).toString('hex'), 6)

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
      role,
      locale,
      validated_at: new Date(),
    })

    const token = randomBytes(32).toString('hex')
    const tokenHash = createHash('sha256').update(token).digest('hex')
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 72)

    await this.passwordResetTokensRepository.create({ tokenHash, userId: user.id, expiresAt })

    const inviteLink = `${env.APP_URL ?? 'http://localhost:5173'}/auth/reset-password?token=${token}`

    await this.mailProvider.send({
      to: user.email,
      subject: 'Seu acesso ao Eco Iguassu foi criado',
      html: `
        <p>Olá, ${user.name}!</p>
        <p>Um administrador criou uma conta para você no Eco Iguassu.</p>
        <p><a href="${inviteLink}">Clique aqui para definir sua senha e acessar o painel</a></p>
        <p>O link expira em 72 horas.</p>
      `,
    })

    return { user }
  }
}
