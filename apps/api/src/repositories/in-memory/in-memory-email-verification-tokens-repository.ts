import { randomUUID } from 'node:crypto'
import type { EmailVerificationToken } from '@/generated/prisma/client'
import type { EmailVerificationTokensRepository } from '@/repositories/email-verification-tokens-repository'

export class InMemoryEmailVerificationTokensRepository implements EmailVerificationTokensRepository {
  public items: EmailVerificationToken[] = []

  async create(data: {
    tokenHash: string
    userId: string
    expiresAt: Date
  }): Promise<EmailVerificationToken> {
    const token: EmailVerificationToken = {
      id: randomUUID(),
      token_hash: data.tokenHash,
      user_id: data.userId,
      expires_at: data.expiresAt,
      used_at: null,
      created_at: new Date(),
    }
    this.items.push(token)
    return token
  }

  async findByToken(token: string): Promise<EmailVerificationToken | null> {
    return this.items.find((item) => item.token_hash === token) ?? null
  }

  async findLatestByUserId(userId: string): Promise<EmailVerificationToken | null> {
    const userTokens = this.items
      .filter((item) => item.user_id === userId)
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
    return userTokens[0] ?? null
  }

  async markAsUsed(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index !== -1) {
      this.items[index].used_at = new Date()
    }
  }
}
