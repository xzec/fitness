import type { Request, Response } from 'express'
import { Router } from 'express'

import { models } from '~/db'
import {
  type CreateExerciseBody,
  type UpdateExerciseBody,
  createExerciseSchema,
  updateExerciseSchema,
} from '~/routes/admin/exercises/schema'
import { requireAuth, requireRole } from '~/utils/auth'
import { USER_ROLE } from '~/utils/enums'
import { NotFoundError } from '~/utils/http-error'
import { idParamSchema } from '~/utils/common-schemas'
import { validateBody, validateParams } from '~/utils/validate'

const router = Router()

const { Exercise, Program } = models

export default () => {
  router.use(requireAuth, requireRole(USER_ROLE.ADMIN))

  router.post(
    '/',
    validateBody(createExerciseSchema),
    async (req: Request<any, any, CreateExerciseBody>, res: Response): Promise<any> => {
      const { name, difficulty, programID } = req.body

      const program = await Program.findByPk(programID)
      if (!program) {
        throw new NotFoundError('Program not found')
      }

      const exercise = await Exercise.create({ name, difficulty, programID })

      return res.status(201).json(exercise)
    }
  )

  router.patch(
    '/:id',
    validateParams(idParamSchema),
    validateBody(updateExerciseSchema),
    async (req: Request<{ id: string }, any, UpdateExerciseBody>, res: Response): Promise<any> => {
      const exercise = await Exercise.findByPk(req.params.id)
      if (!exercise) {
        throw new NotFoundError('Exercise not found')
      }

      if (req.body.programID !== undefined) {
        const program = await Program.findByPk(req.body.programID)
        if (!program) {
          throw new NotFoundError('Program not found')
        }
      }

      await exercise.update(req.body)

      return res.json(exercise)
    }
  )

  router.delete(
    '/:id',
    validateParams(idParamSchema),
    async (req: Request<{ id: string }>, res: Response): Promise<any> => {
      const exercise = await Exercise.findByPk(req.params.id)
      if (!exercise) {
        throw new NotFoundError('Exercise not found')
      }

      await exercise.destroy()

      return res.status(204).send()
    }
  )

  return router
}
