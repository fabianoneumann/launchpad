import type { FastifyRequest, FastifyReply } from 'fastify'
import { makeRefreshTokenService } from '@/shared/factories/make-refresh-token-service'
import { InvalidCredentialsError } from '@/shared/errors/invalid-credentials-error'

export async function refreshTokenController(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true })

  const { sub, tokenVersion } = request.user

  try {
    const { user } = await makeRefreshTokenService().execute({ userId: sub, tokenVersion })

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
      .send({ token, user })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: 'Não autorizado.' })
    }
    throw error
  }
}
