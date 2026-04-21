import { z } from 'zod'

import { USER_ROLE } from '~/utils/enums'

export const updateUserSchema = z
  .object({
    name: z.string().min(1).max(200),
    surname: z.string().min(1).max(200),
    nickName: z.string().min(1).max(200),
    age: z.number().int().nonnegative(),
    role: z.enum(USER_ROLE),
  })
  .partial()
  .openapi('UpdateUserBody')
export type UpdateUserBody = z.infer<typeof updateUserSchema>
