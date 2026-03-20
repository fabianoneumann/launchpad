import { FastifyRequest, FastifyReply } from 'fastify'
import { makeRegisterService } from '@/shared/factories/make-register-service'

export async function registerController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { name, email, password } = request.body as {
    name: string
    email: string
    password: string
  }

  const service = makeRegisterService()
  const { user } = await service.execute({ name, email, password })

  return reply.status(201).send({ user })
}
