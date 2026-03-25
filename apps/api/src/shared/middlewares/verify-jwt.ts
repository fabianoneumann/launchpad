import { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch {
    return reply.status(401).send({ message: 'Não autorizado.' })
  }

  const usersRepository = new PrismaUsersRepository()
  const user = await usersRepository.findById(request.user.sub)

  if (!user || user.token_version !== request.user.tokenVersion) {
    return reply.status(401).send({ message: 'Não autorizado.' })
  }
}
