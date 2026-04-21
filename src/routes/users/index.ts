import type { Request, Response } from 'express'
import { Router } from 'express'

import { models } from '~/db'
import { requireAuth } from '~/utils/auth'

const router = Router()

const { User } = models

export default () => {
  router.use(requireAuth)

  router.get('/', async (_req: Request, res: Response): Promise<any> => {
    const users = await User.findAll({ attributes: ['id', 'nickName'] })

    return res.json({
      data: users,
      message: 'List of users',
    })
  })

  return router
}
