"use client";

import openSocket from "socket.io-client";

export const socket = openSocket("http://localhost:8080");
