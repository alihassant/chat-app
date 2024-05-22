"use client";

import { messages } from "@/constants/data";
import { useUserContext } from "@/context/userContext";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

const INITIAL_MESSAGE_STATE = {
  message: "",
  receiverId: "",
};

const ChatId = ({ params }) => {
  const { id } = params;
  const user = useUserContext();

  if (user) {
    const friendId = user.friends.find((friend) => friend._id.username === id)
      ._id._id;
    INITIAL_MESSAGE_STATE.receiverId = friendId;
  }
  const messagesRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(INITIAL_MESSAGE_STATE);

  let friend, initials;
  if (user) {
    friend = user.friends.find((friend) => friend._id.username === id);
    const firstInitials = friend._id.name.split(" ")[0].charAt(0).toUpperCase();
    let lastInitials = firstInitials;
    if (friend._id.name.split(" ").length > 1) {
      lastInitials = friend._id.name.split(" ")[1].charAt(0).toUpperCase();
    }

    initials = `${firstInitials}${lastInitials}`;
  }

  const markMessagesRead = async () => {
    try {
      const friendId = user.friends.find((friend) => friend._id.username === id)
        ._id._id;

      const payload = { friendId };

      await axios.put("/api/user/markMessagesRead", payload);
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  };

  // Scroll to the bottom of the messages div
  const scrollToBottom = () => {
    if (messagesRef.current) {
      setLoading(true);
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollToBottom(); // Scroll to bottom when component mounts or messages change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Empty dependency array ensures it only runs after initial render

  useEffect(() => {
    if (user) {
      markMessagesRead(); // Mark messages as read
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setMessage((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const payload = { ...message };
      const response = await axios.post("/api/user/sendMessage", payload);

      if (response.status === 200) {
        setMessage(INITIAL_MESSAGE_STATE);
        scrollToBottom();
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      {user && friend && (
        <>
          {loading && (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "100vh" }}
            >
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          <div
            className="d-flex justify-content-start align-items-center overflow-auto"
            style={{
              backgroundColor: "#8B322C",
              height: "8vh",
              borderBottom: "1px solid #153448",
              borderLeft: "1px solid #153448",
              color: "#F5EFE6",
            }}
          >
            <Link href="/chat" style={{ color: "#F5EFE6" }}>
              <i className="bi bi-caret-left-fill ps-3 fs-4"></i>
            </Link>
            <div className="fs-4 ps-3">{friend._id.name}</div>
          </div>
          <div style={{ height: "100vh" }}>
            <div
              className="d-flex justify-content-end flex-column ps-md-5"
              style={{ backgroundColor: "#F5EFE6", height: "80vh" }}
            >
              <div className="overflow-auto" ref={messagesRef}>
                {(friend.messages.length !== 0 &&
                  friend.messages.map((message, index) => (
                    <div
                      key={index}
                      className={`d-flex ${
                        message.sender !== user._id
                          ? "justify-content-start"
                          : "justify-content-end"
                      } ${index === 0 && "mt-3"} mb-2 `}
                      style={{ width: "95%" }}
                    >
                      {message.sender !== user._id && (
                        <div className="d-flex align-items-center small-screen-margin-left me-2">
                          {initials}
                          <br />
                        </div>
                      )}
                      <div
                        className={`${
                          message.sender !== user._id ? "bg-p1" : "bg-p2"
                        } p-2 rounded`}
                        style={{ maxWidth: "50%" }}
                      >
                        {message.message}
                      </div>
                      {message.sender === user._id && (
                        <div className="d-flex align-items-center ms-2">
                          You
                          <br />
                        </div>
                      )}
                    </div>
                  ))) || (
                  <div className="d-flex justify-content-center mb-5 text-muted">
                    No messages yet
                  </div>
                )}
              </div>
            </div>
            <div
              className="d-flex align-items-center ps-sm-5 overflow-auto"
              style={{
                backgroundColor: "#F5EFE6",
                height: "12vh",
                borderTop: "1px solid #153448",
              }}
            >
              <div className="width-adjusted">
                <form className="d-flex" role="message" onSubmit={handleSubmit}>
                  <textarea
                    className="form-control me-2 col-sm-8 small-screen-textarea"
                    type="text"
                    placeholder="Type message here..."
                    aria-label="Message"
                    name="message"
                    onChange={handleChange}
                    value={message.message}
                  />
                  <button className="btn btn-send col-sm-2 " type="submit">
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ChatId;
