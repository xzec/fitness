import type { RequestHandler } from 'express'

import logger from '~/utils/logger'

export const requestLogger: RequestHandler = (req, res, next) => {
  const start = process.hrtime.bigint()

  res.on('finish', () => {
    const durationMs = Math.round(Number(process.hrtime.bigint() - start) / 1e3) / 1e3
    logger.log(
      res.statusCode >= 500 ? 'error' : 'info',
      `${res.statusCode} ${req.method} ${req.originalUrl} ${durationMs}ms ${req.user?.id ? `user=${req.user.id}` : ''}`
    )
  })

  next()
}
