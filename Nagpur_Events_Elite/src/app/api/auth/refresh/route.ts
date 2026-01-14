import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyRefreshToken, signToken } from "@/lib/auth";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh-token")?.value;

    if (!refreshToken) {
      return NextResponse.json({ message: "No refresh token" }, { status: 401 });
    }

    const payload = verifyRefreshToken(refreshToken);

    if (!payload) {
      return NextResponse.json({ message: "Invalid refresh token" }, { status: 401 });
    }

    // Sign new access token
    const newAccessToken = signToken({
      id: payload.id,
      email: payload.email,
      role: payload.role,
      name: payload.name,
    });

    cookieStore.set("auth-token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
