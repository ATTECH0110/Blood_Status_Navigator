import { io } from "socket.io-client";

const socket = io("https://blood-status-tracker.onrender.com");
export default socket;
