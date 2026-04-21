import { z } from 'zod'

import { USER_ROLE } from '~/utils/enums'

export const registerSchema = z
  .object({
    email: z.email().openapi({ example: 'jane@example.com' }),
    password: z.string().min(8).openapi({ example: 'hunter2hunter2' }),
    role: z.enum(USER_ROLE),
  })
  .openapi('RegisterBody')

export type RegisterBody = z.infer<typeof registerSchema>

export const loginSchema = z
  .object({
    email: z.email().openapi({ example: 'jane@example.com' }),
    password: z.string().min(1),
  })
  .openapi('LoginBody')

export type LoginBody = z.infer<typeof loginSchema>
