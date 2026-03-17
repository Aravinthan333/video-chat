import { getSocket } from "./socket";

let pc: RTCPeerConnection;

export function createPeerConnection(
  remoteVideo: HTMLVideoElement,
  roomId: string,
) {
  pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      getSocket().emit("ice-candidate", {
        roomId,
        candidate: event.candidate,
      });
    }
  };

  pc.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0];
  };

  pc.onconnectionstatechange = () => {
    console.log("connection state:", pc.connectionState);
  };

  pc.oniceconnectionstatechange = () => {
  console.log("ice state:", pc.iceConnectionState);

  if (pc.iceConnectionState === "failed") {
    console.error("ICE connection failed — try again");
  }
};

  return pc;
}

export function getPeerConnection() {
  return pc;
}
