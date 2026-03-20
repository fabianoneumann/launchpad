import { randomBytes } from 'node:crypto'
import { UsersRepository } from '@/repositories/users-repository'
import { PasswordResetTokensRepository } from '@/repositories/password-reset-tokens-repository'
import { MailProvider } from '@/lib/mail/mail-provider'
import { env } from '@/env'

interface ForgotPasswordServiceRequest {
  email: string
}

export class ForgotPasswordService {
  constructor(
    private usersRepository: UsersRepository,
    private passwordResetTokensRepository: PasswordResetTokensRepository,
    private mailProvider: MailProvider,
  ) {}

  async execute({ email }: ForgotPasswordServiceRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      return
    }

    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 2)

    await this.passwordResetTokensRepository.create({ token, userId: user.id, expiresAt })

    const resetLink = `${env.APP_URL ?? 'http://localhost:5173'}/auth/reset-password?token=${token}`

    await this.mailProvider.send({
      to: user.email,
      subject: 'Redefinição de senha — Eco Iguassu',
      html: `
        <p>Olá, ${user.name}!</p>
        <p>Recebemos uma solicitação para redefinir a senha da sua conta.</p>
        <p><a href="${resetLink}">Clique aqui para redefinir sua senha</a></p>
        <p>O link expira em 2 horas.</p>
        <p>Se você não solicitou a redefinição, ignore este e-mail.</p>
      `,
    })
  }
}
