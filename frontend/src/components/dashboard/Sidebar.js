"use client";

import { useUserContext } from "@/context/userContext";
import { handleLogout } from "@/utils/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserSearchModal from "../modal/UserSearchModal";
import { useSocketContext } from "@/context/socketContext";

export default function Sidebar({ isSmallScreen }) {
  const router = useRouter();
  const [searchName, setSearchName] = useState("");

  const socket = useSocketContext();
  const user = useUserContext();

  function handleSearch(e) {
    setSearchName(e.target.value);
  }

  let filteredNames;

  if (user) {
    const sortedFriends = user.friends.sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
    filteredNames = sortedFriends.filter((friend) =>
      friend._id.name.toLowerCase().includes(searchName.toLowerCase())
    );
  }

  const logout = () => {
    handleLogout();
    router.push("/login");
  };

  useEffect(() => {
    if (socket) {
    }
  }, [socket]);

  return (
    <>
      {user && (
        <div
          className="container-fluid d-flex flex-column flex-shrink-0 p-3 "
          style={{
            width: isSmallScreen ? "100%" : "300px",
            height: "100vh",
            float: "left",
            background: "#8B322C",
          }}
          bis_skin_checked={1}
        >
          <Link
            href="/chat"
            className="d-flex align-items-center ms-md-2 mb-3 mb-md-0 me-md-auto link-dark text-decoration-none"
          >
            <span className="fw-bold fs-3" style={{ color: "#F5EFE6" }}>
              <i className="bi bi-chat-right-text px-2"></i>
              Chat App
            </span>
          </Link>
          <hr />
          <form className="d-flex" role="search">
            <input
              className="form-control mx-md-3 my-md-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              onChange={handleSearch}
            />
            {/* <button className="btn btn-outline-secondary" type="submit">
            Search
          </button> */}
          </form>
          <hr />

          <div className="overflow-auto" style={{ height: "100vh" }}>
            <ul className="nav nav-pills flex-column mb-auto mt-3">
              {(user &&
                user.friends.length !== 0 &&
                filteredNames.map((friend) => (
                  <li
                    key={friend?._id._id}
                    className="nav-item position-relative"
                  >
                    <Link
                      href={`/chat/${friend?._id.username}`}
                      className="nav-link"
                      aria-current="page"
                      style={{ color: "#F5EFE6" }}
                    >
                      <span>{friend?._id.name}</span>
                      {friend?.messages.length > 0 &&
                        friend?.messages[friend.messages.length - 1].sender !==
                          user._id &&
                        !friend?.messages[friend.messages.length - 1].read && (
                          <span className="dot" />
                        )}
                      <label
                        className="d-flex justify-content-end"
                        style={{ fontSize: "11px" }}
                      >
                        {new Date(friend?.updatedAt).toLocaleTimeString(
                          undefined,
                          {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true, // Set to true for 12-hour format
                          }
                        )}
                      </label>
                      <hr />
                    </Link>
                  </li>
                ))) || (
                <li className="nav-item mt-5 d-flex justify-content-center">
                  Add new friends
                </li>
              )}
            </ul>
          </div>
          <hr />
          <UserSearchModal userId={user?._id} />
          <div className="dropdown" bis_skin_checked={1}>
            <hr />
            <a
              href="#"
              className="d-flex align-items-center link-dark text-decoration-none dropdown-toggle"
              id="dropdownUser2"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <Image
                src="https://github.com/mdo.png"
                alt=""
                width={32}
                height={32}
                className="rounded-circle me-2"
              />
              <strong style={{ color: "#F5EFE6" }}>
                {user.username || "username"}
              </strong>
            </a>
            <ul
              className="dropdown-menu text-small shadow"
              aria-labelledby="dropdownUser2"
              style={{}}
            >
              <li>
                <a className="dropdown-item" href="#">
                  New project...
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Settings
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Profile
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button className="dropdown-item" onClick={logout}>
                  Sign out
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
