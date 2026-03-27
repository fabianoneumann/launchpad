import { UsersRepository } from '@/repositories/users-repository'
import { EmailVerificationTokensRepository } from '@/repositories/email-verification-tokens-repository'
import { MailProvider } from '@/lib/mail/mail-provider'
import { generateAndSendVerificationEmail } from './generate-and-send-verification-email'

interface ResendVerificationEmailServiceRequest {
  userId: string
}

export class ResendVerificationEmailService {
  constructor(
    private usersRepository: UsersRepository,
    private emailVerificationTokensRepository: EmailVerificationTokensRepository,
    private mailProvider: MailProvider,
  ) {}

  async execute({ userId }: ResendVerificationEmailServiceRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return
    }

    const previousToken = await this.emailVerificationTokensRepository.findLatestByUserId(userId)

    if (previousToken && previousToken.used_at === null) {
      await this.emailVerificationTokensRepository.markAsUsed(previousToken.id)
    }

    await generateAndSendVerificationEmail(user, this.emailVerificationTokensRepository, this.mailProvider)
  }
}
