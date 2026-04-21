import { z } from 'zod'

import { bearerAuth, registry } from '~/openapi/registry'
import { updateUserSchema } from '~/routes/admin/users/schema'
import { USER_ROLE } from '~/utils/enums'

const userSchema = z
  .object({
    id: z.number(),
    email: z.email(),
    name: z.string().nullable(),
    surname: z.string().nullable(),
    nickName: z.string().nullable(),
    age: z.number().int().nullable(),
    role: z.enum(USER_ROLE),
  })
  .openapi('User')

const messageResponse = z.object({ message: z.string() })
const idParams = z.object({ id: z.string() })

registry.registerPath({
  method: 'get',
  path: '/admin/users',
  tags: ['Admin / Users'],
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: {
      description: 'List of users',
      content: {
        'application/json': {
          schema: z.object({ data: z.array(userSchema), message: z.string() }),
        },
      },
    },
  },
})

registry.registerPath({
  method: 'get',
  path: '/admin/users/{id}',
  tags: ['Admin / Users'],
  security: [{ [bearerAuth.name]: [] }],
  request: { params: idParams },
  responses: {
    200: {
      description: 'User detail',
      content: {
        'application/json': {
          schema: z.object({ data: userSchema, message: z.string() }),
        },
      },
    },
    404: {
      description: 'User not found',
      content: { 'application/json': { schema: messageResponse } },
    },
  },
})

registry.registerPath({
  method: 'patch',
  path: '/admin/users/{id}',
  tags: ['Admin / Users'],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: idParams,
    body: { content: { 'application/json': { schema: updateUserSchema } } },
  },
  responses: {
    200: {
      description: 'User updated',
      content: {
        'application/json': {
          schema: z.object({ data: userSchema, message: z.string() }),
        },
      },
    },
    404: {
      description: 'User not found',
      content: { 'application/json': { schema: messageResponse } },
    },
  },
})
