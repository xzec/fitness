import { z } from 'zod'

export const finishExerciseSchema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .openapi('FinishExerciseBody')
export type FinishExerciseBody = z.infer<typeof finishExerciseSchema>
