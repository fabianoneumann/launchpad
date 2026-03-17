import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeRegisterService } from '@/shared/factories/make-register-service'

export async function registerController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(6),
  })

  const { name, email, password } = bodySchema.parse(request.body)

  const service = makeRegisterService()
  const { user } = await service.execute({ name, email, password })

  return reply.status(201).send({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    },
  })
}
