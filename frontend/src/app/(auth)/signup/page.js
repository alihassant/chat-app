"use client";

import Spinner from "@/components/Spinner";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const INITIAL_USER = {
  name: "",
  email: "",
  username: "",
  password: "",
};

export default function Login() {
  const router = useRouter();

  const [seePass, setSeePass] = useState(false);
  const [user, setUser] = useState(INITIAL_USER);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      if (
        user.name === "" ||
        user.email === "" ||
        user.password === "" ||
        user.username === ""
      ) {
        setError("All fields are required");
      }

      //   const url = `http://localhost:8080/api/auth/signup`;
      const url = "/api/auth/signup";
      const payload = { ...user };

      const response = await axios.post(url, payload);

      if (response.status === 200) {
        router.push("/login");
      }
    } catch (err) {
      setError(err.message);
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
                      Create an account
                    </h2>
                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}
                    <form onSubmit={handleSubmit}>
                      <div className="row gy-2 overflow-hidden">
                        <div className="col-12">
                          <div className="form-floating mb-3">
                            <input
                              type="name"
                              className="form-control"
                              name="name"
                              id="name"
                              placeholder="name"
                              onChange={handleChange}
                            />
                            <label htmlFor="name" className="form-label">
                              Name
                            </label>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-floating mb-3">
                            <input
                              type="email"
                              className="form-control"
                              name="email"
                              id="email"
                              placeholder="name@example.com"
                              onChange={handleChange}
                            />
                            <label htmlFor="email" className="form-label">
                              Email
                            </label>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-floating mb-3">
                            <input
                              type="text"
                              className="form-control"
                              name="username"
                              id="username"
                              defaultValue=""
                              placeholder="Username"
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
                              defaultValue=""
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
                          <div className="d-grid my-3">
                            <button
                              className="btn btn-lg"
                              type="submit"
                              style={{
                                background: "#153448",
                                color: "#F5EFE6",
                              }}
                            >
                              {loading ? <Spinner /> : "Signup"}
                            </button>
                          </div>
                        </div>
                        <div className="col-12">
                          <p
                            className="m-0 text-center"
                            style={{ color: "#F5EFE6" }}
                          >
                            Already have an account?{" "}
                            <Link
                              href="/login"
                              style={{
                                color: "#153448",
                              }}
                            >
                              Login
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
