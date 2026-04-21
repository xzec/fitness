import type { RequestHandler } from 'express'

import logger from '~/utils/logger'

export const requestLogger: RequestHandler = (req, res, next) => {
  const start = process.hrtime.bigint()

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6
    logger.info('request', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs,
      userID: req.user?.id,
    })
  })

  next()
}
