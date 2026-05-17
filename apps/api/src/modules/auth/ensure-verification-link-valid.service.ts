import type { UsersRepository } from '@/repositories/users-repository'
import type { EmailVerificationTokensRepository } from '@/repositories/email-verification-tokens-repository'
import type { MailProvider } from '@/lib/mail/mail-provider'
import { generateAndSendVerificationEmail } from './generate-and-send-verification-email'

interface EnsureVerificationLinkValidServiceRequest {
  userId: string
}

export class EnsureVerificationLinkValidService {
  constructor(
    private usersRepository: UsersRepository,
    private emailVerificationTokensRepository: EmailVerificationTokensRepository,
    private mailProvider: MailProvider,
  ) {}

  async execute({ userId }: EnsureVerificationLinkValidServiceRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return
    }

    if (user.validated_at) {
      return
    }

    const latestToken = await this.emailVerificationTokensRepository.findLatestByUserId(userId)

    if (latestToken && latestToken.used_at === null && latestToken.expires_at > new Date()) {
      return
    }

    if (latestToken && latestToken.used_at === null) {
      await this.emailVerificationTokensRepository.markAsUsed(latestToken.id)
    }

    await generateAndSendVerificationEmail(
      user,
      this.emailVerificationTokensRepository,
      this.mailProvider,
    )
  }
}
