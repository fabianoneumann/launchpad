import type { FastifyRequest, FastifyReply } from 'fastify'
import { makeForgotPasswordService } from '@/shared/factories/make-forgot-password-service'

export async function forgotPasswordController(request: FastifyRequest, reply: FastifyReply) {
  const { email } = request.body as { email: string }

  const service = makeForgotPasswordService()
  await service.execute({ email })

  return reply.status(204).send()
}
