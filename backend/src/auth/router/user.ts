import { Router } from 'express'
import { requireAuth } from '../middleware/auth.ts'
import { getProfile, updateProfile } from '../controller/user.ts'

const router = Router()

// All user routes require authentication
router.use(requireAuth)

router.get('/profile', getProfile)
router.patch('/profile', updateProfile)

export default router
