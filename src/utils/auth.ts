import type { Request, Response, NextFunction, RequestHandler } from 'express'
import passport from 'passport'

import type { USER_ROLE } from '~/utils/enums'

export const requireAuth = passport.authenticate('jwt', { session: false }) as RequestHandler

export const requireRole =
  (...roles: USER_ROLE[]) =>
  (req: Request, res: Response, next: NextFunction): any => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    return next()
  }
