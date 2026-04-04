import type { FastifyRequest, FastifyReply } from 'fastify'
import { makeForgotPasswordService } from '@/shared/factories/make-forgot-password-service'

export async function forgotPasswordController(request: FastifyRequest, reply: FastifyReply) {
  const { email } = request.body as { email: string }

  const service = makeForgotPasswordService()

  try {
    await service.execute({ email })
  } catch (err) {
    request.log.error({
      event: 'email.send_failed',
      context: 'forgot_password',
      error: err instanceof Error ? err.message : String(err),
    })
  }

  return reply.status(204).send()
}
