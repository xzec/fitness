import type { Request, Response } from 'express'
import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { models } from '~/db'
import env from '~/env'
import { type LoginBody, type RegisterBody, loginSchema, registerSchema } from '~/routes/auth/schema'
import { ConflictError, UnauthorizedError } from '~/utils/http-error'
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
        throw new ConflictError('E-mail already registered')
      }

      const hash = await bcrypt.hash(password, 10)
      const user = await User.create({ email, password: hash, role })

      return res.status(201).json({
        data: { id: user.id, email: user.email, role: user.role },
        message: 'User registered',
      })
    }
  )

  router.post(
    '/login',
    validateBody(loginSchema),
    async (req: Request<any, any, LoginBody>, res: Response): Promise<any> => {
      const { email, password } = req.body

      const user = await User.findOne({ where: { email } })
      if (!user) {
        throw new UnauthorizedError('Invalid credentials')
      }

      const ok = await bcrypt.compare(password, user.password)
      if (!ok) {
        throw new UnauthorizedError('Invalid credentials')
      }

      const token = jwt.sign({ id: user.id }, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
      })

      return res.json({
        data: { token },
        message: 'Logged in',
      })
    }
  )

  return router
}
