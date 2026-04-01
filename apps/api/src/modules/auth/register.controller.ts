import type { FastifyRequest, FastifyReply } from 'fastify'
import { resolveLocale } from '@/lib/locale/resolve-locale'
import { makeRegisterService } from '@/shared/factories/make-register-service'
import { makeSendVerificationEmailService } from '@/shared/factories/make-send-verification-email-service'

export async function registerController(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = request.body as {
    name: string
    email: string
    password: string
  }

  const locale = resolveLocale(request.headers['accept-language'])

  const service = makeRegisterService()
  const { user } = await service.execute({ name, email, password, locale })

  makeSendVerificationEmailService()
    .execute({ userId: user.id })
    .catch(() => {})

  return reply.status(201).send({ user })
}
