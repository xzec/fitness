import winston from 'winston'

import env from '~/env'

const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf((info) => {
          const { timestamp, level, message, ...meta } = info
          const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : ''
          return `${timestamp as string} ${level} ${message as string}${metaStr}`
        })
      ),
    }),
    new winston.transports.File({
      filename: `logs/app_${Date.now()}.log`,
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),
  ],
})

export default logger
