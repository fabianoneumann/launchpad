import type { FastifyRequest, FastifyReply } from 'fastify'
import { makeResendVerificationEmailService } from '@/shared/factories/make-resend-verification-email-service'

export async function resendVerificationEmailController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sub: userId } = request.user as { sub: string }

  const service = makeResendVerificationEmailService()
  await service.execute({ userId })

  return reply.status(204).send()
}
