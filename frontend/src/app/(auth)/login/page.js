"use client";

import Spinner from "@/components/Spinner";
import { handleLogin } from "@/utils/auth";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const INITIAL_LOGIN = {
  username: "",
  password: "",
};

export default function Login() {
  const router = useRouter();

  const [login, setLogin] = useState(INITIAL_LOGIN);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [seePass, setSeePass] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      const url = `/api/auth/login`;
      const payload = { ...login, rememberMe };
      const response = await axios.post(url, payload);

      handleLogin(response?.data.token, rememberMe);

      router.push("/chat");
    } catch (err) {
      if (err.message === "Network Error") {
        setError("Network Error: Please check your internet connection.");
      }
      setError(err.response?.data.message);
      console.log(err);
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <>
        <section className="bg-light py-3 py-md-5" style={{ height: "100vh" }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-6 col-xxl-6">
                <div
                  className="card border border-light-subtle rounded-3 shadow-sm"
                  style={{
                    background: "#8B322C",
                  }}
                >
                  <div className="card-body p-3 p-md-4 p-xl-5">
                    <div
                      className="fw-bold fs-1 text-center mb-3"
                      style={{ color: "#153448" }}
                    >
                      Chat App
                    </div>
                    <h2
                      className="fs-6 fw-normal text-center mb-4"
                      style={{ color: "#F5EFE6" }}
                    >
                      Sign in to your account
                    </h2>
                    <form onSubmit={handleSubmit}>
                      <div className="row gy-2 overflow-hidden">
                        <div className="col-12">
                          <div className="form-floating mb-3">
                            <input
                              type="text"
                              className="form-control"
                              name="username"
                              id="username"
                              placeholder="name@example.com"
                              value={login.username}
                              onChange={handleChange}
                            />
                            <label htmlFor="username" className="form-label">
                              Username
                            </label>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-floating mb-3">
                            <input
                              type={seePass ? "text" : "password"}
                              className="form-control"
                              name="password"
                              id="password"
                              value={login.password}
                              placeholder="Password"
                              onChange={handleChange}
                            />
                            <label htmlFor="password" className="form-label">
                              Password
                            </label>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex gap-2 justify-content-between">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="seePass"
                                id="seePass"
                                onChange={() => setSeePass(!seePass)}
                                style={{
                                  backgroundColor: seePass
                                    ? "#153448"
                                    : "white", // Toggle background color for better visibility
                                }}
                              />
                              <label
                                className="form-check-label"
                                style={{ color: "#F5EFE6" }}
                                htmlFor="seePass"
                              >
                                See Password
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex gap-2 justify-content-between">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                defaultValue=""
                                name="rememberMe"
                                id="rememberMe"
                                onChange={() => setRememberMe(!rememberMe)}
                                style={{
                                  backgroundColor: rememberMe
                                    ? "#153448"
                                    : "white", // Toggle background color for better visibility
                                }}
                              />
                              <label
                                className="form-check-label"
                                style={{ color: "#F5EFE6" }}
                                htmlFor="rememberMe"
                              >
                                Keep me logged in
                              </label>
                            </div>
                            <Link
                              href="#!"
                              style={{
                                color: "#F5EFE6",
                              }}
                            >
                              Forgot password?
                            </Link>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-grid my-3">
                            <button
                              className="btn btn-lg"
                              type="submit"
                              style={{
                                background: "#153448",
                                color: "#F5EFE6",
                              }}
                            >
                              {loading ? <Spinner /> : "Log in"}
                            </button>
                          </div>
                        </div>
                        <div className="col-12">
                          <p
                            className="m-0 text-center"
                            style={{ color: "#F5EFE6" }}
                          >
                            Don&apos;t have an account?{" "}
                            <Link
                              href="/signup"
                              style={{
                                color: "#153448",
                              }}
                            >
                              Sign up
                            </Link>
                          </p>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    </>
  );
}
