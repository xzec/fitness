import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(8000).describe('API port'),
  DATABASE_URL: z.url().describe('Postgres database url'),
  JWT_SECRET: z.string().min(1).describe('JWT secret key for Passport'),
  JWT_EXPIRES_IN: z.string().default('1d').describe('JWT expiration time'),
  LOG_LEVEL: z
    .enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'])
    .default('info')
    .describe('Winston log level'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.issues)
  process.exit(1)
}

const env = parsed.data
export default env
