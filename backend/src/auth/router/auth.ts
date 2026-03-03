import { Router } from 'express'
import passport from '../config/passport.ts'
import { getMe, googleCallback, logout } from '../controller/auth.ts'
import { requireAuth } from '../middleware/auth.ts'

const router = Router()

// Initiates Google OAuth flow
// When user hits this, passport redirects them to Google's consent screen
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

// Google redirects back here after user grants/denies permission
// On failure: redirect to login with error query param
// On success: passport calls our strategy callback, then googleCallback controller
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
    session: true
  }),
  googleCallback
)

router.get('/me', requireAuth, getMe)
router.post('/logout', requireAuth, logout)

export default router
