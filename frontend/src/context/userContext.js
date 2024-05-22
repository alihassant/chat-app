"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { useSocketContext } from "./socketContext";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const socket = useSocketContext();

  const getUser = async () => {
    try {
      const response = await fetch("/api/user");
      const data = await response.json();
      const { user } = data;
      setUser(user);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("Connected to socket(from user context)");
      });
      if (user) {
        const userId = user._id; // Replace this with the actual user ID
        socket.emit("userId", userId);
        socket.on("addFriend", (data) => {
          setUser(data.user);
        });
        socket.on("newMessage", (data) => {
          setUser(data.user);
        });
        socket.on("markMessagesRead", (data) => {
          setUser(data.user);
        });
      }
    }
  }, [socket, user]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export function useUserContext() {
  return useContext(UserContext);
}
