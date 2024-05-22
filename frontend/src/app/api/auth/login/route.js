import { handleLogin } from "@/utils/auth";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request) {
  const data = await request.json();
  try {
    const url = "http://localhost:8080/api/auth/login";
    const response = await axios.post(url, data);
    const token = response.data.token;
    return NextResponse.json(response.data);
  } catch (err) {
    return NextResponse.error(err);
  }
}
