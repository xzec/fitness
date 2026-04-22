export type ApiResponseSuccess<T> = { success: true; data: T }
export type ApiResponseError = { success: false; error: unknown }
export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError
