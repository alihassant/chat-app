"use client";

import axios from "axios";
import React, { useState } from "react";
import Spinner from "../Spinner";

const INITIAL_USER_SEARCH = {
  username: "",
};

const UserSearchModal = ({ userId }) => {
  const [userSearch, setUserSearch] = useState(INITIAL_USER_SEARCH);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [errorM, setErrorM] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setUserSearch({ ...userSearch, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setUsers([]);
      setLoading(true);
      const response = await axios.get(`/api/user/searchUsers/`, {
        params: userSearch,
      });
      const data = await response.data;
      if (data) {
        setUsers(data);
      }
    } catch (err) {
      setErrorM("No user found!");
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddFriendSubmit(e) {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      const payload = { friendUsername: users?.username };
      const res = await axios.post(`/api/user/addFriend`, payload);
      if (
        res.data.message === "Friend already added" ||
        res.data.message === "You cannot add yourself as a friend"
      ) {
        setError(res.data.message);
      }
      setSuccess("Added!");
      setTimeout(() => {
        setSuccess(null);
      }, 2000);
    } catch (err) {
      setError(err.response.data.message);
      console.log(err);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      {/* Button trigger modal */}
      <button
        type="button"
        className="btn"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        style={{ color: "#F0EBE3" }}
      >
        Add Friends
      </button>
      {/* Modal */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div
              className="modal-header"
              style={{ backgroundColor: "#8B322C" }}
            >
              <h1
                className="modal-title fs-5"
                style={{ color: "#f5efe6" }}
                id="exampleModalLabel"
              >
                Find Users
              </h1>
              <button
                type="button"
                className="btn-close btn-outline-gray"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  setUserSearch(INITIAL_USER_SEARCH);
                  setUsers([]);
                  setError(null);
                  setErrorM(null);
                  setSuccess(null);
                  setLoading(false);
                }}
              />
            </div>
            <div
              className="modal-body"
              style={{ backgroundColor: "#F5EFE6", height: "50vh" }}
            >
              <div className="row">
                <form className="d-flex" role="search" onSubmit={handleSubmit}>
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Enter username"
                    aria-label="Search"
                    name="username"
                    value={userSearch.username}
                    onChange={handleChange}
                  />
                  <button className="btn btn-outline-success" type="submit">
                    Search
                  </button>
                </form>
              </div>
              <div className="row">
                <div>
                  {(users.length !== 0 && (
                    <ul className="list-group">
                      {/* {users.map((user) => ( */}
                      <li
                        className="list-group-item mt-3"
                        key={users.id}
                        style={{ backgroundColor: "#f5efe6" }}
                      >
                        <div className="row">
                          <div className="col-md-6 d-flex align-items-center">
                            {users.username}
                          </div>
                          <div className="col-md-6 d-flex justify-content-end">
                            <button
                              className="btn btn-outline-success"
                              onClick={handleAddFriendSubmit}
                            >
                              {loading ? (
                                <div className="d-flex justify-content-center">
                                  <div
                                    style={{
                                      maxHeight: "25px",
                                      maxWidth: "25px",
                                    }}
                                    className="spinner-border"
                                    role="status"
                                  >
                                    <span className="visually-hidden">
                                      Loading...
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                success || "Add Friend"
                              )}
                            </button>
                          </div>
                        </div>
                      </li>
                      {/* ))} */}
                    </ul>
                  )) || (
                    <div className="d-flex justify-content-center text-muted pt-md-3">
                      {loading ? <Spinner /> : errorM || "Search Users"}
                    </div>
                  )}
                  {error && (
                    <ul className="list-group">
                      <li
                        className="list-group-item mt-3"
                        style={{ backgroundColor: "#f5efe6" }}
                      >
                        <div className="row">
                          <div className="d-flex align-items-center justify-content-center">
                            {error}
                          </div>
                        </div>
                      </li>
                      {/* ))} */}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            <div
              className="modal-footer"
              style={{ backgroundColor: "#8B322C" }}
            >
              <button
                type="button"
                className="btn btn-outline-gray"
                data-bs-dismiss="modal"
                onClick={() => {
                  setUserSearch(INITIAL_USER_SEARCH);
                  setUsers([]);
                  setError(null);
                  setErrorM(null);
                  setSuccess(null);
                  setLoading(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserSearchModal;
