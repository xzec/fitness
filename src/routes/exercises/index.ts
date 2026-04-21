import type { Request, Response } from 'express'
import { Router } from 'express'

import { models } from '~/db'

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

  return router
}
