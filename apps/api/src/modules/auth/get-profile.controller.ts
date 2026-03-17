import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetProfileService } from '@/shared/factories/make-get-profile-service'

export async function getProfileController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const service = makeGetProfileService()
  const { user } = await service.execute({ userId: request.user.sub })

  return reply.status(200).send({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    },
  })
}
