import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { signToken, signRefreshToken } from "@/lib/auth";
import { cookies } from "next/headers";

  export async function POST(req: Request) {
    try {
      const { email, password } = await req.json();
      console.log(`🔑 Login attempt received for: ${email}`);
  
      if (!email || !password) {
        console.log("❌ Login failed: Missing email or password");
        return NextResponse.json({ message: "Missing email or password" }, { status: 400 });
      }
  
      await connectDB();
      const user = await User.findOne({ email: email.trim().toLowerCase() });


    if (!user) {
      console.log(`❌ Login failed: User not found for ${email}`);
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    if (!user.password) {
      console.log(`❌ Login failed: User ${email} has no password (signed up via Google?)`);
      return NextResponse.json({ message: "Invalid credentials. Please use Google login if you signed up with Google." }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      console.log(`❌ Login failed: Password mismatch for ${email}`);
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    if (!user.isVerified) {
      return NextResponse.json({ message: "Please verify your email first", needsVerification: true }, { status: 403 });
    }

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
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });

    cookieStore.set("refresh-token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
