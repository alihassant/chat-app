"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { SocketProvider } from "@/context/socketContext";
import { UserProvider } from "@/context/userContext";
import { usePathname } from "next/navigation";

export default function ChatLayout({ children }) {
  const path = usePathname();

  // State to track screen size
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Function to update screen size state
  const updateScreenSize = () => {
    setIsSmallScreen(window.innerWidth <= 768); // Update state based on medium screen width
  };

  useEffect(() => {
    // Add event listener to update screen size state on resize
    window.addEventListener("resize", updateScreenSize);
    // Initial screen size check
    updateScreenSize();

    return () => {
      // Cleanup event listener on unmount
      window.removeEventListener("resize", updateScreenSize);
    };
  }, []);

  return (
    <SocketProvider>
      <UserProvider>
        {isSmallScreen && path === "/chat" && <Sidebar isSmallScreen />}

        {isSmallScreen && path !== "/chat" && (
          <div
            className="d-flex flex-column"
            style={{ height: "100vh", backgroundColor: "#F5EFE6" }}
          >
            {children}
          </div>
        )}

        {!isSmallScreen && (
          <>
            <Sidebar />
            <div
              className="d-flex flex-column"
              style={{ height: "100vh", backgroundColor: "#F5EFE6" }}
            >
              {children}
            </div>
          </>
        )}
      </UserProvider>
    </SocketProvider>
  );
}
