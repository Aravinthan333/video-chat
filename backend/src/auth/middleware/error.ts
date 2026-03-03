import type { Request, Response, NextFunction } from 'express'

export interface AppError extends Error {
  statusCode?: number
}

export const errorHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  if (process.env.NODE_ENV !== 'production') {
    console.error('[Error]', err)
  }

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}
