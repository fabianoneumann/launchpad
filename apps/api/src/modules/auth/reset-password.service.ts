import { hash } from 'bcryptjs'
import { UsersRepository } from '@/repositories/users-repository'
import { PasswordResetTokensRepository } from '@/repositories/password-reset-tokens-repository'
import { InvalidOrExpiredTokenError } from '@/shared/errors/invalid-or-expired-token-error'

interface ResetPasswordServiceRequest {
  token: string
  newPassword: string
}

export class ResetPasswordService {
  constructor(
    private usersRepository: UsersRepository,
    private passwordResetTokensRepository: PasswordResetTokensRepository,
  ) {}

  async execute({ token, newPassword }: ResetPasswordServiceRequest): Promise<void> {
    const resetToken = await this.passwordResetTokensRepository.findByToken(token)

    if (!resetToken || resetToken.used_at !== null || resetToken.expires_at < new Date()) {
      throw new InvalidOrExpiredTokenError()
    }

    const passwordHash = await hash(newPassword, 6)

    await this.usersRepository.update(resetToken.user_id, { password_hash: passwordHash })
    await this.passwordResetTokensRepository.markAsUsed(resetToken.id)
  }
}
