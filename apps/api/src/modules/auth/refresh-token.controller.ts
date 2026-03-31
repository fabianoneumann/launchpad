import type { FastifyRequest, FastifyReply } from 'fastify'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export async function refreshTokenController(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true })

  const { sub, tokenVersion } = request.user

  const usersRepository = new PrismaUsersRepository()
  const user = await usersRepository.findById(sub)

  if (!user || user.token_version !== tokenVersion) {
    return reply.status(401).send({ message: 'Não autorizado.' })
  }

  const token = await reply.jwtSign(
    { role: user.role, tokenVersion: user.token_version },
    { sign: { sub: user.id } },
  )

  const refreshToken = await reply.jwtSign(
    { role: user.role, tokenVersion: user.token_version },
    { sign: { sub: user.id, expiresIn: '7d' } },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({ token })
}
