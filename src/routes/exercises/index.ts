import type { Request, Response } from 'express'
import { Router } from 'express'

import { models } from '~/db'
import {
  type CreateExerciseBody,
  type UpdateExerciseBody,
  createExerciseSchema,
  updateExerciseSchema,
} from '~/routes/exercises/schema'
import { requireAuth, requireRole } from '~/utils/auth'
import { USER_ROLE } from '~/utils/enums'
import { validateBody } from '~/utils/validate'

const router = Router()

const { Exercise, Program } = models

export default () => {
  router.get('/', async (_req: Request, res: Response): Promise<any> => {
    const exercises = await Exercise.findAll({
      include: [{ model: Program }],
    })

    return res.json({
      data: exercises,
      message: 'List of exercises',
    })
  })

  router.post(
    '/',
    requireAuth,
    requireRole(USER_ROLE.ADMIN),
    validateBody(createExerciseSchema),
    async (req: Request<any, any, CreateExerciseBody>, res: Response): Promise<any> => {
      const { name, difficulty, programID } = req.body

      const program = await Program.findByPk(programID)
      if (!program) {
        return res.status(404).json({ message: 'Program not found' })
      }

      const exercise = await Exercise.create({ name, difficulty, programID })

      return res.status(201).json({
        data: exercise,
        message: 'Exercise created',
      })
    }
  )

  router.patch(
    '/:id',
    requireAuth,
    requireRole(USER_ROLE.ADMIN),
    validateBody(updateExerciseSchema),
    async (req: Request<{ id: string }, any, UpdateExerciseBody>, res: Response): Promise<any> => {
      const exercise = await Exercise.findByPk(req.params.id)
      if (!exercise) {
        return res.status(404).json({ message: 'Exercise not found' })
      }

      if (req.body.programID !== undefined) {
        const program = await Program.findByPk(req.body.programID)
        if (!program) {
          return res.status(404).json({ message: 'Program not found' })
        }
      }

      await exercise.update(req.body)

      return res.json({
        data: exercise,
        message: 'Exercise updated',
      })
    }
  )

  router.delete(
    '/:id',
    requireAuth,
    requireRole(USER_ROLE.ADMIN),
    async (req: Request<{ id: string }>, res: Response): Promise<any> => {
      const exercise = await Exercise.findByPk(req.params.id)
      if (!exercise) {
        return res.status(404).json({ message: 'Exercise not found' })
      }

      await exercise.destroy()

      return res.status(204).send()
    }
  )

  return router
}
