import type { ErrorRequestHandler } from 'express'

import { HttpError } from '~/utils/http-error'

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      message: err.message,
      ...(err.details !== undefined ? { details: err.details } : {}),
    })
    return
  }

  console.error(err)
  res.status(500).json({ message: 'Internal server error' })
}
