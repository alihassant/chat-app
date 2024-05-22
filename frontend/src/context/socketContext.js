"use client";

import { useRouter } from "next/navigation";
import React, { createContext, useState, useEffect, useContext } from "react";

import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Establish the socket connection based on the current route
    const newSocket = io("http://localhost:8080"); // Replace with your server URL
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []); // Reconnect on route changes

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export function useSocketContext() {
  return useContext(SocketContext);
}
