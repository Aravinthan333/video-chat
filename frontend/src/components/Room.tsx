import { useState } from "react"
import { useNavigate } from "react-router-dom"

type Props = {
  setRoomId: (id: string) => void
}

export default function Room() {

  const navigate = useNavigate()

  const [room, setRoom] = useState("")

  return (
    <div className="center">
      <h2>Join Room</h2>

      <input
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        placeholder="room id"
      />

      <button onClick={() => navigate(`/call/${room}`)}>
        Join
      </button>
    </div>
  )
}