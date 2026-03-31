import type { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch {
    return reply.status(401).send({ message: 'Não autorizado.' })
  }

  const user = await request.server.usersRepository.findById(request.user.sub)

  if (!user || user.token_version !== request.user.tokenVersion) {
    return reply.status(401).send({ message: 'Não autorizado.' })
  }
}
