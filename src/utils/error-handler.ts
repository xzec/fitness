import type { ErrorRequestHandler } from 'express'

import { HttpError } from '~/utils/http-error'
import logger from '~/utils/logger'

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      message: err.message,
      ...(err.details !== undefined ? { details: err.details } : {}),
    })
    return
  }

  const error = err as Error
  logger.error('uncaught', {
    err: { message: error.message, stack: error.stack, name: error.name },
    method: req.method,
    url: req.originalUrl,
  })
  res.status(500).json({ message: 'Internal server error' })
}
