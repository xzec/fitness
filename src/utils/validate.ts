import type { Request, Response, NextFunction } from 'express'
import type { ZodType } from 'zod'

import { BadRequestError } from '~/utils/http-error'

export const validateBody =
  <T>(schema: ZodType<T>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      throw new BadRequestError('Invalid request body', result.error.issues)
    }
    req.body = result.data
    next()
  }

export const validateQuery =
  <T>(schema: ZodType<T>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query)
    if (!result.success) {
      throw new BadRequestError('Invalid query parameters', result.error.issues)
    }
    Object.defineProperty(req, 'query', { value: result.data, writable: true, configurable: true })
    next()
  }
