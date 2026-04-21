import { z } from 'zod'

import { USER_ROLE } from '~/utils/enums'

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  role: z.enum(USER_ROLE),
})

export type RegisterBody = z.infer<typeof registerSchema>
