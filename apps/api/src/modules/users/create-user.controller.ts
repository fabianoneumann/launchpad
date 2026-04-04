import type { FastifyRequest, FastifyReply } from 'fastify'
import type { Role } from '@/generated/prisma/client'
import { makeCreateUserService } from '@/shared/factories/make-create-user-service'
import { UserAlreadyExistsError } from '@/shared/errors/user-already-exists-error'

export async function createUserController(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, role, locale } = request.body as {
    name: string
    email: string
    role: Role
    locale?: string
  }

  const service = makeCreateUserService()

  try {
    const { user } = await service.execute({ name, email, role, locale })
    request.log.info({
      event: 'user.created',
      userId: user.id,
      role: user.role,
      adminId: request.user.sub,
    })
    return reply.status(201).send({ user })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    throw err
  }
}
