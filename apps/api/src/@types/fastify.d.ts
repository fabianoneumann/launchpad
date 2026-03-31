import 'fastify'
import type { UsersRepository } from '@/repositories/users-repository'

declare module 'fastify' {
  interface FastifyInstance {
    usersRepository: UsersRepository
  }
}
