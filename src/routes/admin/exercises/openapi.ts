import { z } from 'zod'

import { bearerAuth, registry } from '~/openapi/registry'
import { createExerciseSchema, updateExerciseSchema } from '~/routes/admin/exercises/schema'
import { EXERCISE_DIFFICULTY } from '~/utils/enums'

const exerciseSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    difficulty: z.enum(EXERCISE_DIFFICULTY),
    programID: z.number().int(),
  })
  .openapi('Exercise')

const messageResponse = z.object({ message: z.string() })
const idParams = z.object({ id: z.string() })

registry.registerPath({
  method: 'post',
  path: '/admin/exercises',
  tags: ['Admin / Exercises'],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    body: { content: { 'application/json': { schema: createExerciseSchema } } },
  },
  responses: {
    201: {
      description: 'Exercise created',
      content: {
        'application/json': {
          schema: z.object({ data: exerciseSchema, message: z.string() }),
        },
      },
    },
    404: {
      description: 'Program not found',
      content: { 'application/json': { schema: messageResponse } },
    },
  },
})

registry.registerPath({
  method: 'patch',
  path: '/admin/exercises/{id}',
  tags: ['Admin / Exercises'],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: idParams,
    body: { content: { 'application/json': { schema: updateExerciseSchema } } },
  },
  responses: {
    200: {
      description: 'Exercise updated',
      content: {
        'application/json': {
          schema: z.object({ data: exerciseSchema, message: z.string() }),
        },
      },
    },
    404: {
      description: 'Exercise or program not found',
      content: { 'application/json': { schema: messageResponse } },
    },
  },
})

registry.registerPath({
  method: 'delete',
  path: '/admin/exercises/{id}',
  tags: ['Admin / Exercises'],
  security: [{ [bearerAuth.name]: [] }],
  request: { params: idParams },
  responses: {
    204: { description: 'Exercise deleted' },
    404: {
      description: 'Exercise not found',
      content: { 'application/json': { schema: messageResponse } },
    },
  },
})
