import { z } from 'zod'

import { USER_ROLE } from '~/utils/enums'

export const registerSchema = z
  .object({
    email: z.email().openapi({ example: 'jake@a.co' }),
    password: z.string().min(8).openapi({ example: 'password' }),
    role: z.enum(USER_ROLE),
  })
  .openapi('RegisterBody')

export type RegisterBody = z.infer<typeof registerSchema>

export const loginSchema = z
  .object({
    email: z.email().openapi({ example: 'john@a.co' }),
    password: z.string().min(1).openapi({ example: 'password' }),
  })
  .openapi('LoginBody')

export type LoginBody = z.infer<typeof loginSchema>
