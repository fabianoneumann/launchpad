import bcrypt from 'bcryptjs'
const { hash } = bcrypt
import { createHash } from 'node:crypto'
import type { UsersRepository } from '@/repositories/users-repository'
import type { PasswordResetTokensRepository } from '@/repositories/password-reset-tokens-repository'
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
    const tokenHash = createHash('sha256').update(token).digest('hex')
    const resetToken = await this.passwordResetTokensRepository.findByToken(tokenHash)

    if (!resetToken || resetToken.used_at !== null || resetToken.expires_at < new Date()) {
      throw new InvalidOrExpiredTokenError()
    }

    const passwordHash = await hash(newPassword, 6)

    await this.usersRepository.update(resetToken.user_id, { password_hash: passwordHash })
    await this.passwordResetTokensRepository.markAsUsed(resetToken.id)
    await this.usersRepository.incrementTokenVersion(resetToken.user_id)
  }
}
