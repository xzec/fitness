import type { Request, Response } from 'express'
import { Router } from 'express'

import { requireAuth } from '~/utils/auth'

const router = Router()

export default () => {
  router.use(requireAuth)

  router.get('/', (req: Request, res: Response): any => {
    const { id, name, surname, age, nickName } = req.user

    return res.json({ id, name, surname, age, nickName })
  })

  return router
}
