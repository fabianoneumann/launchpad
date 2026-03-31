import type { FastifyRequest, FastifyReply } from 'fastify'
import { makeDeleteOwnAccountService } from '@/shared/factories/make-delete-own-account-service'

export async function deleteOwnAccountController(request: FastifyRequest, reply: FastifyReply) {
  const service = makeDeleteOwnAccountService()
  await service.execute({ userId: request.user.sub })

  return reply.status(204).send()
}
