import { z } from 'zod'

import { bearerAuth, registry } from '~/openapi/registry'

const userSummarySchema = z
  .object({
    id: z.number(),
    nickName: z.string().nullable(),
  })
  .openapi('UserSummary')

const messageResponse = z.object({ message: z.string() })

registry.registerPath({
  method: 'get',
  path: '/users',
  tags: ['Users'],
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: {
      description: 'List of users',
      content: {
        'application/json': {
          schema: z.object({ data: z.array(userSummarySchema), message: z.string() }),
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: { 'application/json': { schema: messageResponse } },
    },
  },
})
