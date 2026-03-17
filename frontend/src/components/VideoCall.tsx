import { useEffect, useRef } from "react";
import { connectSocket, getSocket } from "../realtime/socket";
import { createPeerConnection, getPeerConnection } from "../realtime/webrtc";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function VideoCall() {
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  const user = useSelector((state: any) => state.user);

  const roomId = useParams().roomId;

  const startMedia = async () => {
    let stream: MediaStream

try {

  const devices = await navigator.mediaDevices.enumerateDevices()

const cameras = devices.filter(d => d.kind === "videoinput")

 stream = await navigator.mediaDevices.getUserMedia({
  video: {
    deviceId: cameras[0].deviceId
  },
  audio: true
})

  // stream = await navigator.mediaDevices.getUserMedia({
  //   video: true,
  //   audio: true
  // })

} catch (err) {

  console.warn("camera unavailable, using fake stream")

  // stream = createFakeCamera()

}

    const socket = connectSocket();

    if (localRef.current) {
      localRef.current.srcObject = stream;
    }

    const pc = createPeerConnection(remoteRef.current!, roomId!);

    const offer = await pc.createOffer();

    await pc.setLocalDescription(offer);

    socket.emit("webrtc-offer", {
      roomId,
      offer,
    });

    socket.on("user-joined", (data) => {
      console.log("user-joined", data);
    });

    socket.on("webrtc-offer", async ({ offer, roomId }) => {
      await pc.setRemoteDescription(offer);

      const answer = await pc.createAnswer();

      await pc.setLocalDescription(answer);

      socket.emit("webrtc-answer", {
        roomId,
        answer,
      });
    });

    socket.on("webrtc-answer", async ({ answer }) => {
      await pc.setRemoteDescription(answer);
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      await pc.addIceCandidate(candidate);
    });

    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });
  };

  useEffect(() => {
    startMedia();

    const socket = connectSocket();

    socket.emit("join-room", {roomId, userId: user._id});

    const start = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (localRef.current) localRef.current.srcObject = stream;

      const pc = createPeerConnection(remoteRef.current!, roomId);

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      socket.on("webrtc-offer", async ({ offer, roomId }) => {
        await pc.setRemoteDescription(offer);

        console.log("remote sdp offer", offer);

        const answer = await pc.createAnswer();

        console.log("local sdp answer", answer);

        await pc.setLocalDescription(answer);

        socket.emit("webrtc-answer", {
          roomId,
          answer,
        });
      });

      socket.on("webrtc-answer", async ({ answer }) => {
        await pc.setRemoteDescription(answer);
      });

      socket.on("ice-candidate", async ({ candidate }) => {
        await pc.addIceCandidate(candidate);
      });

      socket.on("error", (error) => {
        console.error("Error in socket:", error);
      });
    };

    start();
  }, []);

  const call = async () => {
    const pc = getPeerConnection();

    const offer = await pc.createOffer();

    console.log("offer", offer);

    await pc.setLocalDescription(offer);

    getSocket().emit("webrtc-offer", {
      roomId,
      offer,
    });
  };

  return (
    <div>
      <h2>Room: {roomId}</h2>

      <div className="videos">
        <video ref={localRef} autoPlay muted playsInline />

        <video ref={remoteRef} autoPlay playsInline />
      </div>

      <button onClick={call}>Start Call</button>
    </div>
  );
}
