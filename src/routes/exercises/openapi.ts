import { z } from 'zod'

import { registry } from '~/openapi/registry'
import { EXERCISE_DIFFICULTY } from '~/utils/enums'

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

registry.registerPath({
  method: 'get',
  path: '/exercises',
  tags: ['Exercises'],
  responses: {
    200: {
      description: 'List of exercises',
      content: {
        'application/json': {
          schema: z.object({ data: z.array(exerciseWithProgramSchema), message: z.string() }),
        },
      },
    },
  },
})
