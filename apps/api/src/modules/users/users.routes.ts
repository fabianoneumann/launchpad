import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { verifyJWT } from '@/shared/middlewares/verify-jwt'
import { verifyUserRole } from '@/shared/middlewares/verify-user-role'
import { listUsersController } from './list-users.controller'
import { getUserController } from './get-user.controller'
import { updateUserController } from './update-user.controller'
import { changeUserRoleController } from './change-user-role.controller'
import { deleteUserController } from './delete-user.controller'

const userResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  role: z.enum(['ADMIN', 'MEMBER', 'USER']),
  validated_at: z.date().nullable(),
  deleted_at: z.date().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
})

export const usersRoutes: FastifyPluginAsyncZod = async (app) => {
  app.addHook('onRequest', verifyJWT)
  app.addHook('onRequest', verifyUserRole('ADMIN'))

  app.route({
    method: 'GET',
    url: '/users',
    schema: {
      querystring: z.object({
        page: z.coerce.number().int().positive().default(1),
        perPage: z.coerce.number().int().positive().default(20),
        role: z.enum(['ADMIN', 'MEMBER', 'USER']).optional(),
      }),
      response: {
        200: z.object({
          users: z.array(userResponseSchema),
          total: z.number(),
        }),
      },
    },
    handler: listUsersController,
  })

  app.route({
    method: 'GET',
    url: '/users/:id',
    schema: {
      params: z.object({ id: z.string().uuid() }),
      response: {
        200: z.object({ user: userResponseSchema }),
      },
    },
    handler: getUserController,
  })

  app.route({
    method: 'PATCH',
    url: '/users/:id',
    schema: {
      params: z.object({ id: z.string().uuid() }),
      body: z.object({
        name: z.string().min(1),
        email: z.email(),
      }),
      response: {
        200: z.object({ user: userResponseSchema }),
      },
    },
    handler: updateUserController,
  })

  app.route({
    method: 'PATCH',
    url: '/users/:id/role',
    schema: {
      params: z.object({ id: z.string().uuid() }),
      body: z.object({
        role: z.enum(['ADMIN', 'MEMBER', 'USER']),
      }),
      response: {
        200: z.object({ user: userResponseSchema }),
      },
    },
    handler: changeUserRoleController,
  })

  app.route({
    method: 'DELETE',
    url: '/users/:id',
    schema: {
      params: z.object({ id: z.string().uuid() }),
      response: {
        204: z.null(),
      },
    },
    handler: deleteUserController,
  })
}
