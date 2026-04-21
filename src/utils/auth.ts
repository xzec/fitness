import type { Request, Response, NextFunction, RequestHandler } from 'express'
import passport from 'passport'

import type { USER_ROLE } from '~/utils/enums'
import { ForbiddenError } from '~/utils/http-error'

export const requireAuth = passport.authenticate('jwt', { session: false }) as RequestHandler

export const requireRole =
  (...roles: USER_ROLE[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ForbiddenError()
    }
    next()
  }
