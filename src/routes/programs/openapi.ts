import { z } from 'zod'

import { registry } from '~/openapi/registry'

const programSchema = z
  .object({
    id: z.number(),
    name: z.string(),
  })
  .openapi('Program')

registry.registerPath({
  method: 'get',
  path: '/programs',
  tags: ['Programs'],
  responses: {
    200: {
      description: 'List of programs',
      content: {
        'application/json': {
          schema: z.object({ data: z.array(programSchema), message: z.string() }),
        },
      },
    },
  },
})
