import { createHash } from 'node:crypto'
import type { UsersRepository } from '@/repositories/users-repository'
import type { EmailVerificationTokensRepository } from '@/repositories/email-verification-tokens-repository'
import { InvalidOrExpiredTokenError } from '@/shared/errors/invalid-or-expired-token-error'

interface VerifyEmailServiceRequest {
  token: string
}

export class VerifyEmailService {
  constructor(
    private usersRepository: UsersRepository,
    private emailVerificationTokensRepository: EmailVerificationTokensRepository,
  ) {}

  async execute({ token }: VerifyEmailServiceRequest): Promise<void> {
    const tokenHash = createHash('sha256').update(token).digest('hex')
    const verificationToken = await this.emailVerificationTokensRepository.findByToken(tokenHash)

    if (
      !verificationToken ||
      verificationToken.used_at !== null ||
      verificationToken.expires_at < new Date()
    ) {
      throw new InvalidOrExpiredTokenError()
    }

    await this.usersRepository.update(verificationToken.user_id, { validated_at: new Date() })
    await this.emailVerificationTokensRepository.markAsUsed(verificationToken.id)
  }
}
