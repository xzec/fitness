import { z } from 'zod'

import { bearerAuth, registry } from '~/openapi/registry'
import { finishExerciseSchema, listExercisesQuerySchema } from '~/routes/exercises/schema'
import { EXERCISE_DIFFICULTY } from '~/utils/enums'
import { paginated } from '~/utils/query-schemas'

const exerciseWithProgramSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    difficulty: z.enum(EXERCISE_DIFFICULTY),
    programID: z.number().int(),
    Program: z
      .object({
        id: z.number(),
        name: z.string(),
      })
      .nullable(),
  })
  .openapi('ExerciseWithProgram')

const completedExerciseSchema = z
  .object({
    id: z.number(),
    userID: z.number(),
    exerciseID: z.number(),
    startedAt: z.iso.datetime(),
    completedAt: z.iso.datetime().nullable(),
    durationSeconds: z.number().int().nullable(),
  })
  .openapi('CompletedExercise')

const messageResponse = z.object({ message: z.string() })
const exerciseIdParams = z.object({ exerciseId: z.string() })

const completedExerciseWithExerciseSchema = completedExerciseSchema
  .extend({
    exercise: z
      .object({
        id: z.number(),
        name: z.string(),
        difficulty: z.string(),
        programID: z.number().int(),
      })
      .nullable()
      .optional(),
  })
  .openapi('CompletedExerciseWithExercise')

registry.registerPath({
  method: 'get',
  path: '/exercises',
  tags: ['Exercises'],
  request: { query: listExercisesQuerySchema },
  responses: {
    200: {
      description: 'List of exercises',
      content: {
        'application/json': {
          schema: paginated.extend({ exercises: z.array(exerciseWithProgramSchema) }),
        },
      },
    },
    400: {
      description: 'Invalid query',
      content: { 'application/json': { schema: messageResponse } },
    },
  },
})

registry.registerPath({
  method: 'get',
  path: '/exercises/completed',
  tags: ['Exercises'],
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: {
      description: 'List of completed exercises',
      content: {
        'application/json': {
          schema: z.object({
            data: z.array(completedExerciseWithExerciseSchema),
            message: z.string(),
          }),
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: { 'application/json': { schema: messageResponse } },
    },
  },
})

registry.registerPath({
  method: 'delete',
  path: '/exercises/{exerciseId}/completed/{id}',
  tags: ['Exercises'],
  security: [{ [bearerAuth.name]: [] }],
  request: { params: exerciseIdParams.extend({ id: z.string() }) },
  responses: {
    204: { description: 'Completed exercise removed' },
    401: {
      description: 'Unauthorized',
      content: { 'application/json': { schema: messageResponse } },
    },
    404: {
      description: 'Completed exercise not found',
      content: { 'application/json': { schema: messageResponse } },
    },
  },
})

registry.registerPath({
  method: 'post',
  path: '/exercises/{exerciseId}/start',
  tags: ['Exercises'],
  security: [{ [bearerAuth.name]: [] }],
  request: { params: exerciseIdParams },
  responses: {
    201: {
      description: 'Exercise started',
      content: {
        'application/json': {
          schema: z.object({ data: completedExerciseSchema, message: z.string() }),
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: { 'application/json': { schema: messageResponse } },
    },
    404: {
      description: 'Exercise not found',
      content: { 'application/json': { schema: messageResponse } },
    },
  },
})

registry.registerPath({
  method: 'post',
  path: '/exercises/{exerciseId}/finish',
  tags: ['Exercises'],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: exerciseIdParams,
    body: { content: { 'application/json': { schema: finishExerciseSchema } } },
  },
  responses: {
    200: {
      description: 'Exercise finished',
      content: {
        'application/json': {
          schema: z.object({ data: completedExerciseSchema, message: z.string() }),
        },
      },
    },
    400: {
      description: 'Invalid body',
      content: { 'application/json': { schema: messageResponse } },
    },
    401: {
      description: 'Unauthorized',
      content: { 'application/json': { schema: messageResponse } },
    },
    404: {
      description: "Can't complete exercise that never started",
      content: { 'application/json': { schema: messageResponse } },
    },
    409: {
      description: 'Exercise already finished',
      content: { 'application/json': { schema: messageResponse } },
    },
  },
})
