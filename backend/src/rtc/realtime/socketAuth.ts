import { Socket } from 'socket.io'

export const socketAuthMiddleware = async (socket: Socket, next: any) => {
  try {
    console.log('socketAuthMiddleware: ===> ', socket.request.session)
    const session = socket.request.session

    if (!session || !session.passport?.user) {
      return next(new Error('Unauthorized'))
    }

    socket.data.userId = session.passport.user

    next()
  } catch (err) {
    next(err)
  }
}
