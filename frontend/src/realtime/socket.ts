import { io } from "socket.io-client"

let socket: any

export function connectSocket() {

  socket = io(import.meta.env.VITE_API_URL, {
    withCredentials: true,
    transports: ["websocket"]
  })

  socket.on("connect", () => {
    console.log("socket connected")
  })

  return socket
}

export function getSocket() {
  return socket
}