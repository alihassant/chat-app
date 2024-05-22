import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request) {
  const token = request.cookies.get("token")?.value;
  const data = await request.json();
  try {
    const res = await axios.post(
      "http://localhost:8080/api/user/sendMessage",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return NextResponse.json(res.data);
  } catch (err) {
    return NextResponse.error(err);
  }
}
