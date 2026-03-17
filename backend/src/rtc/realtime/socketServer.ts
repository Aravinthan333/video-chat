import { Server } from 'socket.io'
import http from 'http'
import { createAdapter } from '@socket.io/redis-adapter'
import redisClient from '../../config/redis.ts'
import { socketAuthMiddleware } from './socketAuth.ts'
import registerSocketEvents from './socketEvents.ts'

export const createSocketServer = async(server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true
    }
  })

  const pubClient = redisClient
  const subClient = redisClient.duplicate()

  await subClient.connect()

  io.adapter(createAdapter(pubClient, subClient))

  // io.use(socketAuthMiddleware)

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id)
    registerSocketEvents(io, socket)


    // socket.on('join_room', (data) => {
    //   console.log('User joined room:', data)
    // })

    // socket.on('disconnect', () => {
    //   console.log('User disconnected:', socket.id)
    // })
  })

  return io
}

