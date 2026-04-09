import { createHash, randomBytes } from 'node:crypto'
import { render } from '@react-email/render'
import type { Locale } from '@eco-iguassu/shared-types'
import type { UsersRepository } from '@/repositories/users-repository'
import type { PasswordResetTokensRepository } from '@/repositories/password-reset-tokens-repository'
import type { MailProvider } from '@/lib/mail/mail-provider'
import { ForgotPasswordEmail } from '@/lib/mail/emails/forgot-password'
import { getForgotPasswordContent } from '@/lib/mail/content/forgot-password-content'
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
    const tokenHash = createHash('sha256').update(token).digest('hex')
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 2)

    await this.passwordResetTokensRepository.create({ tokenHash, userId: user.id, expiresAt })

    const resetLink = `${env.APP_URL ?? 'http://localhost:5173'}/auth/reset-password?token=${token}`

    const content = getForgotPasswordContent(user.locale as Locale)
    const html = await render(ForgotPasswordEmail({ name: user.name, resetLink, content }))

    await this.mailProvider.send({
      to: user.email,
      subject: content.subject,
      html,
    })
  }
}
