import 'fastify'
import { UsersRepository } from '@/repositories/users-repository'

declare module 'fastify' {
  interface FastifyInstance {
    usersRepository: UsersRepository
  }
}
