"use client";

import React from "react";
import { useUserContext } from "@/context/userContext";
import Loading from "@/components/Loading";

const ChatMain = () => {
  const user = useUserContext();

  return (
    <>
      {(user && (
        <div
          className="d-flex justify-content-center align-items-center flex-column"
          style={{ height: "100vh" }}
        >
          <p className="text-muted">
            Click on a friend&apos;s name to start chatting.
          </p>
          <br />
          <p className="text-muted">
            If you don&apos;t have any friend added, start adding some by
            clicking the &quot;Add Friends&quot; button!
          </p>
        </div>
      )) || <Loading />}
    </>
  );
};

export default ChatMain;
