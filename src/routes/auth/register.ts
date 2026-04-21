import type { Request, Response } from 'express'
import { Router } from 'express'
import bcrypt from 'bcrypt'

import { models } from '~/db'
import { type RegisterBody, registerSchema } from '~/routes/auth/schema'
import { validateBody } from '~/utils/validate'

const router = Router()

const { User } = models

export default () => {
  router.post(
    '/register',
    validateBody(registerSchema),
    async (req: Request<any, any, RegisterBody>, res: Response): Promise<any> => {
      const { email, password, role } = req.body

      const existing = await User.findOne({ where: { email } })
      if (existing) {
        return res.status(409).json({ message: 'E-mail already registered' })
      }

      const hash = await bcrypt.hash(password, 10)
      const user = await User.create({ email, password: hash, role })

      return res.status(201).json({
        data: { id: user.id, email: user.email, role: user.role },
        message: 'User registered',
      })
    }
  )

  return router
}
