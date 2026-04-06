import { z } from 'zod'

export const userResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  role: z.enum(['ADMIN', 'MEMBER', 'USER']),
  locale: z.string(),
  validated_at: z.date().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
})

// Contexto admin: expõe deleted_at para gestão de usuários
export const adminUserResponseSchema = userResponseSchema.extend({
  deleted_at: z.date().nullable(),
})
