import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { signToken, signRefreshToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=NoCode", req.url));
  }

  try {
    // 1. Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID as string,
        client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
        redirect_uri: process.env.GOOGLE_CALLBACK as string,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenResponse.json();
    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", tokens);
      return NextResponse.redirect(new URL("/login?error=TokenExchangeFailed", req.url));
    }

    // 2. Get user info from Google
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const googleUser = await userResponse.json();
    if (!userResponse.ok) {
      return NextResponse.redirect(new URL("/login?error=UserFetchFailed", req.url));
    }

    await connectDB();

    // 3. Find or create user
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        image: googleUser.picture,
        isVerified: true, // Google accounts are pre-verified
        role: googleUser.email === 'eventhead@gmail.com' ? 'admin' : 'user',
      });
    } else if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    // 4. Issue tokens (JWT)
    const payload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const accessToken = signToken(payload);
    const refreshToken = signRefreshToken(payload);

    const cookieStore = await cookies();
    
    cookieStore.set("auth-token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60,
      path: "/",
    });

    cookieStore.set("refresh-token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    // 5. Redirect home
    return NextResponse.redirect(new URL("/", req.url));

  } catch (error) {
    console.error("Google Auth error:", error);
    return NextResponse.redirect(new URL("/login?error=AuthError", req.url));
  }
}
