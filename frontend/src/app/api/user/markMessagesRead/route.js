import axios from "axios";
import { NextResponse } from "next/server";

export async function PUT(request) {
  const token = request.cookies.get("token")?.value;
  const data = await request.json();
  try {
    const { friendId } = data;
    const response = await axios.put(
      "http://localhost:8080/api/user/markMessagesRead",
      { friendId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return NextResponse.json(response.data);
  } catch (err) {
    return NextResponse.error(err);
  }
}
