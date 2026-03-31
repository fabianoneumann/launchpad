import type { EmailVerificationToken } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import type { EmailVerificationTokensRepository } from '@/repositories/email-verification-tokens-repository'

export class PrismaEmailVerificationTokensRepository implements EmailVerificationTokensRepository {
  async create(data: {
    tokenHash: string
    userId: string
    expiresAt: Date
  }): Promise<EmailVerificationToken> {
    return prisma.emailVerificationToken.create({
      data: {
        token_hash: data.tokenHash,
        user_id: data.userId,
        expires_at: data.expiresAt,
      },
    })
  }

  async findByToken(token: string): Promise<EmailVerificationToken | null> {
    return prisma.emailVerificationToken.findUnique({ where: { token_hash: token } })
  }

  async findLatestByUserId(userId: string): Promise<EmailVerificationToken | null> {
    return prisma.emailVerificationToken.findFirst({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    })
  }

  async markAsUsed(id: string): Promise<void> {
    await prisma.emailVerificationToken.update({
      where: { id },
      data: { used_at: new Date() },
    })
  }
}
