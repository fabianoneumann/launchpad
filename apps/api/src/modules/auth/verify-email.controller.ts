import type { FastifyRequest, FastifyReply } from 'fastify'
import { makeVerifyEmailService } from '@/shared/factories/make-verify-email-service'

export async function verifyEmailController(request: FastifyRequest, reply: FastifyReply) {
  const { token } = request.query as { token: string }

  const service = makeVerifyEmailService()
  await service.execute({ token })

  return reply.status(204).send()
}
