import type { FastifyRequest, FastifyReply } from 'fastify'
import { makeLogoutService } from '@/shared/factories/make-logout-service'

export async function logoutController(request: FastifyRequest, reply: FastifyReply) {
  await makeLogoutService().execute({ userId: request.user.sub })

  return reply.clearCookie('refreshToken', { path: '/' }).status(204).send()
}
