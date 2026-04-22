import { z } from 'zod'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10
const MAX_LIMIT = 100

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(DEFAULT_PAGE),
  limit: z.coerce.number().int().positive().max(MAX_LIMIT).default(DEFAULT_LIMIT),
})

export const searchQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
})

export const paginated = z.object({
  pagination: z.object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
  }),
})
