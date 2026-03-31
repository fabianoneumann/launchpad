import type { FastifyRequest, FastifyReply } from 'fastify'
import { makeUpdateProfileService } from '@/shared/factories/make-update-profile-service'

export async function updateProfileController(request: FastifyRequest, reply: FastifyReply) {
  const { name } = request.body as { name: string }

  const service = makeUpdateProfileService()
  const { user } = await service.execute({ userId: request.user.sub, name })

  return reply.status(200).send({ user })
}
