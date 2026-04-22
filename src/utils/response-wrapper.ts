import type { RequestHandler, Response } from 'express'
import type { ApiResponseSuccess, ApiResponseError } from '~/types/api-response'

export const responseWrapper: RequestHandler = (_req, res, next) => {
  const json = res.json.bind(res) as Response['json']
  res.json = <T>(body: T) => {
    if (res.statusCode < 400) {
      return json({ success: true, data: body } satisfies ApiResponseSuccess<T>)
    } else {
      return json({ success: false, error: body } satisfies ApiResponseError)
    }
  }
  next()
}
