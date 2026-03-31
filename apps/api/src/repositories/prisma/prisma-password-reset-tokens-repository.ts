import type { PasswordResetToken } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import type { PasswordResetTokensRepository } from '@/repositories/password-reset-tokens-repository'

export class PrismaPasswordResetTokensRepository implements PasswordResetTokensRepository {
  async create(data: {
    tokenHash: string
    userId: string
    expiresAt: Date
  }): Promise<PasswordResetToken> {
    return prisma.passwordResetToken.create({
      data: {
        token_hash: data.tokenHash,
        user_id: data.userId,
        expires_at: data.expiresAt,
      },
    })
  }

  async findByToken(token: string): Promise<PasswordResetToken | null> {
    return prisma.passwordResetToken.findUnique({ where: { token_hash: token } })
  }

  async markAsUsed(id: string): Promise<void> {
    await prisma.passwordResetToken.update({
      where: { id },
      data: { used_at: new Date() },
    })
  }
}
