import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateUserService } from '@/shared/factories/make-update-user-service'

export async function updateUserController(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().uuid() })
  const bodySchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
  })

  const { id } = paramsSchema.parse(request.params)
  const { name, email } = bodySchema.parse(request.body)

  const service = makeUpdateUserService()
  const { user } = await service.execute({ userId: id, name, email })

  const { password_hash: _, ...userWithoutPassword } = user

  return reply.status(200).send({ user: userWithoutPassword })
}
