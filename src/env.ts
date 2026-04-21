import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(8000).describe('API port'),
  DATABASE_URL: z.url().describe('Postgres database url'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.issues)
  process.exit(1)
}

const env = parsed.data
export default env
