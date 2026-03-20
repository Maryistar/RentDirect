import { io } from "socket.io-client";

export const socket = io("http://localhost:4000/chat", {
  auth: {
    token: localStorage.getItem("token")
  }
});

