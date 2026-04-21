import { z } from 'zod'

import { EXERCISE_DIFFICULTY } from '~/utils/enums'

export const createExerciseSchema = z
  .object({
    name: z.string().min(1).max(200),
    difficulty: z.enum(EXERCISE_DIFFICULTY),
    programID: z.coerce.number().int().positive(),
  })
  .openapi('CreateExerciseBody')
export type CreateExerciseBody = z.infer<typeof createExerciseSchema>

export const updateExerciseSchema = createExerciseSchema.partial().openapi('UpdateExerciseBody')
export type UpdateExerciseBody = z.infer<typeof updateExerciseSchema>
