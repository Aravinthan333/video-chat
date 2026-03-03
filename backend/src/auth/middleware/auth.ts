import type { Request, Response, NextFunction } from 'express'

// Guards routes that require authentication
// Must be placed before any route handler that needs req.user
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  console.log("Inside require auth")
  if (req.isAuthenticated()) {
    return next()
  }
  // Return 401 instead of redirect for API routes
  // The frontend handles the redirect to /login
  res.status(401).json({ message: 'Authentication required' })
}
