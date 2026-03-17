import { Server, Socket } from 'socket.io'
import { addUserToRoom, removeUserFromRoom, getRoomUsers } from './roomManager.ts'

export default function registerSocketEvents(io: Server, socket: Socket) {
  socket.on('join-room', async ({roomId, userId}: {roomId: string, userId: string}) => {
    try {
      console.log("Inside join room")
      console.log("Socket Data: ", socket.data)
      console.log("roomId: ", roomId)
      console.log("userId: ", userId)

      // await addUserToRoom(roomId, userId)

      socket.join(roomId)

      const users = await getRoomUsers(roomId)

      console.log("Users in room: ", users)

      // io.to(roomId).emit('room-users', users)

      socket.to(roomId).emit('user-joined', {
        userId,
        users
      })
    } catch (error) {
      console.log('================================================')
      console.error('Error in join-room:', error.message)
      console.log('================================================')
      socket.emit('error', 'Failed to join room')
      console.log('================================================')
    }
  })

  socket.on('leave-room', async (roomId: string) => {
    try {
      const userId = socket.data.userId

      await removeUserFromRoom(roomId, userId)

      socket.leave(roomId)

      const users = await getRoomUsers(roomId)

      io.to(roomId).emit('room-users', users)
    } catch (error) {
      console.error('Error in leave-room:', error)
      socket.emit('error', 'Failed to leave room')
    }
  })

  // socket.on('webrtc-offer', ({ roomId, offer }) => {
  //   socket.to(roomId).emit('webrtc-offer', {
  //     offer,
  //     from: socket.data.userId
  //   })
  // })

  socket.on('webrtc-offer', ({ roomId, offer, to }) => {
    try {
      io.to(to).emit('webrtc-offer', {
        offer,
        from: socket.data.userId
      })
    } catch (error) {
      console.log('================================================')
      console.error('Error in webrtc-offer:', error.message)
      console.log('================================================')
      socket.emit('error', 'Failed to send webrtc-offer')
      console.log('================================================')
    }
  })

  socket.on('webrtc-answer', ({ roomId, answer }) => {
    try {
      socket.to(roomId).emit('webrtc-answer', {
        answer,
        from: socket.data.userId
      })
    } catch (error) {
      console.log('================================================')
      console.error('Error in webrtc-answer:', error.message)
      console.log('================================================')
      socket.emit('error', 'Failed to send webrtc-answer')
      console.log('================================================')
    }
  })

  socket.on('ice-candidate', ({ roomId, candidate }) => {
    try {
      socket.to(roomId).emit('ice-candidate', {
        candidate,
        from: socket.data.userId
      })
    } catch (error) {
      console.error('Error in ice-candidate:', error)
      socket.emit('error', 'Failed to send webrtc-answer')
    }
  })

  socket.on('ice-candidate', ({ roomId, candidate }) => {
    try {
      socket.to(roomId).emit('ice-candidate', {
        candidate,
        from: socket.data.userId
      })
    } catch (error) {
      console.error('Error in ice-candidate:', error)
      socket.emit('error', 'Failed to send ice-candidate')
    }
  })

  socket.on('disconnect', async () => {
    try {
      console.log('Socket disconnection started')
      for (const roomId of socket.rooms) {
        console.log('Room ID: ', roomId)
        if (roomId === socket.id) continue // skip the default room
        await removeUserFromRoom(roomId, socket.data.userId)
        const users = await getRoomUsers(roomId)
        io.to(roomId).emit('room-users', users)
      }
      console.log('socket disconnected', socket.data.userId)
    } catch (error) {
      console.error('Error in disconnect:', error)
      socket.emit('error', 'Failed to disconnect')
    }
  })
}
