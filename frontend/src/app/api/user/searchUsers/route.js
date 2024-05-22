import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request) {
  // Extract username from query string using URLSearchParams
  const urlParams = new URLSearchParams(request.url.split("?")[1]);
  const username = urlParams.get("username");
  const token = request.cookies.get("token")?.value;
  try {
    const response = await axios.get(
      `http://localhost:8080/api/user/searchUsers/${username}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return NextResponse.json(response.data.user);
  } catch (err) {
    return NextResponse.error(err);
  }
}
