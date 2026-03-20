import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifyHelmet from '@fastify/helmet'
import fastifyRateLimit from '@fastify/rate-limit'
import { ZodError } from 'zod'
import { env } from '@/env'
import { AppError } from '@/shared/errors/app-error'
import { authRoutes } from '@/modules/auth/auth.routes'
import { usersRoutes } from '@/modules/users/users.routes'

export const app = fastify({
  logger:
    env.NODE_ENV === 'dev'
      ? { transport: { target: 'pino-pretty', options: { colorize: true } } }
      : true,
})

app.register(fastifyHelmet)

app.register(fastifyCors, {
  origin: env.NODE_ENV === 'production' ? (env.CORS_ORIGIN ?? false) : true,
  credentials: true,
})

app.register(fastifyRateLimit, {
  max: 100,
  timeWindow: '1 minute',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(fastifyCookie)

app.register(authRoutes)
app.register(usersRoutes)

app.get('/health', async (_, reply) => {
  return reply.send({ status: 'ok' })
})

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Erro de validação.',
      errors: error.format(),
    })
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({ message: error.message })
  }

  if (
    error instanceof Error &&
    'statusCode' in error &&
    typeof (error as { statusCode: unknown }).statusCode === 'number'
  ) {
    const statusCode = (error as { statusCode: number }).statusCode
    return reply.status(statusCode).send({ message: error.message })
  }

  request.log.error(error)

  return reply.status(500).send({ message: 'Erro interno do servidor.' })
})
