import { io } from "socket.io-client";
export const socket = io(`${process.env.REACT_APP_NODE_API_URL}`);
