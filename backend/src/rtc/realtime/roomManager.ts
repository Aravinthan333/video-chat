import redisClient from '../../config/redis.ts'

export const addUserToRoom = async (roomId: string, userId: string) => {
  await redisClient.sAdd(`room:${roomId}:users`, userId)
}

export const removeUserFromRoom = async (roomId: string, userId: string) => {
  await redisClient.sRem(`room:${roomId}:users`, userId)
}

export const getRoomUsers = async (roomId: string) => redisClient.sMembers(`room:${roomId}:users`)
