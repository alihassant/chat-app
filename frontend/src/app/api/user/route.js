import getDataFromToken from "@/helper/getDataFromToken";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request) {
  const token = request.cookies.get("token")?.value;
  try {
    const response = await axios.get("http://localhost:8080/api/user/getUser", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return NextResponse.json(response.data);
  } catch (err) {
    return NextResponse.error(err);
  }
}
