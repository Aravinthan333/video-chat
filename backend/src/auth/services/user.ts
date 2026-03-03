import { prisma } from '@/config/prismaClient.ts'

export const findUserById = async (id: number) => {
  return prisma.user.findUnique({ where: { id } })
}

export const updateUserById = async (id, data) => {
  const sanitized = {}

  if (data.displayName !== undefined) {
    const trimmed = data.displayName.trim()
    if (trimmed.length > 50) throw new Error('Display name too long (max 50 chars)')
    sanitized.displayName = trimmed
  }
  return prisma.user.update({
    where: { id },
    data: sanitized
  })
}

