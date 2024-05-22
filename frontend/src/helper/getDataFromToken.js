import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export default function getDataFromToken(request) {
  try {
    const token = request.cookies.get("token")?.value;
    const decodedToken = jwt.decode(token);
    const userId = decodedToken?.userId;
    return userId;
  } catch (err) {
    console.log(err);
  }
}
