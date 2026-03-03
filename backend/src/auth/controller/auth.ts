import type { Request, Response } from 'express'
import { env } from '../config/checkEnv.ts'

export const googleCallback = (req: Request, res: Response) => {
  // By this point, passport has already verified the token,
  // upserted the user, and called serializeUser to store in session
  res.redirect(`${env.clientUrl}/dashboard`)
}

export const getMe = (req: Request, res: Response) => {
  // req.user is populated by passport.deserializeUser on each request
  res.json({ user: req.user })
}

export const logout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' })
    }

    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        return res.status(500).json({ message: 'Session destruction failed' })
      }

      // Clear the session cookie from client
      res.clearCookie('connect.sid', {
        path: '/',
        httpOnly: true,
        secure: env.nodeEnv === 'production',
        sameSite: env.nodeEnv === 'production' ? 'none' : 'lax'
      })

      res.json({ message: 'Logged out successfully' })
    })
  })
}
