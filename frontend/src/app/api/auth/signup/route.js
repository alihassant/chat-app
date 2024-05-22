import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();
    const response = await axios.post(
      "http://localhost:8080/api/auth/signup",
      data
    );
    return NextResponse.json(response.data);
  } catch (err) {
    return NextResponse.error(err);
  }
}
