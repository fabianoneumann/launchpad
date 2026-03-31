import { randomUUID } from 'node:crypto'
import type { PasswordResetToken } from '@/generated/prisma/client'
import type { PasswordResetTokensRepository } from '@/repositories/password-reset-tokens-repository'

export class InMemoryPasswordResetTokensRepository implements PasswordResetTokensRepository {
  public items: PasswordResetToken[] = []

  async create(data: {
    tokenHash: string
    userId: string
    expiresAt: Date
  }): Promise<PasswordResetToken> {
    const resetToken: PasswordResetToken = {
      id: randomUUID(),
      token_hash: data.tokenHash,
      user_id: data.userId,
      expires_at: data.expiresAt,
      used_at: null,
      created_at: new Date(),
    }
    this.items.push(resetToken)
    return resetToken
  }

  async findByToken(token: string): Promise<PasswordResetToken | null> {
    return this.items.find((item) => item.token_hash === token) ?? null
  }

  async markAsUsed(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index !== -1) {
      this.items[index].used_at = new Date()
    }
  }
}
