import type { Request, Response } from 'express'
import { Router } from 'express'

import { models } from '~/db'
import {
  type FinishExerciseBody,
  type ListExercisesQuery,
  finishExerciseSchema,
  listExercisesQuerySchema,
} from '~/routes/exercises/schema'
import { requireAuth } from '~/utils/auth'
import { ConflictError, NotFoundError } from '~/utils/http-error'
import { validateBody, validateQuery } from '~/utils/validate'

const router = Router()

const { CompletedExercise, Exercise, Program } = models

export default () => {
  router.get('/', validateQuery(listExercisesQuerySchema), async (req: Request, res: Response): Promise<any> => {
    const { page, limit } = req.query as unknown as ListExercisesQuery
    const { rows, count } = await Exercise.findAndCountAll({
      include: [{ model: Program }],
      limit,
      offset: (page - 1) * limit,
      order: [['id', 'ASC']],
    })

    return res.json({
      exercises: rows,
      pagination: { page, limit, total: count },
    })
  })

  router.get('/completed', requireAuth, async (req: Request, res: Response): Promise<any> => {
    const completed = await CompletedExercise.findAll({
      where: { userID: req.user.id },
      include: [{ model: Exercise }],
      order: [['startedAt', 'DESC']],
    })

    return res.json(completed)
  })

  router.delete(
    '/:exerciseId/completed/:id',
    requireAuth,
    async (req: Request<{ exerciseId: string; id: string }>, res: Response): Promise<any> => {
      const completed = await CompletedExercise.findOne({
        where: {
          id: req.params.id,
          userID: req.user.id,
          exerciseID: req.params.exerciseId,
        },
      })
      if (!completed) {
        throw new NotFoundError('Completed exercise not found')
      }

      await completed.destroy()

      return res.status(204).send()
    }
  )

  router.post(
    '/:exerciseId/start',
    requireAuth,
    async (req: Request<{ exerciseId: string }>, res: Response): Promise<any> => {
      const exercise = await Exercise.findByPk(req.params.exerciseId)
      if (!exercise) {
        throw new NotFoundError('Exercise not found')
      }

      const completed = await CompletedExercise.create({
        userID: req.user.id,
        exerciseID: exercise.id,
        startedAt: new Date(),
      })

      return res.status(201).json(completed)
    }
  )

  router.post(
    '/:exerciseId/finish',
    requireAuth,
    validateBody(finishExerciseSchema),
    async (req: Request<{ exerciseId: string }, any, FinishExerciseBody>, res: Response): Promise<any> => {
      const completed = await CompletedExercise.findOne({
        where: {
          id: req.body.id,
          userID: req.user.id,
          exerciseID: req.params.exerciseId,
        },
      })
      if (!completed) {
        throw new NotFoundError("Can't complete exercise that never started")
      }
      if (completed.completedAt) {
        throw new ConflictError('Exercise already finished')
      }

      const now = new Date()
      await completed.update({
        completedAt: now,
        durationSeconds: Math.floor((now.getTime() - completed.startedAt.getTime()) / 1000),
      })

      return res.json(completed)
    }
  )

  return router
}
