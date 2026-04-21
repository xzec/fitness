import { z } from 'zod'

import { registry } from '~/openapi/registry'
import { loginSchema, registerSchema } from '~/routes/auth/schema'
import { USER_ROLE } from '~/utils/enums'

const messageResponse = z.object({ message: z.string() })

registry.registerPath({
  method: 'post',
  path: '/auth/register',
  tags: ['Auth'],
  request: {
    body: { content: { 'application/json': { schema: registerSchema } } },
  },
  responses: {
    201: {
      description: 'User registered',
      content: {
        'application/json': {
          schema: z.object({
            data: z.object({
              id: z.number(),
              email: z.email(),
              role: z.enum(USER_ROLE),
            }),
            message: z.string(),
          }),
        },
      },
    },
    409: {
      description: 'E-mail already registered',
      content: { 'application/json': { schema: messageResponse } },
    },
  },
})

registry.registerPath({
  method: 'post',
  path: '/auth/login',
  tags: ['Auth'],
  request: {
    body: { content: { 'application/json': { schema: loginSchema } } },
  },
  responses: {
    200: {
      description: 'Logged in',
      content: {
        'application/json': {
          schema: z.object({
            data: z.object({ token: z.string() }),
            message: z.string(),
          }),
        },
      },
    },
    401: {
      description: 'Invalid credentials',
      content: { 'application/json': { schema: messageResponse } },
    },
  },
})
