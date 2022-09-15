import { io } from "socket.io-client";
import React from "react";
import { returnToken, returnEmail } from "../pages/Chat";

const token = returnToken();
const email = returnEmail();
const SOCKET_URL = "http://localhost:5001";

export const socket = io(SOCKET_URL, {
  extraHeaders: {
    Email: email,
    Token: token,
  },
});

export const AppContext = React.createContext();
