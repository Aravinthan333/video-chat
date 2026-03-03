import type { Request, Response } from 'express'
import { findUserById, updateUserById } from '../services/user.ts'

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await findUserById(req.user!.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ user })
  } catch {
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { displayName, bio } = req.body
    const updatedUser = await updateUserById(req.user!.id, {
      displayName,
      bio
    })
    res.json({ user: updatedUser, message: 'Profile updated successfully' })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}
