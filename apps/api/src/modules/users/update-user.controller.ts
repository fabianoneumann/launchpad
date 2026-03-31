import type { FastifyRequest, FastifyReply } from 'fastify'
import { makeUpdateUserService } from '@/shared/factories/make-update-user-service'

export async function updateUserController(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  const { name, email } = request.body as { name: string; email: string }

  const service = makeUpdateUserService()
  const { user } = await service.execute({ userId: id, name, email })

  return reply.status(200).send({ user })
}
