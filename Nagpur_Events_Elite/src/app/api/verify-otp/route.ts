import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import OTP from "@/lib/models/OTP";
import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    await connectDB();

    // MongoDB TTL index handles expiration, so we just find the matching OTP
    const otpDoc = await OTP.findOne({ email, otp });

    if (!otpDoc) {
      return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 });
    }

    const user = await User.findOneAndUpdate({ email }, { isVerified: true }, { new: true });
    
    // Delete all OTPs for this email after successful verification
    await OTP.deleteMany({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Auto-login after verification
    const payload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const accessToken = signToken(payload);
    const refreshToken = (await import("@/lib/auth")).signRefreshToken(payload);

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
      message: "Email verified successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json({ message: error.message || "Verification failed" }, { status: 500 });
  }
}
