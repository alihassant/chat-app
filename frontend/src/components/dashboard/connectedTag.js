"use client";

import React, { useEffect, useState } from "react";
import { useSocketContext } from "../../context/socketContext";
import { useUserContext } from "@/context/userContext";

const ConnectedTag = () => {
  const socket = useSocketContext();
  const user = useUserContext();
  const [message, setMessage] = useState(
    "You are not connected to the socket server."
  );

  useEffect(() => {
    if (socket) {
      // socket.on("connect", () => {
      //   // console.log("Connected to socket");
      //   // const userId = user._id; // Replace this with the actual user ID
      //   // socket.emit("userId", userId);
      //   setMessage("Connected to socket");
      // });

      socket.on("notification", (data) => {
        setMessage(data.message);
        // console.log("called notification event from server");
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from socket");
      });
    }
  }, [socket, user]);

  return (
    <div className="offset-md-4 text-center pt-4 col-md-6 mx-auto">
      <div>{message}</div>
      {(socket && <div>Socket ID: {socket?.id}</div>) || (
        <div>Socket ID: Not Assigned</div>
      )}
    </div>
  );
};

export default ConnectedTag;
