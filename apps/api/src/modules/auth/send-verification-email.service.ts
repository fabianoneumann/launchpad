import { UsersRepository } from '@/repositories/users-repository'
import { EmailVerificationTokensRepository } from '@/repositories/email-verification-tokens-repository'
import { MailProvider } from '@/lib/mail/mail-provider'
import { generateAndSendVerificationEmail } from './generate-and-send-verification-email'

interface SendVerificationEmailServiceRequest {
  userId: string
}

export class SendVerificationEmailService {
  constructor(
    private usersRepository: UsersRepository,
    private emailVerificationTokensRepository: EmailVerificationTokensRepository,
    private mailProvider: MailProvider,
  ) {}

  async execute({ userId }: SendVerificationEmailServiceRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return
    }

    await generateAndSendVerificationEmail(user, this.emailVerificationTokensRepository, this.mailProvider)
  }
}
