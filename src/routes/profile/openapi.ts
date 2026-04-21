import { z } from 'zod'

import { bearerAuth, registry } from '~/openapi/registry'

const profileSchema = z
  .object({
    id: z.number(),
    name: z.string().nullable(),
    surname: z.string().nullable(),
    age: z.number().int().nullable(),
    nickName: z.string().nullable(),
  })
  .openapi('Profile')

const messageResponse = z.object({ message: z.string() })

registry.registerPath({
  method: 'get',
  path: '/profile',
  tags: ['Profile'],
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: {
      description: 'Own profile',
      content: {
        'application/json': {
          schema: z.object({ data: profileSchema, message: z.string() }),
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: { 'application/json': { schema: messageResponse } },
    },
  },
})
