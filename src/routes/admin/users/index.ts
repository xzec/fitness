import type { Request, Response } from 'express'
import { Router } from 'express'

import { models } from '~/db'
import { type UpdateUserBody, updateUserSchema } from '~/routes/admin/users/schema'
import { requireAuth, requireRole } from '~/utils/auth'
import { USER_ROLE } from '~/utils/enums'
import { NotFoundError } from '~/utils/http-error'
import { validateBody } from '~/utils/validate'

const router = Router()

const { User } = models

export default () => {
  router.use(requireAuth, requireRole(USER_ROLE.ADMIN))

  router.get('/', async (_req: Request, res: Response): Promise<any> => {
    const users = await User.findAll({ attributes: { exclude: ['password'] } })

    return res.json(users)
  })

  router.get('/:id', async (req: Request<{ id: string }>, res: Response): Promise<any> => {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    })
    if (!user) {
      throw new NotFoundError('User not found')
    }

    return res.json(user)
  })

  router.patch(
    '/:id',
    validateBody(updateUserSchema),
    async (req: Request<{ id: string }, any, UpdateUserBody>, res: Response): Promise<any> => {
      const user = await User.findByPk(req.params.id)
      if (!user) {
        throw new NotFoundError('User not found')
      }

      await user.update(req.body)

      const updated = await User.findByPk(user.id, {
        attributes: { exclude: ['password'] },
      })

      return res.json(updated)
    }
  )

  return router
}
