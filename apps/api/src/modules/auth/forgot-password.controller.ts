import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeForgotPasswordService } from '@/shared/factories/make-forgot-password-service'

export async function forgotPasswordController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    email: z.email(),
  })

  const { email } = bodySchema.parse(request.body)

  const service = makeForgotPasswordService()
  await service.execute({ email })

  return reply.status(204).send()
}
