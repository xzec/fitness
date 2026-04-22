import { z } from 'zod'

import { paginationQuerySchema } from '~/utils/query-schemas'

export const finishExerciseSchema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .openapi('FinishExerciseBody')
export type FinishExerciseBody = z.infer<typeof finishExerciseSchema>

export const listExercisesQuerySchema = paginationQuerySchema
  .extend({
    programId: z.coerce.number().int().positive().optional(),
  })
  .openapi('ListExercisesQuery')
export type ListExercisesQuery = z.infer<typeof listExercisesQuerySchema>
