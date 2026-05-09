import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    // Decoding without verification as we just want to show the username from the payload
    // In a real app, you'd verify the signature with a secret/public key
    const payload = jose.decodeJwt(token);
    
    // Adjust based on your JWT payload structure
    // Some APIs use 'username', 'email', 'sub', etc.
    const username = payload.username || payload.email || payload.sub || "User";

    return NextResponse.json({ username, payload });
  } catch (error) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
